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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';

const PDPList = () => {
  const navigate = useNavigate();
  const [pdps, setPdps] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdps = async () => {
      try {
        const { data: pdpsData, error: pdpsError } = await
          supabase.from(TABLES.PDP).select('*');

        if (pdpsError) throw pdpsError;

        setPdps(pdpsData || []);
      } catch (error) {
        console.error('Error fetching PDPs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPdps();
  }, []);

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'draft':
        return 'warning';
      default:
        return 'default';
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
      <Box p={2}>
        <Alert severity="error">Error loading PDPs: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">Error loading PDPs: {error}</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Player Development Plans</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/pdps/new')}
              >
                New PDP
              </Button>
            </Box>
          </Grid>
          {pdps.map((pdp) => (
            <Grid item xs={12} md={6} lg={4} key={pdp.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {pdp.development_focus}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Status:
                    </Typography>
                    <Chip
                      label={pdp.status}
                      color={getStatusColor(pdp.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Start Date: {format(new Date(pdp.start_date), 'MM/dd/yyyy')}
                  </Typography>
                  {pdp.target_end_date && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Target End: {format(new Date(pdp.target_end_date), 'MM/dd/yyyy')}
                    </Typography>
                  )}
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/pdps/${pdp.id}`)}
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

export default PDPList;