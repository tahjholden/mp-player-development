import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../../lib/supabase';
import { format, subDays } from 'date-fns';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

/**
 * TopSection - Displays key statistics at the top of the dashboard
 * 
 * @param {Object} props
 * @param {function} props.onRefresh - Optional callback when refresh is clicked
 */
const TopSection = ({ onRefresh }) => {
  const [stats, setStats] = useState({
    playerCount: 0,
    weeklyObservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Define the Old Gold color
  const oldGold = '#CFB53B';

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      
      // Get one week ago date
      const oneWeekAgo = subDays(new Date(), 7).toISOString();
      
      // Fetch data in parallel
      const [
        { data: players, error: playersError },
        { data: weeklyObs, error: obsError }
      ] = await Promise.all([
        // Get total player count
        supabase.from(TABLES.PLAYERS).select('id', { count: 'exact' }),
        
        // Get observations from the past week
        supabase
          .from(TABLES.OBSERVATIONS)
          .select('id', { count: 'exact' })
          .gte('created_at', oneWeekAgo)
      ]);
      
      if (playersError) throw playersError;
      if (obsError) throw obsError;
      
      setStats({
        playerCount: players.length,
        weeklyObservations: weeklyObs.length
      });
      
      // Call the onRefresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          Dashboard
        </Typography>
        
        <Tooltip title="Refresh statistics">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ 
              color: oldGold,
              '&:hover': {
                backgroundColor: 'rgba(207, 181, 59, 0.1)'
              }
            }}
          >
            {refreshing ? (
              <CircularProgress size={24} sx={{ color: oldGold }} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3}>
        {/* Total Players */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              backgroundColor: '#000',
              color: '#fff',
              border: `1px solid ${oldGold}`,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: oldGold, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Total Players
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: oldGold
                }}
              >
                {loading ? (
                  <CircularProgress size={40} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                ) : (
                  stats.playerCount
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Observations This Week */}
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              backgroundColor: '#000',
              color: '#fff',
              border: `1px solid ${oldGold}`,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ color: oldGold, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Observations This Week
                </Typography>
              </Box>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: oldGold
                }}
              >
                {loading ? (
                  <CircularProgress size={40} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                ) : (
                  stats.weeklyObservations
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopSection;
