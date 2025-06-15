import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const UpdatePDPModal = ({ player, currentPDP, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: currentPDP?.title || '',
    goals: currentPDP?.goals || [
      { area: '', target: '', progress: 0 }
    ]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...formData.goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      [field]: value
    };

    setFormData({
      ...formData,
      goals: updatedGoals
    });
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [...formData.goals, { area: '', target: '', progress: 0 }]
    });
  };

  const removeGoal = (index) => {
    if (formData.goals.length > 1) {
      const updatedGoals = [...formData.goals];
      updatedGoals.splice(index, 1);
      
      setFormData({
        ...formData,
        goals: updatedGoals
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      alert('Please enter a title for the PDP');
      return;
    }
    
    const hasEmptyGoals = formData.goals.some(goal => 
      !goal.area.trim() || !goal.target.trim()
    );
    
    if (hasEmptyGoals) {
      alert('Please fill out all goal areas and targets');
      return;
    }
    
    onSubmit(player, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-oldgold">Update PDP: {player.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-oldgold mb-2">PDP Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
                placeholder="e.g., Technical Development Plan"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-oldgold">Development Goals</label>
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-3 py-1 bg-oldgold hover:bg-yellow-600 text-black rounded text-sm"
                >
                  Add Goal
                </button>
              </div>
              
              {formData.goals.map((goal, index) => (
                <div key={index} className="mb-3 p-3 border border-gray-700 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Goal {index + 1}</span>
                    {formData.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm text-gray-400 mb-1">Focus Area</label>
                    <input 
                      type="text" 
                      value={goal.area}
                      onChange={(e) => handleGoalChange(index, 'area', e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
                      placeholder="e.g., Passing, Shooting, Fitness"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm text-gray-400 mb-1">Target</label>
                    <input 
                      type="text" 
                      value={goal.target}
                      onChange={(e) => handleGoalChange(index, 'target', e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
                      placeholder="e.g., Improve accuracy by 20%"
                    />
                  </div>
                  
                  {currentPDP && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Current Progress</label>
                      <input 
                        type="number" 
                        value={goal.progress}
                        onChange={(e) => handleGoalChange(index, 'progress', parseInt(e.target.value))}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
                        min="0"
                        max="100"
                      />
                      <div className="w-full bg-gray-700 h-2 mt-1 rounded">
                        <div 
                          className="bg-oldgold h-2 rounded" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p>Note: Submitting this form will archive the current PDP (if any) and create a new active PDP.</p>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-oldgold hover:bg-yellow-600 text-black rounded font-medium"
          >
            Save PDP
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePDPModal;