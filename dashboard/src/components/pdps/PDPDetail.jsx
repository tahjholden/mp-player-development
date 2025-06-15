import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { FaArrowLeft, FaEdit, FaUser, FaCalendarAlt, FaFileAlt, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { TbTarget } from 'react-icons/tb';

const PDPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdp, setPdp] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPDPData();
  }, [id]);

  const fetchPDPData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: pdpData, error: pdpError } = await supabase
        .from('pdps')
        .select('*')
        .eq('id', id)
        .single();

      if (pdpError) throw pdpError;

      if (pdpData) {
        setPdp(pdpData);

        // Fetch player data
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', pdpData.playerId)
          .single();

        if (playerError) throw playerError;
        setPlayer(playerData);
      }

    } catch (err) {
      console.error('Error fetching PDP data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Review Due': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'Completed': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <Alert severity="error">Error loading PDP: {error}</Alert>
      </Box>
    );
  }

  if (!pdp) {
    return (
      <Box p={2}>
        <Alert severity="warning">PDP not found</Alert>
      </Box>
    );
  }

  const daysRemaining = calculateDaysRemaining(pdp.endDate);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/pdps')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5">PDP Details</Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Player: {player?.name || 'Unknown Player'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Title: {pdp.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Status: {pdp.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Progress: {pdp.progress}%
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Goals
          </Typography>
          {pdp.goals?.map((goal, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1">
                {goal.area}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {goal.description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Timeline
          </Typography>
          <Typography variant="body2" gutterBottom>
            Start Date: {new Date(pdp.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            End Date: {new Date(pdp.endDate).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PDPDetail;