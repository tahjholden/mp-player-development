import React, { useState, useEffect } from 'react';
import BaseFormModal from './BaseFormModal';

/**
 * AddPDPModal - Modal for adding a new Personal Development Plan
 * 
 * @param {Object} props
 * @param {Array} props.players - List of available players
 * @param {Array} props.coaches - List of available coaches
 * @param {function} props.onSubmit - Function to handle the form submission
 * @param {function} props.onClose - Function to close the modal
 */
const AddPDPModal = ({ players, coaches, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    playerId: '',
    playerName: '',
    coachId: coaches && coaches.length === 1 ? coaches[0].id : '',
    coachName: coaches && coaches.length === 1 ? coaches[0].name : '',
    summary: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [errors, setErrors] = useState({
    playerId: '',
    summary: ''
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

  const handleCoachChange = (e) => {
    const coachId = e.target.value;
    const selectedCoach = coaches.find(coach => coach.id.toString() === coachId);
    
    setFormData({
      ...formData,
      coachId: coachId,
      coachName: selectedCoach ? selectedCoach.name : ''
    });
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
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'PDP summary is required';
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
      title="Add Development Plan" 
      onClose={onClose} 
      onSubmit={handleSubmit}
      submitButtonText="Create PDP"
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
          <label className="block text-oldgold text-lg mb-2">Summary</label>
          <textarea 
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
            placeholder="Enter player development goals..."
            rows="5"
          ></textarea>
          {errors.summary && <p className="text-red-500 mt-1">{errors.summary}</p>}
        </div>
      </div>
    </BaseFormModal>
  );
};

export default AddPDPModal;