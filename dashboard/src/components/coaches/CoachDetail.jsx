import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, TABLES } from '../../lib/supabase';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CoachDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [players, setPlayers] = useState([]);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: coachData, error: coachError } = await supabase
          .from(TABLES.COACHES)
          .select('*')
          .eq('id', id)
          .single();

        if (coachError) throw coachError;

        const { data: playersData, error: playersError } = await supabase
          .from(TABLES.PLAYERS)
          .select('*')
          .eq('coach_id', id);

        if (playersError) throw playersError;

        const { data: observationsData, error: observationsError } = await supabase
          .from(TABLES.OBSERVATIONS)
          .select('*')
          .eq('coach_id', id);

        if (observationsError) throw observationsError;

        setCoach(coachData);
        setPlayers(playersData || []);
        setObservations(observationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>;
  }
  if (error) {
    return <Box p={2}><Alert severity="error">Error loading coach: {error}</Alert></Box>;
  }
  if (!coach) {
    return <Box p={2}><Alert severity="warning">Coach not found</Alert></Box>;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/coaches')} sx={{ mr: 2 }}>Back</Button>
          <Typography variant="h5">Coach Details</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Name: {coach.name}</Typography>
          <Typography variant="subtitle1">Email: {coach.email}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Assigned Players</Typography>
          {players.length === 0 ? (
            <Typography variant="body2">No players assigned.</Typography>
          ) : (
            players.map((player) => (
              <Typography key={player.id} variant="body2">{player.name}</Typography>
            ))
          )}
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Observations</Typography>
          {observations.length === 0 ? (
            <Typography variant="body2">No observations for this coach.</Typography>
          ) : (
            observations.map((obs) => (
              <Typography key={obs.id} variant="body2">{obs.notes}</Typography>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoachDetail;