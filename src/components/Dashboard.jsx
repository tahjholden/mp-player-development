import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { supabase, TABLES } from '../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    players: 0,
    coaches: 0,
    observations: 0,
    pdps: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: playersCount },
          { count: coachesCount },
          { count: observationsCount },
          { count: pdpsCount }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.COACHES).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.OBSERVATIONS).select('*', { count: 'exact', head: true }),
          supabase.from(TABLES.PDP).select('*', { count: 'exact', head: true })
        ]);

        setStats({
          players: playersCount || 0,
          coaches: coachesCount || 0,
          observations: observationsCount || 0,
          pdps: pdpsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message);
        // Set default stats when there's an error
        setStats({
          players: 0,
          coaches: 0,
          observations: 0,
          pdps: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Note: Unable to fetch data. Showing placeholder values.
        </Typography>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Players
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : stats.players}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Coaches
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : stats.coaches}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Observations
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : stats.observations}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              PDPs
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : stats.pdps}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 