// LeftSection.jsx
import React from 'react';

const LeftSection = ({ players, onSelectPlayer }) => {
  return (
    <div className="w-1/4 p-4 bg-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Players</h3>
      <ul>
        {players.map(player => (
          <li key={player.id} className="mb-2">
            <button onClick={() => onSelectPlayer(player.id)} className="text-blue-500 hover:underline">
              {player.name}
            </button>
            <div className="text-sm text-gray-600">
              PDP Summary: {player.pdpSummary}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSection;