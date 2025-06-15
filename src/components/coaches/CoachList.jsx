import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CoachList = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLES.COACHES)
          .select('*')
          .order('last_name', { ascending: true });

        if (error) throw error;
        setCoaches(data || []);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleDelete = async (coachId) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        const { error } = await supabase
          .from(TABLES.COACHES)
          .delete()
          .eq('id', coachId);

        if (error) throw error;
        setCoaches(coaches.filter(coach => coach.id !== coachId));
      } catch (error) {
        console.error('Error deleting coach:', error);
        alert('Error deleting coach: ' + error.message);
      }
    }
  };

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
        Error loading coaches: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Coaches
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/coaches/new')}
        >
          Add Coach
        </Button>
      </Box>

      <Grid container spacing={3}>
        {coaches.map((coach) => (
          <Grid item xs={12} sm={6} md={4} key={coach.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {coach.first_name} {coach.last_name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Email: {coach.email}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Phone: {coach.phone}
                </Typography>
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/coaches/${coach.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(coach.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoachList; 