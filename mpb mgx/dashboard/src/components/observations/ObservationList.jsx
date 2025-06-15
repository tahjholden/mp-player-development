import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaEye, FaPlus, FaFilter, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { mockObservations, mockPlayers, mockCoaches } from '../../data/mockData';

const ObservationList = () => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setObservations(mockObservations);
      setLoading(false);
    }, 500);
  }, []);

  const filteredObservations = observations
    .filter(obs => {
      if (filter === 'all') return true;
      if (filter === 'recent') {
        const obsDate = new Date(obs.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return obsDate >= weekAgo;
      }
      if (filter === 'high-rating') return obs.rating >= 8;
      if (filter === 'needs-attention') return obs.rating < 6;
      return true;
    })
    .filter(obs => 
      obs.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.coachName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'player') return a.playerName.localeCompare(b.playerName);
      return 0;
    });

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Observations</h1>
          <p className="text-gray-600 mt-1">Track player development and progress</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="text-sm" />
          New Observation
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by player, coach, or focus area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({observations.length})
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'recent' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setFilter('high-rating')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'high-rating' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High Rating
            </button>
          </div>
          
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
            <option value="player">Sort by Player</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Observations</p>
              <p className="text-2xl font-bold text-gray-900">{observations.length}</p>
            </div>
            <FaClipboardList className="text-blue-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">
                {observations.filter(obs => {
                  const obsDate = new Date(obs.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return obsDate >= weekAgo;
                }).length}
              </p>
            </div>
            <FaCalendarAlt className="text-green-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-orange-600">
                {(observations.reduce((sum, obs) => sum + obs.rating, 0) / observations.length).toFixed(1)}
              </p>
            </div>
            <FaFilter className="text-orange-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Performers</p>
              <p className="text-2xl font-bold text-purple-600">
                {observations.filter(obs => obs.rating >= 8).length}
              </p>
            </div>
            <FaUser className="text-purple-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Observations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Observations ({filteredObservations.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredObservations.map(observation => (
            <div key={observation.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {observation.playerName}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(observation.rating)}`}>
                      {observation.rating}/10
                    </span>
                    <span className="text-sm text-gray-500">{observation.date}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Focus:</span> {observation.focus}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Coach:</span> {observation.coachName}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{observation.notes}</p>
                  
                  {observation.actionItems.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Action Items:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {observation.actionItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/players/${observation.playerId}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Player
                  </Link>
                  <Link
                    to={`/observations/${observation.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <FaEye className="text-xs" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredObservations.length === 0 && (
        <div className="text-center py-12">
          <FaClipboardList className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No observations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ObservationList;