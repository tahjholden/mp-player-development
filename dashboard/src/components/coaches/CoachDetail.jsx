import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaChalkboardTeacher, FaUsers, FaClipboardList, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import { mockCoaches, mockPlayers, mockObservations } from '../../data/mockData';

const CoachDetail = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [assignedPlayers, setAssignedPlayers] = useState([]);
  const [recentObservations, setRecentObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCoach = mockCoaches.find(c => c.id === parseInt(id));
      setCoach(foundCoach);
      
      // Get assigned players (mock - first few players)
      setAssignedPlayers(mockPlayers.slice(0, foundCoach?.playersAssigned || 0));
      
      // Get recent observations by this coach
      const coachObservations = mockObservations.filter(obs => obs.coachId === parseInt(id));
      setRecentObservations(coachObservations);
      
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Coach not found</h3>
        <Link to="/coaches" className="text-blue-600 hover:text-blue-700">
          Return to coaches list
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
            to="/coaches"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
            <p className="text-gray-600 mt-1">{coach.specialization}</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaEdit className="text-sm" />
          Edit Coach
        </button>
      </div>

      {/* Coach Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaChalkboardTeacher className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <p className="text-2xl font-bold text-blue-600">{coach.experience}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Players</h3>
          <p className="text-2xl font-bold text-green-600">{coach.playersAssigned}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaClipboardList className="text-orange-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Active Observations</h3>
          <p className="text-2xl font-bold text-orange-600">{coach.activeObservations}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
          <p className="text-2xl font-bold text-purple-600">{recentObservations.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'players'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assigned Players
            </button>
            <button
              onClick={() => setActiveTab('observations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'observations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Observations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{coach.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <p className="text-gray-900">{coach.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900">{coach.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Players</h3>
              {assignedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedPlayers.map(player => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <Link
                          to={`/players/${player.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View
                        </Link>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Position: {player.position}</p>
                        <p>Age: {player.age}</p>
                        <p>Team: {player.team}</p>
                        <p>Skill Level: <span className="font-medium text-blue-600">{player.skillLevel}/10</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No players assigned yet.</p>
              )}
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Observations</h3>
              {recentObservations.length > 0 ? (
                <div className="space-y-4">
                  {recentObservations.map(observation => (
                    <div key={observation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{observation.playerName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{observation.date}</span>
                          <Link
                            to={`/observations/${observation.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Focus: {observation.focus}</p>
                      <p className="text-sm text-gray-700 mb-2">{observation.notes}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">Rating: {observation.rating}/10</span>
                        <span className="text-xs text-gray-500">{observation.actionItems.length} action items</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent observations found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;