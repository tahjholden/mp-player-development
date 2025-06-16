import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, TABLES } from '../../../../src/lib/supabase';
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
import { FaArrowLeft, FaEdit, FaUser, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ObservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [observation, setObservation] = useState(null);
  const [player, setPlayer] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: obsData, error: obsError } = await supabase
          .from(TABLES.OBSERVATIONS)
          .select('*')
          .eq('id', id)
          .single();

        if (obsError) throw obsError;

        const [
          { data: playerData, error: playerError },
          { data: coachData, error: coachError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*').eq('id', obsData.playerId).single(),
          supabase.from(TABLES.COACHES).select('*').eq('id', obsData.coachId).single()
        ]);

        if (playerError) throw playerError;
        if (coachError) throw coachError;

        setObservation(obsData);
        setPlayer(playerData);
        setCoach(coachData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600 bg-green-100 border-green-300';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getRatingDescription = (rating) => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 8) return 'Very Good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Satisfactory';
    if (rating >= 5) return 'Needs Improvement';
    return 'Poor';
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>;
  }
  if (error) {
    return <Box p={2}><Alert severity="error">Error loading observation: {error}</Alert></Box>;
  }
  if (!observation) {
    return <Box p={2}><Alert severity="warning">Observation not found</Alert></Box>;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/observations')} sx={{ mr: 2 }}>Back</Button>
          <Typography variant="h5">Observation Details</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Player: {player?.name || 'Unknown Player'}</Typography>
          <Typography variant="subtitle1">Coach: {coach?.name || 'Unknown Coach'}</Typography>
          <Typography variant="body2" color="textSecondary">Date: {new Date(observation.created_at).toLocaleDateString()}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">{observation.notes}</Typography>
        </Box>
        {/* Add more fields as needed */}
      </CardContent>
    </Card>
  );
};

export default ObservationDetail;