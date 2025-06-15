// RightSection.jsx
import React from 'react';

const RightSection = ({ observations }) => {
  return (
    <div className="w-3/4 p-4 bg-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Observations</h3>
      <ul>
        {observations.map(observation => (
          <li key={observation.id} className="mb-4">
            <div className="text-sm text-gray-600">
              <strong>{observation.playerName}</strong> - {observation.date}
            </div>
            <p className="text-gray-800">{observation.summary}</p>
            <p className="text-gray-600 text-sm">{observation.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSection;