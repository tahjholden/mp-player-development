import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, TABLES } from '../../lib/supabase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { format } from 'date-fns';

const ObservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [observation, setObservation] = useState(null);
  const [player, setPlayer] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedObservation, setEditedObservation] = useState(null);

  useEffect(() => {
    const fetchObservationData = async () => {
      try {
        const { data: observationData, error: observationError } = await supabase
          .from(TABLES.OBSERVATIONS)
          .select('*')
          .eq('id', id)
          .single();

        if (observationError) throw observationError;

        const { data: playerData, error: playerError } = await supabase
          .from(TABLES.PLAYERS)
          .select('*')
          .eq('id', observationData.player_id)
          .single();

        if (playerError) throw playerError;

        const { data: coachData, error: coachError } = await supabase
          .from(TABLES.COACHES)
          .select('*')
          .eq('id', observationData.coach_id)
          .single();

        if (coachError) throw coachError;

        setObservation(observationData);
        setPlayer(playerData);
        setCoach(coachData);
        setEditedObservation(observationData);
      } catch (error) {
        console.error('Error fetching observation data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObservationData();
  }, [id]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.OBSERVATIONS)
        .update(editedObservation)
        .eq('id', id);

      if (error) throw error;
      setObservation(editedObservation);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating observation:', error);
      alert('Error updating observation: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this observation?')) {
      try {
        const { error } = await supabase
          .from(TABLES.OBSERVATIONS)
          .delete()
          .eq('id', id);

        if (error) throw error;
        navigate('/observations');
      } catch (error) {
        console.error('Error deleting observation:', error);
        alert('Error deleting observation: ' + error.message);
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
        Error loading observation: {error}
      </Alert>
    );
  }

  if (!observation || !player || !coach) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Observation not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Observation Details
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setEditedObservation(observation);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Player Information
              </Typography>
              <Typography>
                Name: {player.first_name} {player.last_name}
              </Typography>
              <Typography>
                Date of Birth: {format(new Date(player.date_of_birth), 'MM/dd/yyyy')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Coach Information
              </Typography>
              <Typography>
                Name: {coach.first_name} {coach.last_name}
              </Typography>
              <Typography>
                Email: {coach.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Observation Details
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={editedObservation.observation_date}
                    onChange={(e) => setEditedObservation({
                      ...editedObservation,
                      observation_date: e.target.value
                    })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={editedObservation.notes}
                    onChange={(e) => setEditedObservation({
                      ...editedObservation,
                      notes: e.target.value
                    })}
                    margin="normal"
                  />
                </>
              ) : (
                <>
                  <Typography>
                    Date: {format(new Date(observation.observation_date), 'MM/dd/yyyy')}
                  </Typography>
                  <Typography>
                    Notes: {observation.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ObservationDetail;