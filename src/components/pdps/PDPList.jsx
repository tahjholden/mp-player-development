import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../../lib/supabase';
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
  Alert,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
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
        const [
          { data: pdpsData, error: pdpsError },
          { data: playersData, error: playersError }
        ] = await Promise.all([
          supabase.from(TABLES.PDP).select('*'),
          supabase.from(TABLES.PLAYERS).select('*')
        ]);

        if (pdpsError) throw pdpsError;
        if (playersError) throw playersError;

        setPdps(pdpsData || []);
        setPlayers(playersData || []);
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
    return player ? `${player.first_name} ${player.last_name}` : 'Unknown Player';
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
                primary={getPlayerName(pdp.player_id)}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {format(new Date(pdp.start_date), 'MMM d, yyyy')} - {format(new Date(pdp.target_end_date), 'MMM d, yyyy')}
                    </Typography>
                    {' — '}
                    <Chip
                      label={pdp.status}
                      size="small"
                      color={pdp.status === 'active' ? 'success' : 'default'}
                    />
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