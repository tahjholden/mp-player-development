import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">Error loading observations: {error}</Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Observations</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/observations/new')}
          >
            Add Observation
          </Button>
        </Box>
        <List>
          {observations.map((observation) => (
            <ListItem key={observation.id} divider>
              <ListItemText
                primary={getPlayerName(observation.playerId)}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {new Date(observation.created_at).toLocaleDateString()}
                    </Typography>
                    {' — '}
                    {observation.notes}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="view observation"
                  onClick={() => navigate(`/observations/${observation.id}`)}
                >
                  <VisibilityIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ObservationList;