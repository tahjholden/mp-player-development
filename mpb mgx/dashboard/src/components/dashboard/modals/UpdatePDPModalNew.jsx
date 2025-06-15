import React, { useState, useEffect } from 'react';
import BaseFormModal from './BaseFormModal';

/**
 * UpdatePDPModalNew - Modal for updating a Personal Development Plan
 * 
 * @param {Object} props
 * @param {Object} props.player - The player whose PDP is being updated
 * @param {Object} props.currentPDP - The player's current PDP
 * @param {Array} props.coaches - List of available coaches
 * @param {function} props.onSubmit - Function to handle the form submission
 * @param {function} props.onClose - Function to close the modal
 */
const UpdatePDPModalNew = ({ player, currentPDP, coaches, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    playerId: player.id,
    playerName: player.name,
    coachId: currentPDP?.coachId || (coaches && coaches.length === 1 ? coaches[0].id : ''),
    coachName: currentPDP?.coachName || (coaches && coaches.length === 1 ? coaches[0].name : ''),
    summary: currentPDP?.title || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  const handleSubmit = () => {
    // Basic validation
    if (!formData.summary.trim()) {
      alert('PDP summary is required');
      return;
    }

    onSubmit(player, formData);
  };

  return (
    <BaseFormModal 
      title={`Update PDP: ${player.name}`}
      onClose={onClose} 
      onSubmit={handleSubmit}
      submitButtonText="Update PDP"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-oldgold text-lg mb-2">Player</label>
          <input 
            type="text" 
            value={player.name}
            readOnly
            className="w-full p-3 bg-gray-700 border border-gray-700 rounded-lg text-white text-lg cursor-not-allowed"
          />
        </div>

        {coaches && coaches.length > 1 && (
          <div>
            <label className="block text-oldgold text-lg mb-2">Coach</label>
            <select
              name="coachId"
              value={formData.coachId}
              onChange={handleCoachChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
            >
              <option value="">Select a coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-oldgold text-lg mb-2">Summary</label>
          <textarea 
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
            placeholder="Enter updated PDP summary and key development goals..."
            rows="6"
          ></textarea>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Note: Updating will archive the current PDP and create a new one with these details.</p>
        </div>
      </div>
    </BaseFormModal>
  );
};

export default UpdatePDPModalNew;