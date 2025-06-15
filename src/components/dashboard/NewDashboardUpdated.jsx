import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../../lib/supabase';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const NewDashboardUpdated = () => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalPDPs: 0,
    totalObservations: 0,
    totalCoaches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          { count: playersCount, error: playersError },
          { count: pdpsCount, error: pdpsError },
          { count: observationsCount, error: observationsError },
          { count: coachesCount, error: coachesError },
          { data: pdpData, error: pdpDataError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.PDP).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.OBSERVATIONS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.COACHES).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.PDP).select('*')
        ]);

        if (playersError) throw playersError;
        if (pdpsError) throw pdpsError;
        if (observationsError) throw observationsError;
        if (coachesError) throw coachesError;
        if (pdpDataError) throw pdpDataError;

        setStats({
          totalPlayers: playersCount || 0,
          totalPDPs: pdpsCount || 0,
          totalObservations: observationsCount || 0,
          totalCoaches: coachesCount || 0,
        });

        // Process PDP data for chart
        const statusCounts = pdpData.reduce((acc, pdp) => {
          acc[pdp.status] = (acc[pdp.status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        }));

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading dashboard data: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Players
              </Typography>
              <Typography variant="h4">
                {stats.totalPlayers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total PDPs
              </Typography>
              <Typography variant="h4">
                {stats.totalPDPs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Observations
              </Typography>
              <Typography variant="h4">
                {stats.totalObservations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Coaches
              </Typography>
              <Typography variant="h4">
                {stats.totalCoaches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PDP Status Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewDashboardUpdated; 