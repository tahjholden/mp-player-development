import React, { useState, useEffect } from 'react';
import TopSection from './TopSection';
import PlayerList from './PlayerList';
import ObservationList from './ObservationList';
import PDPHistoryModal from './PDPHistoryModal';
import { dashboardService } from '../../lib/dashboardService';
import { mockPlayers, mockObservations, mockPDPs, mockPDPHistory, mockCoaches } from '../../data/mockData';
import { FaUserPlus, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

// Import new modal components
import AddPlayerModal from './modals/AddPlayerModal';
import AddObservationModal from './modals/AddObservationModal';
import AddPDPModal from './modals/AddPDPModal';
import UpdatePDPModalNew from './modals/UpdatePDPModalNew';

const NewDashboardUpdated = () => {
  const [stats, setStats] = useState({
    playerCount: 0,
    observationCount: 0
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Insert sample data first (only inserts if tables are empty)
        await dashboardService.insertSampleData();
        
        // Fetch dashboard stats
        const dashboardStats = await dashboardService.getDashboardStats();
        
        // Update stats with actual data
        setStats({
          playerCount: dashboardStats.playerCount || 0,
          observationCount: dashboardStats.observationsCount || 0
        });
        
        // Combine mock data with any PDP summaries
        const enhancedPlayers = mockPlayers.map(player => {
          const playerPdp = mockPDPs.find(pdp => pdp.playerId === player.id);
          return {
            ...player,
            currentPDP: playerPdp,
            pdpSummary: playerPdp 
              ? `${playerPdp.title} (${playerPdp.progress}% complete): ${playerPdp.goals.map(g => g.area).join(', ')}` 
              : 'No active PDP'
          };
        });
        
        setPlayers(enhancedPlayers);
        setObservations(mockObservations);
        setPdps(mockPDPs);
        setPdpHistory(mockPDPHistory);
        setCoaches(mockCoaches || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
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
  const handlePlayerSubmit = (playerData) => {
    const newPlayer = {
      ...playerData,
      id: players.length + 1,
      lastObservation: new Date().toISOString().split('T')[0],
      pdpStatus: 'Not Started',
      skillLevel: 5.0,
      pdpSummary: 'No active PDP'
    };
    
    setPlayers([...players, newPlayer]);
    setShowAddPlayerModal(false);
  };

  // Handler for adding a new observation
  const handleObservationSubmit = (observationData) => {
    const player = players.find(p => p.id === observationData.playerId);
    const coach = coaches.length > 0 ? coaches[0] : { id: 1, name: 'John Smith' };
    
    const newObservation = {
      ...observationData,
      id: observations.length + 1,
      coachId: coach.id,
      coachName: coach.name,
      focus: observationData.notes.substring(0, 20) + '...',
      rating: Math.floor(Math.random() * 5) + 5, // Random rating between 5-10
      actionItems: ['Review with player']
    };
    
    setObservations([...observations, newObservation]);
    
    // Update player's last observation date
    const updatedPlayers = players.map(p => 
      p.id === player.id ? { ...p, lastObservation: observationData.date } : p
    );
    
    setPlayers(updatedPlayers);
    setShowAddObservationModal(false);
  };

  // Handler for adding a new PDP
  const handlePDPSubmit = (pdpData) => {
    const player = players.find(p => p.id === pdpData.playerId);
    
    if (!player) return;
    
    // Create new PDP
    const newPDP = {
      id: pdps.length + pdpHistory.length + 1,
      playerId: player.id,
      playerName: player.name,
      title: pdpData.summary,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'In Progress',
      progress: 0,
      coachId: pdpData.coachId,
      coachName: pdpData.coachName,
      goals: [
        { area: 'Development', target: pdpData.summary, progress: 0 }
      ]
    };
    
    // Update PDPs state
    const updatedPDPs = [...pdps];
    const existingPdpIndex = updatedPDPs.findIndex(p => p.playerId === player.id);
    
    if (existingPdpIndex !== -1) {
      // Archive existing PDP first
      const existingPDP = updatedPDPs[existingPdpIndex];
      const archivedPDP = {
        ...existingPDP,
        endDate: new Date().toISOString().split('T')[0],
        status: 'Archived'
      };
      setPdpHistory([...pdpHistory, archivedPDP]);
      
      // Replace with new PDP
      updatedPDPs[existingPdpIndex] = newPDP;
    } else {
      updatedPDPs.push(newPDP);
    }
    
    setPdps(updatedPDPs);
    
    // Update players with new current PDP
    const updatedPlayers = players.map(p => {
      if (p.id === player.id) {
        return {
          ...p,
          currentPDP: newPDP,
          pdpSummary: `${newPDP.title} (0% complete): Development`,
          pdpStatus: 'In Progress'
        };
      }
      return p;
    });
    
    setPlayers(updatedPlayers);
    setShowAddPDPModal(false);
  };
  
  const handlePDPUpdate = (playerData, pdpData) => {
    // Archive current PDP
    if (playerData.currentPDP) {
      const updatedPDP = {
        ...playerData.currentPDP,
        endDate: new Date().toISOString().split('T')[0],
        status: 'Archived'
      };
      
      // Add to PDP history 
      setPdpHistory(prev => [...prev, updatedPDP]);
    }
    
    // Create new PDP
    const newPDP = {
      id: pdps.length + pdpHistory.length + 1,
      playerId: playerData.id,
      playerName: playerData.name,
      title: pdpData.summary,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'In Progress',
      coachId: pdpData.coachId || (coaches.length > 0 ? coaches[0].id : 1),
      coachName: pdpData.coachName || (coaches.length > 0 ? coaches[0].name : 'John Smith'),
      progress: 0,
      goals: [
        { area: 'Development', target: pdpData.summary, progress: 0 }
      ]
    };
    
    // Update PDPs state
    setPdps(prev => prev.map(p => 
      p.playerId === playerData.id ? newPDP : p
    ));
    
    // Update players with new current PDP
    setPlayers(prev => prev.map(p => {
      if (p.id === playerData.id) {
        return {
          ...p,
          currentPDP: newPDP,
          pdpSummary: `${newPDP.title} (0% complete): Development`
        };
      }
      return p;
    }));
    
    setShowUpdatePDPModal(false);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-900 text-white rounded-md">
        <p>Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-black text-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-5">
            <h1 className="text-3xl font-bold text-oldgold mb-4 md:mb-0">MP Player Development</h1>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleAddPlayer} 
                className="bg-oldgold hover:bg-darkgold text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaUserPlus className="mr-2" /> Add Player
              </button>
              <button 
                onClick={handleAddObservation} 
                className="bg-oldgold hover:bg-darkgold text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaClipboardCheck className="mr-2" /> Add Observation
              </button>
              <button 
                onClick={handleAddPDP} 
                className="bg-oldgold hover:bg-darkgold text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaChartLine className="mr-2" /> Add PDP
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center bg-gray-800 p-4 rounded-lg">
              <div>
                <span className="text-gray-400 text-sm">Players</span>
                <div className="text-oldgold text-2xl font-bold">{stats.playerCount || players.length}</div>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-800 p-4 rounded-lg">
              <div>
                <span className="text-gray-400 text-sm">Observations</span>
                <div className="text-oldgold text-2xl font-bold">{stats.observationCount || observations.length}</div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-oldgold text-lg">Loading dashboard data...</div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3">
              <PlayerList 
                players={players} 
                onViewPDPHistory={handleViewPDPHistory}
                onUpdatePDP={handleUpdatePDP}
              />
            </div>
            <div className="w-full lg:w-2/3">
              <ObservationList 
                observations={observations} 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showPDPHistoryModal && selectedPlayer && (
        <PDPHistoryModal 
          player={selectedPlayer} 
          pdpHistory={pdpHistory.filter(pdp => pdp.playerId === selectedPlayer.id)}
          observations={observations.filter(obs => obs.playerId === selectedPlayer.id)}
          onClose={() => setShowPDPHistoryModal(false)}
        />
      )}
      
      {showUpdatePDPModal && selectedPlayer && (
        <UpdatePDPModalNew
          player={selectedPlayer}
          currentPDP={selectedPDP}
          coaches={coaches}
          onSubmit={handlePDPUpdate}
          onClose={() => setShowUpdatePDPModal(false)}
        />
      )}

      {showAddPlayerModal && (
        <AddPlayerModal
          onSubmit={handlePlayerSubmit}
          onClose={() => setShowAddPlayerModal(false)}
        />
      )}

      {showAddObservationModal && (
        <AddObservationModal
          players={players}
          onSubmit={handleObservationSubmit}
          onClose={() => setShowAddObservationModal(false)}
        />
      )}

      {showAddPDPModal && (
        <AddPDPModal
          players={players}
          coaches={coaches}
          onSubmit={handlePDPSubmit}
          onClose={() => setShowAddPDPModal(false)}
        />
      )}
    </div>
  );
};

export default NewDashboardUpdated;