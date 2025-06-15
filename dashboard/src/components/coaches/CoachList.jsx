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
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';

const CoachList = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLES.COACHES)
          .select('*');

        if (error) throw error;
        setCoaches(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Alert severity="error">Error loading coaches: {error}</Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Coaches</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/coaches/new')}
          >
            Add Coach
          </Button>
        </Box>
        <List>
          {coaches.map((coach) => (
            <ListItem key={coach.id} divider>
              <ListItemText
                primary={coach.name}
                secondary={coach.email}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="view coach"
                  onClick={() => navigate(`/coaches/${coach.id}`)}
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

export default CoachList;