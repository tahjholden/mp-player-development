import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaCalendarAlt } from 'react-icons/fa';
import { mockObservations } from '../../data/mockData';

const PlayerList = ({ players, onViewPDPHistory, onUpdatePDP, onAddObservation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlayers, setExpandedPlayers] = useState({});
  const [filteredPlayers, setFilteredPlayers] = useState(players);
  const [showObservations, setShowObservations] = useState({});
  
  useEffect(() => {
    // Filter players by search term
    const filtered = players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);
  
  const togglePlayerExpand = (playerId) => {
    setExpandedPlayers(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };

  const toggleShowObservations = (e, playerId) => {
    e.stopPropagation();
    setShowObservations(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };
  
  // Find the last observation text for a player
  const getLastObservationText = (playerId) => {
    // This would typically come from an API call directly
    // For demo purposes, we'll use the imported mockObservations
    const playerObservations = mockObservations.filter(obs => obs.playerId === playerId);
    
    if (playerObservations.length === 0) return null;
    
    // Sort by date (newest first)
    playerObservations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Return the text of the most recent observation
    return playerObservations[0]?.notes || null;
  };

  // Truncate text to a specific length with ellipsis
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 border-b border-oldgold pb-2">
        <h2 className="text-oldgold text-xl font-bold">Players</h2>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            className="w-full p-2 pl-10 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredPlayers.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No players found</p>
      ) : (
        <ul className="space-y-1">
          {filteredPlayers.map((player) => {
            const lastObservationText = getLastObservationText(player.id);
            const hasLastObservation = player.lastObservation && player.lastObservation !== 'N/A';
            
            return (
              <li 
                key={player.id} 
                className="border border-gray-800 rounded-lg overflow-hidden mb-2"
              >
                <div 
                  className="flex justify-between items-center p-3 bg-gray-800 cursor-pointer"
                  onClick={() => togglePlayerExpand(player.id)}
                >
                  <span className="font-medium">{player.name}</span>
                  <span className="text-gray-400">
                    {expandedPlayers[player.id] ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {expandedPlayers[player.id] && (
                  <div className="p-4 border-t border-gray-700 bg-gray-900">
                    {/* Player Name (Large/Bold) */}
                    <h2 className="text-xl font-bold mb-3">{player.name}</h2>
                    
                    {/* Current PDP */}
                    <div className="mb-3">
                      <h3 className="text-oldgold font-medium">Current PDP:</h3>
                      <p className="text-gray-300">
                        {player.pdpSummary || "No active PDP"}
                      </p>
                    </div>
                    
                    {/* Last Observation with Date & Preview */}
                    <div className="mb-3">
                      <h3 className="text-oldgold font-medium">Last Observation:</h3>
                      {hasLastObservation ? (
                        <div className="text-gray-300">
                          <span className="flex items-center text-sm text-gray-400 mb-1">
                            <FaCalendarAlt className="mr-1 text-xs" /> 
                            {new Date(player.lastObservation).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'})}
                          </span>
                          <p>"{truncateText(lastObservationText, 50)}"</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No observations yet</p>
                      )}
                    </div>
                    
                    {/* Show More Button (if there are observations) */}
                    {hasLastObservation && (
                      <>
                        <button
                          onClick={(e) => toggleShowObservations(e, player.id)}
                          className="text-oldgold hover:underline mb-4 inline-flex items-center"
                        >
                          {showObservations[player.id] ? 'Hide Observations' : 'Show More'}
                          <span className="ml-1">
                            {showObservations[player.id] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                          </span>
                        </button>
                        
                        {/* Display all observations when Show More is clicked */}
                        {showObservations[player.id] && (
                          <div className="mb-4 border-t border-gray-700 pt-3">
                            <h4 className="text-oldgold mb-2">Recent Observations</h4>
                            <div className="space-y-2">
                              {(() => {
                                // Use the imported mockObservations
                                const playerObservations = mockObservations
                                  .filter(obs => obs.playerId === player.id)
                                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                                  // Limit to the last 3 observations
                                  .slice(0, 3);
                                  
                                return playerObservations.map(obs => (
                                  <div key={obs.id} className="border border-gray-800 rounded p-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-oldgold">{new Date(obs.date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'})}</span>
                                      <span className="text-gray-400">{obs.coachName}</span>
                                    </div>
                                    <p className="text-sm mt-1">{obs.notes}</p>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Action Buttons - Evenly Sized */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddObservation && onAddObservation(player);
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors w-full"
                      >
                        Add Observation
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePDP(player);
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors w-full"
                      >
                        Update PDP
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewPDPHistory(player);
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors w-full"
                      >
                        View PDP History
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;