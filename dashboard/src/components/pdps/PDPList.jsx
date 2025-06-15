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

const PDPList = () => {
  const navigate = useNavigate();
  const [pdps, setPdps] = useState([]);
  const [players, setPlayers] = useState([]);
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
        { data: pdpsData, error: pdpsError },
        { data: playersData, error: playersError }
      ] = await Promise.all([
        supabase.from('pdps').select('*'),
        supabase.from('players').select('*')
      ]);

      if (pdpsError) throw pdpsError;
      if (playersError) throw playersError;

      setPdps(pdpsData || []);
      setPlayers(playersData || []);

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
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Player Development Plans</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/pdps/new')}
          >
            Add PDP
          </Button>
        </Box>
        <List>
          {pdps.map((pdp) => (
            <ListItem key={pdp.id} divider>
              <ListItemText
                primary={getPlayerName(pdp.playerId)}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {pdp.title}
                    </Typography>
                    {' — '}
                    {pdp.status}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="view pdp"
                  onClick={() => navigate(`/pdps/${pdp.id}`)}
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

export default PDPList;