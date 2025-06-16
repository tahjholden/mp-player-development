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
  Collapse,
  Divider
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const PlayerList = ({ onViewPDPHistory, onUpdatePDP, onAddObservation }) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [pdps, setPdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  // Define the Old Gold color
  const oldGold = '#CFB53B';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch players and PDPs in parallel
        const [
          { data: playersData, error: playersError },
          { data: pdpsData, error: pdpsError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*'),
          supabase.from(TABLES.PDP).select('*')
        ]);

        if (playersError) throw playersError;
        if (pdpsError) throw pdpsError;

        setPlayers(playersData || []);
        setPdps(pdpsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get active PDP for a player
  const getActivePDP = (playerId) => {
    if (!playerId) return null;
    return pdps.find(pdp => pdp.player_id === playerId && pdp.active === true);
  };

  // Handle player expansion toggle
  const handleExpandPlayer = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: oldGold }} />
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
    <Card sx={{ 
      backgroundColor: '#000', 
      color: '#fff', 
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Players</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/players/new')}
            sx={{ 
              backgroundColor: oldGold, 
              '&:hover': { 
                backgroundColor: '#BFA52B' 
              }
            }}
          >
            Add Player
          </Button>
        </Box>
        <List sx={{ width: '100%' }}>
          {players && players.length > 0 ? (
            players
              .filter(player => player && player.id) // Filter out null/undefined players
              .map((player) => {
                const activePDP = getActivePDP(player.id);
                const isExpanded = expandedPlayer === player.id;
                
                return (
                  <React.Fragment key={player.id}>
                    <ListItem 
                      button 
                      onClick={() => handleExpandPlayer(player.id)}
                      sx={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': { 
                          backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {player.first_name} {player.last_name}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                            {player.position || 'No position specified'}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        {isExpanded ? 
                          <ExpandLessIcon sx={{ color: oldGold }} /> : 
                          <ExpandMoreIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        }
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                        <Typography variant="subtitle1" sx={{ color: oldGold, mb: 1 }}>
                          Development Plan
                        </Typography>
                        
                        {activePDP ? (
                          <>
                            <Typography sx={{ color: '#fff', mb: 1, fontSize: '0.9rem' }}>
                              {activePDP.content?.substring(0, 100)}
                              {activePDP.content?.length > 100 ? '...' : ''}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 2 }}>
                              Created: {new Date(activePDP.created_at).toLocaleDateString()}
                            </Typography>
                          </>
                        ) : (
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, fontStyle: 'italic' }}>
                            No active development plan
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddObservation && onAddObservation(player);
                            }}
                            sx={{ 
                              borderColor: 'rgba(255, 255, 255, 0.3)', 
                              color: '#fff',
                              '&:hover': { 
                                borderColor: oldGold, 
                                backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                              }
                            }}
                          >
                            Add Observation
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdatePDP && onUpdatePDP(player);
                            }}
                            sx={{ 
                              borderColor: oldGold, 
                              color: oldGold,
                              '&:hover': { 
                                borderColor: oldGold, 
                                backgroundColor: 'rgba(207, 181, 59, 0.1)' 
                              }
                            }}
                          >
                            {activePDP ? 'Edit PDP' : 'Create PDP'}
                          </Button>
                          
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewPDPHistory && onViewPDPHistory(player);
                            }}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': { 
                                color: oldGold 
                              }
                            }}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Collapse>
                  </React.Fragment>
                );
              })
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                    No players found
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default PlayerList;
