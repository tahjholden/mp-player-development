import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaUser, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaStar } from 'react-icons/fa';
import { mockObservations, mockPlayers, mockCoaches } from '../../data/mockData';

const ObservationDetail = () => {
  const { id } = useParams();
  const [observation, setObservation] = useState(null);
  const [player, setPlayer] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundObservation = mockObservations.find(obs => obs.id === parseInt(id));
      setObservation(foundObservation);
      
      if (foundObservation) {
        const foundPlayer = mockPlayers.find(p => p.id === foundObservation.playerId);
        const foundCoach = mockCoaches.find(c => c.id === foundObservation.coachId);
        setPlayer(foundPlayer);
        setCoach(foundCoach);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600 bg-green-100 border-green-300';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getRatingDescription = (rating) => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 8) return 'Very Good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Satisfactory';
    if (rating >= 5) return 'Needs Improvement';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Observation not found</h3>
        <Link to="/observations" className="text-blue-600 hover:text-blue-700">
          Return to observations list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/observations"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Observation Details
            </h1>
            <p className="text-gray-600 mt-1">
              {observation.playerName} - {observation.date}
            </p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaEdit className="text-sm" />
          Edit Observation
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaUser className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Player</h3>
          <p className="text-xl font-bold text-blue-600">{observation.playerName}</p>
          <p className="text-sm text-gray-500">{player?.position} - Age {player?.age}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaChalkboardTeacher className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Coach</h3>
          <p className="text-xl font-bold text-green-600">{observation.coachName}</p>
          <p className="text-sm text-gray-500">{coach?.specialization}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-orange-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Date</h3>
          <p className="text-xl font-bold text-orange-600">{observation.date}</p>
          <p className="text-sm text-gray-500">Training Session</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaStar className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
          <p className="text-xl font-bold text-purple-600">{observation.rating}/10</p>
          <p className="text-sm text-gray-500">{getRatingDescription(observation.rating)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Observation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Focus Area */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaClipboardList className="text-blue-600" />
              Focus Area
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium text-lg">{observation.focus}</p>
            </div>
          </div>

          {/* Observation Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Observation Notes</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{observation.notes}</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
            {observation.actionItems.length > 0 ? (
              <div className="space-y-3">
                {observation.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific action items noted.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Rating</h3>
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${getRatingColor(observation.rating)}`}>
                <span className="text-2xl font-bold">{observation.rating}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{getRatingDescription(observation.rating)}</p>
            </div>
            
            {/* Rating Scale */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(observation.rating / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/players/${observation.playerId}`}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaUser className="text-sm" />
                View Player Profile
              </Link>
              <Link
                to={`/coaches/${observation.coachId}`}
                className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaChalkboardTeacher className="text-sm" />
                View Coach Profile
              </Link>
              <button className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <FaClipboardList className="text-sm" />
                Create Follow-up
              </button>
            </div>
          </div>

          {/* Related Information */}
          {player && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Position:</span>
                  <span className="font-medium">{player.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Age:</span>
                  <span className="font-medium">{player.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team:</span>
                  <span className="font-medium">{player.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Overall Skill:</span>
                  <span className="font-medium text-blue-600">{player.skillLevel}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PDP Status:</span>
                  <span className={`font-medium ${
                    player.pdpStatus === 'In Progress' ? 'text-blue-600' :
                    player.pdpStatus === 'Review Due' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {player.pdpStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObservationDetail;