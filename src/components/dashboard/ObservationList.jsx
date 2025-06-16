import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { PersonOutline as PersonIcon } from '@mui/icons-material';

/**
 * ObservationList - Displays a list of observations with player names
 * 
 * @param {Object} props
 * @param {string} props.playerId - Optional player ID to filter observations
 * @param {number} props.limit - Optional limit for number of observations to display
 */
const ObservationList = ({ playerId, limit = 10 }) => {
  const [observations, setObservations] = useState([]);
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build the query
        let query = supabase
          .from(TABLES.OBSERVATIONS)
          .select('*')
          .order('observation_date', { ascending: false });
        
        // Add player filter if provided
        if (playerId) {
          query = query.eq('player_id', playerId);
        }
        
        // Add limit if provided
        if (limit) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: observationsData, error: observationsError } = await query;
        
        if (observationsError) throw observationsError;
        
        // Get unique player IDs from observations
        const playerIds = [...new Set(observationsData.map(obs => obs.player_id))];
        
        // Fetch player data for those IDs
        if (playerIds.length > 0) {
          const { data: playersData, error: playersError } = await supabase
            .from(TABLES.PLAYERS)
            .select('id, first_name, last_name')
            .in('id', playerIds);
          
          if (playersError) throw playersError;
          
          // Create a lookup object for players
          const playersLookup = {};
          playersData.forEach(player => {
            playersLookup[player.id] = `${player.first_name} ${player.last_name}`;
          });
          
          setPlayers(playersLookup);
        }
        
        setObservations(observationsData || []);
      } catch (error) {
        console.error('Error fetching observations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId, limit]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Get player name from lookup
  const getPlayerName = (playerId) => {
    return players[playerId] || 'Unknown Player';
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
        <Alert severity="error">Error loading observations: {error}</Alert>
      </Box>
    );
  }

  return (
    <Card sx={{ 
      backgroundColor: '#000', 
      color: '#fff', 
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '100%'
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Observations
        </Typography>
        
        {observations && observations.length > 0 ? (
          <List sx={{ width: '100%', p: 0 }}>
            {observations.map((observation, index) => (
              <React.Fragment key={observation.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: 0,
                    py: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      mb: 1
                    }}
                  >
                    <Chip
                      avatar={<Avatar sx={{ bgcolor: oldGold }}><PersonIcon /></Avatar>}
                      label={getPlayerName(observation.player_id)}
                      sx={{ 
                        bgcolor: 'rgba(207, 181, 59, 0.1)', 
                        color: oldGold,
                        '& .MuiChip-avatar': {
                          color: '#000'
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        alignSelf: 'center'
                      }}
                    >
                      {formatDate(observation.observation_date)}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      mt: 1,
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }}
                  >
                    {observation.content}
                  </Typography>
                </ListItem>
                
                {index < observations.length - 1 && (
                  <Divider 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }} 
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 100
            }}
          >
            <Typography 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontStyle: 'italic'
              }}
            >
              No observations found
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ObservationList;
