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
  Alert
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

const PlayerList = ({ onViewPDPHistory, onUpdatePDP }) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: playersData, error: playersError },
          { data: observationsData, error: observationsError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*'),
          supabase.from(TABLES.OBSERVATIONS).select('*')
        ]);

        if (playersError) throw playersError;
        if (observationsError) throw observationsError;

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
  }, []);

  const getPlayerObservations = (playerId) => {
    return observations.filter(obs => obs.playerId === playerId);
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
        <Alert severity="error">Error loading players: {error}</Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Players</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/players/new')}
          >
            Add Player
          </Button>
        </Box>
        <List>
          {players.map((player) => {
            const playerObservations = getPlayerObservations(player.id);
            return (
              <ListItem key={player.id} divider>
                <ListItemText
                  primary={player.name}
                  secondary={`${playerObservations.length} observations`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="view history"
                    onClick={() => onViewPDPHistory(player)}
                    sx={{ mr: 1 }}
                  >
                    <HistoryIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="update pdp"
                    onClick={() => onUpdatePDP(player)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default PlayerList;