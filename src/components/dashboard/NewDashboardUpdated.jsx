import React, { useState, useEffect } from 'react';
import TopSection from './TopSection';
import PlayerList from './PlayerList';
import ObservationList from './ObservationList';
import PDPHistoryModal from './PDPHistoryModal';
import { supabase, TABLES, activityLogService } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';

// Import modal components
import AddPlayerModal from './modals/AddPlayerModal';
import AddObservationModal from './modals/AddObservationModal';
import AddPDPModal from './modals/AddPDPModal';
import UpdatePDPModalNew from './modals/UpdatePDPModalNew';

const NewDashboardUpdated = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    playerCount: 0,
    observationCount: 0
  });
  
  // Core data states
  const [players, setPlayers] = useState([]);
  const [observations, setObservations] = useState([]);
  const [pdps, setPdps] = useState([]);
  const [coaches, setCoaches] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showPDPHistoryModal, setShowPDPHistoryModal] = useState(false);
  const [showUpdatePDPModal, setShowUpdatePDPModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddObservationModal, setShowAddObservationModal] = useState(false);
  const [showAddPDPModal, setShowAddPDPModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Define the Old Gold color for consistent usage
  const oldGold = '#CFB53B';
  
  // Current user/coach - in a real app, this would come from auth
  const currentUser = { id: '1', first_name: 'Coach', last_name: 'User', is_admin: true };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
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
      const weeklyObservations = countWeeklyObservations(observationsData || []);

      setStats({
        playerCount: playersData?.length || 0,
        observationCount: weeklyObservations
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Count observations from the past week
  const countWeeklyObservations = (observationsData) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return observationsData.filter(obs => {
      const obsDate = new Date(obs.created_at);
      return obsDate >= oneWeekAgo;
    }).length;
  };

  // Handler functions for modals
  const handleAddPlayer = () => {
    setShowAddPlayerModal(true);
  };

  const handleAddObservation = (player = null) => {
    if (player) {
      setSelectedPlayer(player);
    } else {
      setSelectedPlayer(null);
    }
    setShowAddObservationModal(true);
  };

  const handleAddPDP = () => {
    setSelectedPlayer(null);
    setShowAddPDPModal(true);
  };
  
  const handleViewPDPHistory = (player) => {
    setSelectedPlayer(player);
    setShowPDPHistoryModal(true);
  };
  
  const handleUpdatePDP = (player) => {
    setSelectedPlayer(player);
    setShowUpdatePDPModal(true);
  };

  // Handler for adding a new player
  const handlePlayerSubmit = async (playerData) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLAYERS)
        .insert([{
          first_name: playerData.first_name,
          last_name: playerData.last_name,
          position: playerData.position || null,
          name: `${playerData.first_name} ${playerData.last_name}`
        }])
        .select();

      if (error) throw error;
      
      // Log activity
      await activityLogService.create({
        activity_type: 'player_created',
        summary: `Player ${playerData.first_name} ${playerData.last_name} created`,
        coach_id: currentUser.id
      });

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
      const { data, error } = await supabase
        .from(TABLES.OBSERVATIONS)
        .insert([{
          player_id: observationData.player_id,
          content: observationData.content,
          observation_date: observationData.observation_date,
          coach_id: observationData.coach_id || currentUser.id
        }])
        .select();

      if (error) throw error;
      
      // Log activity
      await activityLogService.create({
        activity_type: 'observation_created',
        summary: `New observation added for player`,
        coach_id: currentUser.id,
        observation_id: data[0].id
      });

      setObservations([...observations, data[0]]);
      setShowAddObservationModal(false);
      fetchDashboardData(); // Refresh data
      
      return data[0]; // Return the created observation for additional processing
    } catch (err) {
      console.error('Error adding observation:', err);
      setError(err.message);
      throw err;
    }
  };

  // Handler for adding a new PDP
  const handlePDPSubmit = async (pdpData) => {
    try {
      // First, mark any existing active PDPs for this player as inactive
      const { data: existingPdps, error: fetchError } = await supabase
        .from(TABLES.PDP)
        .select('*')
        .eq('player_id', pdpData.player_id)
        .eq('active', true);
      
      if (fetchError) throw fetchError;
      
      // Update any existing active PDPs to be inactive
      if (existingPdps && existingPdps.length > 0) {
        const { error: updateError } = await supabase
          .from(TABLES.PDP)
          .update({ 
            active: false, 
            end_date: new Date().toISOString() 
          })
          .eq('player_id', pdpData.player_id)
          .eq('active', true);
        
        if (updateError) throw updateError;
        
        // Log activity for archiving previous PDPs
        await activityLogService.create({
          activity_type: 'pdp_archived',
          summary: `Previous PDP archived for player`,
          coach_id: currentUser.id,
          pdp_id: existingPdps[0].id
        });
      }
      
      // Create the new PDP
      const { data: newPdp, error: createError } = await supabase
        .from(TABLES.PDP)
        .insert([{
          player_id: pdpData.player_id,
          content: pdpData.content,
          active: true,
          coach_id: pdpData.coach_id || currentUser.id,
          start_date: pdpData.start_date || new Date().toISOString()
        }])
        .select();
      
      if (createError) throw createError;
      
      // Log activity
      await activityLogService.create({
        activity_type: 'pdp_created',
        summary: `New development plan created for player`,
        coach_id: currentUser.id,
        pdp_id: newPdp[0].id
      });
      
      setPdps([...pdps, newPdp[0]]);
      setShowAddPDPModal(false);
      fetchDashboardData(); // Refresh data
      
      return newPdp[0];
    } catch (err) {
      console.error('Error creating PDP:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Handler for updating a PDP
  const handlePDPUpdate = async (player, pdpData) => {
    try {
      // First, mark any existing active PDPs for this player as inactive
      const { data: existingPdps, error: fetchError } = await supabase
        .from(TABLES.PDP)
        .select('*')
        .eq('player_id', player.id)
        .eq('active', true);
      
      if (fetchError) throw fetchError;
      
      // Update any existing active PDPs to be inactive
      if (existingPdps && existingPdps.length > 0) {
        const { error: updateError } = await supabase
          .from(TABLES.PDP)
          .update({ 
            active: false, 
            end_date: new Date().toISOString() 
          })
          .eq('player_id', player.id)
          .eq('active', true);
        
        if (updateError) throw updateError;
        
        // Log activity for archiving previous PDPs
        await activityLogService.create({
          activity_type: 'pdp_archived',
          summary: `Previous PDP archived for player`,
          coach_id: currentUser.id,
          pdp_id: existingPdps[0].id
        });
      }
      
      // Create new PDP
      const { data: newPdp, error: createError } = await supabase
        .from(TABLES.PDP)
        .insert([{
          player_id: player.id,
          content: pdpData.content,
          active: true,
          coach_id: pdpData.coach_id || currentUser.id,
          start_date: new Date().toISOString()
        }])
        .select();
      
      if (createError) throw createError;
      
      // Log activity
      await activityLogService.create({
        activity_type: 'pdp_updated',
        summary: `Development plan updated for player`,
        coach_id: currentUser.id,
        pdp_id: newPdp[0].id
      });
      
      setPdps([...pdps, newPdp[0]]);
      setShowUpdatePDPModal(false);
      fetchDashboardData(); // Refresh data
      
      return newPdp[0];
    } catch (err) {
      console.error('Error updating PDP:', err);
      setError(err.message);
      throw err;
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: '#000' }}
      >
        <CircularProgress sx={{ color: oldGold }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} sx={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#fff' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <TopSection onRefresh={fetchDashboardData} />
      
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3
        }}
      >
        <Box>
          <PlayerList 
            onViewPDPHistory={handleViewPDPHistory}
            onUpdatePDP={handleUpdatePDP}
            onAddObservation={handleAddObservation}
          />
        </Box>
        <Box>
          <ObservationList limit={10} />
        </Box>
      </Box>

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
        selectedPlayer={selectedPlayer}
        currentUser={currentUser}
      />
      
      <AddPDPModal
        open={showAddPDPModal}
        onClose={() => setShowAddPDPModal(false)}
        onSubmit={handlePDPSubmit}
        players={players}
        coaches={coaches}
        selectedPlayer={selectedPlayer}
        currentUser={currentUser}
      />
      
      <UpdatePDPModalNew
        open={showUpdatePDPModal}
        onClose={() => setShowUpdatePDPModal(false)}
        onSubmit={handlePDPUpdate}
        player={selectedPlayer}
        coaches={coaches}
        currentUser={currentUser}
      />
      
      <PDPHistoryModal
        open={showPDPHistoryModal}
        onClose={() => setShowPDPHistoryModal(false)}
        player={selectedPlayer}
        pdps={pdps.filter(pdp => selectedPlayer && pdp.player_id === selectedPlayer.id)}
      />
    </Box>
  );
};

export default NewDashboardUpdated;
