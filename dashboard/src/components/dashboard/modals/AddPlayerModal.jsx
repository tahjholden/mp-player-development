import React, { useState } from 'react';
import BaseFormModal from './BaseFormModal';

/**
 * AddPlayerModal - Modal for adding a new player
 * 
 * @param {Object} props
 * @param {function} props.onSubmit - Function to handle the form submission
 * @param {function} props.onClose - Function to close the modal
 */
const AddPlayerModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    pdpSummary: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    pdpSummary: ''
  });

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

  const handleSubmit = () => {
    // Validation
    const newErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Player name is required';
      isValid = false;
    }
    
    if (!formData.pdpSummary.trim()) {
      newErrors.pdpSummary = 'PDP Summary is required';
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
      title="Add Player" 
      onClose={onClose} 
      onSubmit={handleSubmit}
      submitButtonText="Add Player"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-oldgold text-lg mb-2">Player Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
            placeholder="Enter player name"
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-oldgold text-lg mb-2">PDP Summary</label>
          <textarea 
            name="pdpSummary"
            value={formData.pdpSummary}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-oldgold text-lg"
            placeholder="Enter initial PDP summary"
            rows="5"
          ></textarea>
          {errors.pdpSummary && <p className="text-red-500 mt-1">{errors.pdpSummary}</p>}
        </div>
      </div>
    </BaseFormModal>
  );
};

export default AddPlayerModal;