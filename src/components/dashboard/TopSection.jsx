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

const TopSection = () => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalPDPs: 0,
    totalObservations: 0,
    totalCoaches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: playersCount, error: playersError },
          { count: pdpsCount, error: pdpsError },
          { count: observationsCount, error: observationsError },
          { count: coachesCount, error: coachesError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.PDP).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.OBSERVATIONS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.COACHES).select('*', { count: 'exact', head: true })
        ]);

        if (playersError) throw playersError;
        if (pdpsError) throw pdpsError;
        if (observationsError) throw observationsError;
        if (coachesError) throw coachesError;

        setStats({
          totalPlayers: playersCount || 0,
          totalPDPs: pdpsCount || 0,
          totalObservations: observationsCount || 0,
          totalCoaches: coachesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        Error loading stats: {error}
      </Alert>
    );
  }

  return (
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
    </Grid>
  );
};

export default TopSection; 