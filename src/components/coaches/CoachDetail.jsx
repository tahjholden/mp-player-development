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

const CoachDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoach, setEditedCoach] = useState(null);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLES.COACHES)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCoach(data);
        setEditedCoach(data);
      } catch (error) {
        console.error('Error fetching coach data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [id]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.COACHES)
        .update(editedCoach)
        .eq('id', id);

      if (error) throw error;
      setCoach(editedCoach);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating coach:', error);
      alert('Error updating coach: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        const { error } = await supabase
          .from(TABLES.COACHES)
          .delete()
          .eq('id', id);

        if (error) throw error;
        navigate('/coaches');
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
        Error loading coach: {error}
      </Alert>
    );
  }

  if (!coach) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Coach not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Coach Details
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
                  setEditedCoach(coach);
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
                Personal Information
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={editedCoach.first_name}
                    onChange={(e) => setEditedCoach({
                      ...editedCoach,
                      first_name: e.target.value
                    })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={editedCoach.last_name}
                    onChange={(e) => setEditedCoach({
                      ...editedCoach,
                      last_name: e.target.value
                    })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editedCoach.email}
                    onChange={(e) => setEditedCoach({
                      ...editedCoach,
                      email: e.target.value
                    })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editedCoach.phone}
                    onChange={(e) => setEditedCoach({
                      ...editedCoach,
                      phone: e.target.value
                    })}
                    margin="normal"
                  />
                </>
              ) : (
                <>
                  <Typography>
                    Name: {coach.first_name} {coach.last_name}
                  </Typography>
                  <Typography>
                    Email: {coach.email}
                  </Typography>
                  <Typography>
                    Phone: {coach.phone}
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

export default CoachDetail;