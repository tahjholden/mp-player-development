import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

const ObservationList = ({ observations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredObservations, setFilteredObservations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  
  useEffect(() => {
    // Filter observations based on search term
    let filtered = [...observations];
    
    if (searchTerm) {
      filtered = filtered.filter(obs => 
        obs.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort observations by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredObservations(filtered);
  }, [searchTerm, observations]);
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const visibleObservations = filteredObservations.slice(0, visibleCount);
  
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md h-full overflow-auto">
      <div className="flex justify-between items-center mb-4 border-b border-oldgold pb-2">
        <h2 className="text-oldgold text-xl font-bold">Recent Observations</h2>
      </div>
      
      <div className="mb-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by player or text..."
            className="w-full p-2 pl-10 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-oldgold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredObservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-400">No observations matching your criteria</p>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {visibleObservations.map((observation) => (
              <li key={observation.id} className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-oldgold">{observation.playerName}</span>
                    <span className="text-gray-400 text-sm flex items-center">
                      <FaCalendarAlt className="mr-1 text-xs" /> {new Date(observation.date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'})}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{observation.notes || observation.summary}</p>
                </div>
              </li>
            ))}
          </ul>
          
          {visibleCount < filteredObservations.length && (
            <div className="mt-4 text-center">
              <button 
                onClick={handleShowMore}
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-900 text-oldgold hover:bg-gray-800 rounded-lg transition duration-200"
              >
                Show More <FaChevronDown className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ObservationList;