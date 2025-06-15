import React from 'react';
import { FaUserPlus, FaClipboardCheck, FaUsers, FaClipboardList, FaFileAlt, FaTrophy } from 'react-icons/fa';

const TopSection = ({ 
  playerCount, 
  observationCount, 
  pdpCount, 
  highPerformers,
  onAddPlayer, 
  onAddObservation 
}) => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h2 className="text-oldgold text-xl md:text-2xl font-bold mb-4 md:mb-0">Dashboard Overview</h2>
        
        <div className="flex gap-4">
          <button 
            onClick={onAddPlayer} 
            className="bg-oldgold hover:bg-darkgold text-black font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Add Player
          </button>
          <button 
            onClick={onAddObservation} 
            className="bg-oldgold hover:bg-darkgold text-black font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Add Observation
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer">
          <div className="p-3 rounded-full bg-blue-900 text-blue-200 mr-4">
            <FaUsers className="text-xl" />
          </div>
          <div>
            <span className="text-gray-400 text-sm">Players</span>
            <div className="text-oldgold text-2xl font-bold">{playerCount}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer">
          <div className="p-3 rounded-full bg-green-900 text-green-200 mr-4">
            <FaClipboardList className="text-xl" />
          </div>
          <div>
            <span className="text-gray-400 text-sm">Observations This Week</span>
            <div className="text-oldgold text-2xl font-bold">{observationCount}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer">
          <div className="p-3 rounded-full bg-yellow-900 text-yellow-200 mr-4">
            <FaFileAlt className="text-xl" />
          </div>
          <div>
            <span className="text-gray-400 text-sm">Active PDPs</span>
            <div className="text-oldgold text-2xl font-bold">{pdpCount}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer">
          <div className="p-3 rounded-full bg-purple-900 text-purple-200 mr-4">
            <FaTrophy className="text-xl" />
          </div>
          <div>
            <span className="text-gray-400 text-sm">High Performers</span>
            <div className="text-oldgold text-2xl font-bold">{highPerformers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;