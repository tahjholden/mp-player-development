import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaEye, FaUsers, FaPlus } from 'react-icons/fa';
import { mockCoaches } from '../../data/mockData';

const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCoaches(mockCoaches);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCoaches = coaches.filter(coach => {
    if (filter === 'all') return true;
    return coach.specialization.toLowerCase().includes(filter.toLowerCase());
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Coaches</h1>
          <p className="text-gray-600 mt-1">Manage coaching staff and specializations</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="text-sm" />
          Add Coach
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Coaches ({coaches.length})
          </button>
          <button
            onClick={() => setFilter('technical')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'technical' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setFilter('goalkeeping')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'goalkeeping' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Goalkeeping
          </button>
          <button
            onClick={() => setFilter('physical')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'physical' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Physical
          </button>
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaChalkboardTeacher className="text-blue-600 text-xl" />
              </div>
              <Link
                to={`/coaches/${coach.id}`}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FaEye className="text-lg" />
              </Link>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{coach.name}</h3>
            <p className="text-gray-600 mb-4">{coach.specialization}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium">{coach.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Observations:</span>
                <span className="font-medium text-orange-600">{coach.activeObservations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Players Assigned:</span>
                <span className="font-medium text-blue-600">{coach.playersAssigned}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link
                to={`/coaches/${coach.id}`}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaUsers className="text-sm" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="text-center py-12">
          <FaChalkboardTeacher className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No coaches found</h3>
          <p className="text-gray-500">Try adjusting your filters or add a new coach.</p>
        </div>
      )}
    </div>
  );
};

export default CoachList;