import React, { useState, useEffect } from 'react';
import BaseFormModal from './BaseFormModal';

/**
 * AddObservationModal - Modal for adding a new observation
 * 
 * @param {Object} props
 * @param {Array} props.players - List of available players
 * @param {Object} props.selectedPlayer - Pre-selected player (if opened from player card)
 * @param {function} props.onSubmit - Function to handle the form submission
 * @param {function} props.onClose - Function to close the modal
 */
const AddObservationModal = ({ players, selectedPlayer, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    playerId: selectedPlayer ? selectedPlayer.id : '',
    playerName: selectedPlayer ? selectedPlayer.name : '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState(selectedPlayer ? selectedPlayer.name : '');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [errors, setErrors] = useState({
    playerId: '',
    notes: ''
  });

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlayers(players.slice(0, 5)); // Show first 5 players initially
    } else {
      const filtered = players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchTerm, players]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePlayerSelect = (player) => {
    setFormData({
      ...formData,
      playerId: player.id,
      playerName: player.name
    });
    setSearchTerm(player.name);
    setShowPlayerDropdown(false);
    
    // Clear player error
    if (errors.playerId) {
      setErrors({
        ...errors,
        playerId: ''
      });
    }
  };

  const handlePlayerSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowPlayerDropdown(true);
  };

  const handleSubmit = () => {
    // Validation
    const newErrors = {};
    let isValid = true;
    
    if (!formData.playerId) {
      newErrors.playerId = 'Please select a player';
      isValid = false;
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Observation text is required';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <BaseFormModal 
      title="Add Observation" 
      onClose={onClose} 
      onSubmit={handleSubmit}
      submitButtonText="Add Observation"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-oldgold text-lg mb-2">Player</label>
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={handlePlayerSearch}
              onFocus={() => setShowPlayerDropdown(true)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
              placeholder="Search for player"
              autoComplete="off"
            />
            
            {showPlayerDropdown && filteredPlayers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredPlayers.map((player) => (
                  <div 
                    key={player.id} 
                    className="p-3 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.playerId && <p className="text-red-500 mt-1">{errors.playerId}</p>}
        </div>

        <div>
          <label className="block text-oldgold text-lg mb-2">Date</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
          />
        </div>

        <div>
          <label className="block text-oldgold text-lg mb-2">Observation</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg overflow-y-auto"
            placeholder="Enter your observation notes here..."
            rows="5"
          ></textarea>
          {errors.notes && <p className="text-red-500 mt-1">{errors.notes}</p>}
        </div>
      </div>
    </BaseFormModal>
  );
};

export default AddObservationModal;