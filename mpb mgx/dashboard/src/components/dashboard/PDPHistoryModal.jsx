import React, { useState } from 'react';
import { FaCalendarAlt, FaClipboardCheck, FaTimes } from 'react-icons/fa';

const PDPHistoryModal = ({ player, pdpHistory, observations, onClose }) => {
  const [expandedPDPs, setExpandedPDPs] = useState({});
  
  // Sort PDPs by start date (newest first)
  const sortedPDPs = [...pdpHistory].sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  );
  
  // Add current PDP to the top if it exists
  if (player.currentPDP) {
    sortedPDPs.unshift({
      ...player.currentPDP,
      status: 'Current'
    });
  }
  
  const togglePDPExpand = (pdpId) => {
    setExpandedPDPs(prev => ({
      ...prev,
      [pdpId]: !prev[pdpId]
    }));
  };
  
  // Filter observations that fall within a PDP's date range
  const getPDPObservations = (pdp) => {
    const startDate = new Date(pdp.startDate);
    // If the PDP is current/active, use today's date as the end date for filtering
    const endDate = pdp.endDate ? new Date(pdp.endDate) : new Date();
    
    return observations.filter(obs => {
      const obsDate = new Date(obs.date);
      return obsDate >= startDate && obsDate <= endDate;
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-oldgold">PDP History: {player.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          {sortedPDPs.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No PDP history available</p>
          ) : (
            <div className="space-y-4">
              {sortedPDPs.map((pdp) => {
                const pdpObservations = getPDPObservations(pdp);
                const isExpanded = expandedPDPs[pdp.id];
                
                return (
                  <div key={pdp.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 bg-gray-800 flex justify-between items-center cursor-pointer"
                      onClick={() => togglePDPExpand(pdp.id)}
                    >
                      <div>
                        <h3 className="font-medium text-oldgold">{pdp.title}</h3>
                        <div className="text-sm text-gray-400 mt-1 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>
                            {new Date(pdp.startDate).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'})}
                            {' to '}
                            {pdp.endDate ? new Date(pdp.endDate).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'}) : 'Current'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          pdp.status === 'Current' || pdp.status === 'In Progress' 
                            ? 'bg-blue-900 text-blue-200' 
                            : pdp.status === 'Review Due' 
                              ? 'bg-yellow-900 text-yellow-200' 
                              : 'bg-green-900 text-green-200'
                        }`}>
                          {pdp.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-4 border-t border-gray-700 bg-gray-900 ${isExpanded ? 'block' : 'hidden'}`}>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-oldgold mb-2">Summary:</h4>
                        <p className="text-gray-300 text-sm">
                          {pdp.goals?.map(goal => (
                            <div key={goal.area} className="mb-1">
                              <span className="text-oldgold">{goal.area}:</span> {goal.target} ({goal.progress}% complete)
                            </div>
                          ))}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-oldgold mb-2">
                          Observations ({pdpObservations.length}):
                        </h4>
                        
                        {pdpObservations.length === 0 ? (
                          <p className="text-gray-400 text-sm">No observations in this period</p>
                        ) : (
                          <ul className="space-y-2">
                            {pdpObservations.map(obs => (
                              <li key={obs.id} className="border-l-2 border-gray-700 pl-3 py-1">
                                <div className="flex items-center text-sm mb-1">
                                  <FaCalendarAlt className="mr-1 text-gray-500" />
                                  <span className="text-gray-400">{new Date(obs.date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'})}</span>
                                </div>
                                <p className="text-sm">{obs.notes}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-oldgold hover:bg-yellow-600 text-black rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDPHistoryModal;