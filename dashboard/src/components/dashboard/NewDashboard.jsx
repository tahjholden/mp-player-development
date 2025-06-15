import React, { useState, useEffect } from 'react';
import TopSection from './TopSection';
import PlayerList from './PlayerList';
import ObservationList from './ObservationList';
import PDPHistoryModal from './PDPHistoryModal';
import { dashboardService } from '../../lib/dashboardService';
import { FaUserPlus, FaClipboardCheck, FaChartLine } from 'react-icons/fa';
import { supabase, TABLES } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Import new modal components
import AddPlayerModal from './modals/AddPlayerModal';
import AddObservationModal from './modals/AddObservationModal';
import AddPDPModal from './modals/AddPDPModal';
import UpdatePDPModalNew from './modals/UpdatePDPModalNew';

const NewDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    playerCount: 0,
    observationCount: 0,
    pdpCount: 0,
    highPerformers: 0
  });
  const [players, setPlayers] = useState([]);
  const [observations, setObservations] = useState([]);
  const [pdps, setPdps] = useState([]);
  const [pdpHistory, setPdpHistory] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showPDPHistoryModal, setShowPDPHistoryModal] = useState(false);
  const [showUpdatePDPModal, setShowUpdatePDPModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddObservationModal, setShowAddObservationModal] = useState(false);
  const [showAddPDPModal, setShowAddPDPModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPDP, setSelectedPDP] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: playersData, error: playersError },
          { data: observationsData, error: observationsError },
          { data: pdpsData, error: pdpsError },
          { data: coachesData, error: coachesError }
        ] = await Promise.all([
          supabase.from(TABLES.PLAYERS).select('*'),
          supabase.from(TABLES.OBSERVATIONS).select('*'),
          supabase.from(TABLES.PDP).select('*'),
          supabase.from(TABLES.COACHES).select('*')
        ]);

        if (playersError) throw playersError;
        if (observationsError) throw observationsError;
        if (pdpsError) throw pdpsError;
        if (coachesError) throw coachesError;

        setPlayers(playersData || []);
        setObservations(observationsData || []);
        setPdps(pdpsData || []);
        setCoaches(coachesData || []);

        // Calculate stats
        const activePdps = pdpsData?.filter(pdp => pdp.active) || [];
        const highPerformers = playersData?.filter(player => player.skill_level >= 8) || [];

        // Get current week observations (Monday-Sunday)
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday (0)
        startOfWeek.setDate(currentDate.getDate() - diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const weeklyObservationsCount = observationsData?.filter(obs => {
          const obsDate = new Date(obs.observation_date);
          return obsDate >= startOfWeek && obsDate <= endOfWeek;
        }).length || 0;

        setStats({
          playerCount: playersData?.length || 0,
          observationCount: weeklyObservationsCount,
          pdpCount: activePdps.length,
          highPerformers: highPerformers.length
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPlayer = () => {
    setShowAddPlayerModal(true);
  };

  const handleAddObservation = () => {
    setShowAddObservationModal(true);
  };

  const handleAddPDP = () => {
    setShowAddPDPModal(true);
  };
  
  const handleViewPDPHistory = (player) => {
    setSelectedPlayer(player);
    setShowPDPHistoryModal(true);
  };
  
  const handleUpdatePDP = (player) => {
    setSelectedPlayer(player);
    setSelectedPDP(player.currentPDP);
    setShowUpdatePDPModal(true);
  };

  // Handler for adding a new player
  const handlePlayerSubmit = async (playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          ...playerData,
          last_observation: new Date().toISOString().split('T')[0],
          pdp_status: 'Not Started',
          skill_level: 5.0,
          pdp_summary: 'No active PDP'
        }])
        .select();

      if (error) throw error;

      setPlayers([...players, data[0]]);
      setShowAddPlayerModal(false);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error adding player:', err);
      setError(err.message);
    }
  };

  // Handler for adding a new observation
  const handleObservationSubmit = async (observationData) => {
    try {
      const { data: coachData } = await supabase
        .from('coaches')
        .select('*')
        .limit(1)
        .single();

      const coach = coachData || { id: 1, name: 'John Smith' };
      
      const { data, error } = await supabase
        .from('observations')
        .insert([{
          ...observationData,
          coach_id: coach.id,
          coach_name: coach.name,
          focus: observationData.notes.substring(0, 20) + '...',
          rating: Math.floor(Math.random() * 5) + 5,
          action_items: ['Review with player']
        }])
        .select();

      if (error) throw error;

      // Update player's last observation date
      const { error: updateError } = await supabase
        .from('players')
        .update({ last_observation: observationData.date })
        .eq('id', observationData.player_id);

      if (updateError) throw updateError;

      setObservations([...observations, data[0]]);
      setShowAddObservationModal(false);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error adding observation:', err);
      setError(err.message);
    }
  };

  // Handler for adding a new PDP
  const handlePDPSubmit = async (pdpData) => {
    try {
      const player = players.find(p => p.id === pdpData.player_id);
      if (!player) return;

      // Archive existing PDP if it exists
      const { data: existingPDP } = await supabase
        .from('pdps')
        .select('*')
        .eq('player_id', player.id)
        .eq('status', 'In Progress')
        .single();

      if (existingPDP) {
        const { error: archiveError } = await supabase
          .from('pdps')
          .update({
            end_date: new Date().toISOString().split('T')[0],
            status: 'Archived'
          })
          .eq('id', existingPDP.id);

        if (archiveError) throw archiveError;
      }

      // Create new PDP
      const { data: newPDP, error: createError } = await supabase
        .from('pdps')
        .insert([{
          player_id: player.id,
          player_name: player.name,
          title: pdpData.summary,
          start_date: new Date().toISOString().split('T')[0],
          status: 'In Progress',
          progress: 0,
          coach_id: pdpData.coach_id,
          coach_name: pdpData.coach_name,
          goals: [
            { area: 'Development', target: pdpData.summary, progress: 0 }
          ]
        }])
        .select();

      if (createError) throw createError;

      // Update player's current PDP
      const { error: updateError } = await supabase
        .from('players')
        .update({
          current_pdp: newPDP[0],
          pdp_summary: `${newPDP[0].title} (0% complete): Development`,
          pdp_status: 'In Progress'
        })
        .eq('id', player.id);

      if (updateError) throw updateError;

      setShowAddPDPModal(false);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error adding PDP:', err);
      setError(err.message);
    }
  };
  
  const handlePDPUpdate = async (playerData, pdpData) => {
    try {
      // Archive current PDP
      if (playerData.currentPDP) {
        const { error: archiveError } = await supabase
          .from('pdps')
          .update({
            end_date: new Date().toISOString().split('T')[0],
            status: 'Archived'
          })
          .eq('id', playerData.currentPDP.id);

        if (archiveError) throw archiveError;
      }

      // Create new PDP
      const { data: newPDP, error: createError } = await supabase
        .from('pdps')
        .insert([{
          player_id: playerData.id,
          player_name: playerData.name,
          title: pdpData.summary,
          start_date: new Date().toISOString().split('T')[0],
          status: 'In Progress',
          progress: pdpData.progress,
          coach_id: pdpData.coach_id,
          coach_name: pdpData.coach_name,
          goals: pdpData.goals
        }])
        .select();

      if (createError) throw createError;

      // Update player's current PDP
      const { error: updateError } = await supabase
        .from('players')
        .update({
          current_pdp: newPDP[0],
          pdp_summary: `${newPDP[0].title} (${pdpData.progress}% complete): Development`,
          pdp_status: 'In Progress'
        })
        .eq('id', playerData.id);

      if (updateError) throw updateError;

      setShowUpdatePDPModal(false);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error updating PDP:', err);
      setError(err.message);
    }
  };

  const getPlayerStats = async () => {
    const { data, error } = await supabase
      .from(TABLES.PLAYERS)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getCoachStats = async () => {
    const { data, error } = await supabase
      .from(TABLES.COACHES)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getObservationStats = async () => {
    const { data, error } = await supabase
      .from(TABLES.OBSERVATIONS)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getPlayerDistribution = async () => {
    const { data, error } = await supabase
      .from(TABLES.PLAYERS)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getActivePdps = async () => {
    const { data, error } = await supabase
      .from(TABLES.PDP)
      .select('*')
      .eq('active', true);
    if (error) throw error;
    return data;
  };

  const getPdpCompletionRate = async () => {
    const { data, error } = await supabase
      .from(TABLES.PDP)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getPdpTrends = async () => {
    const { data, error } = await supabase
      .from(TABLES.PDP)
      .select('*');
    if (error) throw error;
    return data;
  };

  const getOverduePdps = async () => {
    const { data, error } = await supabase
      .from(TABLES.PDP)
      .select('*')
      .lt('target_end_date', new Date().toISOString())
      .eq('active', true);
    if (error) throw error;
    return data;
  };

  const getRecentPdps = async () => {
    const { data, error } = await supabase
      .from(TABLES.PDP)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw error;
    return data;
  };

  const getPlayerPerformance = async () => {
    const { data, error } = await supabase
      .from(TABLES.PLAYERS)
      .select('*');
    if (error) throw error;
    return data;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <TopSection 
        playerCount={stats.playerCount}
        observationCount={stats.observationCount}
        pdpCount={stats.pdpCount}
        highPerformers={stats.highPerformers}
        onAddPlayer={handleAddPlayer}
        onAddObservation={handleAddObservation}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PlayerList 
            players={players}
            onViewPDPHistory={handleViewPDPHistory}
            onUpdatePDP={handleUpdatePDP}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ObservationList observations={observations} />
        </Grid>
      </Grid>

      {/* Modals */}
      <AddPlayerModal
        open={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onSubmit={handlePlayerSubmit}
      />
      
      <AddObservationModal
        open={showAddObservationModal}
        onClose={() => setShowAddObservationModal(false)}
        onSubmit={handleObservationSubmit}
        players={players}
      />
      
      <AddPDPModal
        open={showAddPDPModal}
        onClose={() => setShowAddPDPModal(false)}
        onSubmit={handlePDPSubmit}
        players={players}
        coaches={coaches}
      />
      
      <UpdatePDPModalNew
        open={showUpdatePDPModal}
        onClose={() => setShowUpdatePDPModal(false)}
        onSubmit={handlePDPUpdate}
        player={selectedPlayer}
        pdp={selectedPDP}
      />
      
      <PDPHistoryModal
        open={showPDPHistoryModal}
        onClose={() => setShowPDPHistoryModal(false)}
        player={selectedPlayer}
        pdpHistory={pdpHistory}
      />
    </Box>
  );
};

export default NewDashboard;