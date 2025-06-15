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
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';

const PDPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdp, setPdp] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPdp, setEditedPdp] = useState(null);

  useEffect(() => {
    const fetchPDPData = async () => {
      try {
        const { data: pdpData, error: pdpError } = await supabase
          .from(TABLES.PDP)
          .select('*')
          .eq('id', id)
          .single();

        if (pdpError) throw pdpError;

        const { data: playerData, error: playerError } = await supabase
          .from(TABLES.PLAYERS)
          .select('*')
          .eq('id', pdpData.player_id)
          .single();

        if (playerError) throw playerError;

        setPdp(pdpData);
        setPlayer(playerData);
        setEditedPdp(pdpData);
      } catch (error) {
        console.error('Error fetching PDP data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPDPData();
  }, [id]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.PDP)
        .update(editedPdp)
        .eq('id', id);

      if (error) throw error;
      setPdp(editedPdp);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating PDP:', error);
      alert('Error updating PDP: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this PDP?')) {
      try {
        const { error } = await supabase
          .from(TABLES.PDP)
          .delete()
          .eq('id', id);

        if (error) throw error;
        navigate('/pdps');
      } catch (error) {
        console.error('Error deleting PDP:', error);
        alert('Error deleting PDP: ' + error.message);
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
        Error loading PDP: {error}
      </Alert>
    );
  }

  if (!pdp || !player) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        PDP not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          PDP Details
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
                  setEditedPdp(pdp);
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
                PDP Information
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Status"
                    select
                    value={editedPdp.status}
                    onChange={(e) => setEditedPdp({ ...editedPdp, status: e.target.value })}
                    margin="normal"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={editedPdp.notes}
                    onChange={(e) => setEditedPdp({ ...editedPdp, notes: e.target.value })}
                    margin="normal"
                  />
                </>
              ) : (
                <>
                  <Typography>
                    Status: {pdp.status}
                  </Typography>
                  <Typography>
                    Created: {format(new Date(pdp.created_at), 'MM/dd/yyyy')}
                  </Typography>
                  <Typography>
                    Notes: {pdp.notes}
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

export default PDPDetail;