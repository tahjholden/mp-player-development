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
import { format } from 'date-fns';

const ObservationList = () => {
  const navigate = useNavigate();
  const [observations, setObservations] = useState([]);
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: observationsData, error: observationsError },
        { data: playersData, error: playersError },
        { data: coachesData, error: coachesError }
      ] = await Promise.all([
        supabase.from('observations').select('*'),
        supabase.from('players').select('*'),
        supabase.from('coaches').select('*')
      ]);

      if (observationsError) throw observationsError;
      if (playersError) throw playersError;
      if (coachesError) throw coachesError;

      setObservations(observationsData || []);
      setPlayers(playersData || []);
      setCoaches(coachesData || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'Unknown Coach';
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">Error loading observations: {error}</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Observations</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/observations/new')}
              >
                New Observation
              </Button>
            </Box>
          </Grid>
          {observations.map((observation) => (
            <Grid item xs={12} md={6} lg={4} key={observation.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {observation.summary}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: {format(new Date(observation.observation_date), 'MM/dd/yyyy')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Type: {observation.type}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/observations/${observation.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ObservationList;