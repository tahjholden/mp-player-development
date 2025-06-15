import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaEye, FaPlus, FaUser, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { mockPDPs } from '../../data/mockData';

const PDPList = () => {
  const [pdps, setPdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPdps(mockPDPs);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPDPs = pdps
    .filter(pdp => {
      if (filter === 'all') return true;
      if (filter === 'in-progress') return pdp.status === 'In Progress';
      if (filter === 'review-due') return pdp.status === 'Review Due';
      if (filter === 'completed') return pdp.status === 'Completed';
      return true;
    })
    .filter(pdp => 
      pdp.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdp.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'date') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'name') return a.playerName.localeCompare(b.playerName);
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Review Due': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'Completed': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <h1 className="text-3xl font-bold text-gray-900">Personal Development Plans</h1>
          <p className="text-gray-600 mt-1">Track and manage player development goals</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="text-sm" />
          Create PDP
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by player name or PDP title..."
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
              All ({pdps.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'in-progress' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('review-due')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'review-due' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Review Due
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
          
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="progress">Sort by Progress</option>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Player</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total PDPs</p>
              <p className="text-2xl font-bold text-gray-900">{pdps.length}</p>
            </div>
            <FaFileAlt className="text-blue-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {pdps.filter(pdp => pdp.status === 'In Progress').length}
              </p>
            </div>
            <FaChartLine className="text-blue-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Review Due</p>
              <p className="text-2xl font-bold text-orange-600">
                {pdps.filter(pdp => pdp.status === 'Review Due').length}
              </p>
            </div>
            <FaCalendarAlt className="text-orange-600 text-2xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(pdps.reduce((sum, pdp) => sum + pdp.progress, 0) / pdps.length)}%
              </p>
            </div>
            <FaUser className="text-green-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* PDPs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPDPs.map(pdp => (
          <div key={pdp.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-blue-600 text-xl" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(pdp.status)}`}>
                  {pdp.status}
                </span>
                <Link
                  to={`/pdps/${pdp.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FaEye className="text-lg" />
                </Link>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{pdp.title}</h3>
            <p className="text-gray-600 mb-4">{pdp.playerName}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{pdp.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(pdp.progress)}`}
                  style={{ width: `${pdp.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date:</span>
                <span className="font-medium">{pdp.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End Date:</span>
                <span className="font-medium">{pdp.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Goals:</span>
                <span className="font-medium text-blue-600">{pdp.goals.length}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link
                to={`/pdps/${pdp.id}`}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaEye className="text-sm" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPDPs.length === 0 && (
        <div className="text-center py-12">
          <FaFileAlt className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No PDPs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters, or create a new PDP.</p>
        </div>
      )}
    </div>
  );
};

export default PDPList;