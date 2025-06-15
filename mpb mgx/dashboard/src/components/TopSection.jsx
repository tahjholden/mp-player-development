// TopSection.jsx
import React from 'react';

const TopSection = ({ playerCount, coachCount, observationCount, pdpCount, onAddPlayer, onAddObservation }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex space-x-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">{playerCount}</h2>
          <p className="text-sm text-gray-600">Players</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{coachCount}</h2>
          <p className="text-sm text-gray-600">Coaches</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{observationCount}</h2>
          <p className="text-sm text-gray-600">Observations</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{pdpCount}</h2>
          <p className="text-sm text-gray-600">PDPs</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button onClick={onAddPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">Add Player</button>
        <button onClick={onAddObservation} className="bg-green-500 text-white px-4 py-2 rounded">Add Observation</button>
      </div>
    </div>
  );
};

export default TopSection;