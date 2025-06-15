import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaUser, FaCalendarAlt, FaFileAlt, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { TbTarget } from 'react-icons/tb';
import { mockPDPs, mockPlayers } from '../../data/mockData';

const PDPDetail = () => {
  const { id } = useParams();
  const [pdp, setPdp] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPDP = mockPDPs.find(p => p.id === parseInt(id));
      setPdp(foundPDP);
      
      if (foundPDP) {
        const foundPlayer = mockPlayers.find(p => p.id === foundPDP.playerId);
        setPlayer(foundPlayer);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

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

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!pdp) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">PDP not found</h3>
        <Link to="/pdps" className="text-blue-600 hover:text-blue-700">
          Return to PDPs list
        </Link>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(pdp.endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/pdps"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pdp.title}</h1>
            <p className="text-gray-600 mt-1">{pdp.playerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(pdp.status)}`}>
            {pdp.status}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaEdit className="text-sm" />
            Edit PDP
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaUser className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Player</h3>
          <p className="text-xl font-bold text-blue-600">{pdp.playerName}</p>
          <p className="text-sm text-gray-500">{player?.position} - Age {player?.age}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
          <p className="text-xl font-bold text-green-600">{pdp.progress}%</p>
          <p className="text-sm text-gray-500">Overall completion</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-orange-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Duration</h3>
          <p className="text-xl font-bold text-orange-600">{daysRemaining}</p>
          <p className="text-sm text-gray-500">
            {daysRemaining > 0 ? 'days remaining' : 'days overdue'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <TbTarget className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
          <p className="text-xl font-bold text-purple-600">{pdp.goals.length}</p>
          <p className="text-sm text-gray-500">development areas</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{pdp.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${getProgressColor(pdp.progress)} transition-all duration-300`}
            style={{ width: `${pdp.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Started: {pdp.startDate}</span>
          <span>Target: {pdp.endDate}</span>
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
              onClick={() => setActiveTab('goals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'goals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Development Goals
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Timeline
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PDP Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <p className="text-gray-900">{pdp.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                    <p className="text-gray-900">{pdp.playerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <p className="text-gray-900">{pdp.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <p className="text-gray-900">{pdp.endDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(pdp.status)}`}>
                      {pdp.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Progress</label>
                    <p className="text-gray-900">{pdp.progress}%</p>
                  </div>
                </div>
              </div>

              {player && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Position:</span>
                        <p className="text-gray-900">{player.position}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Age:</span>
                        <p className="text-gray-900">{player.age}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Team:</span>
                        <p className="text-gray-900">{player.team}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Current Skill Level:</span>
                        <p className="text-gray-900">{player.skillLevel}/10</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Observation:</span>
                        <p className="text-gray-900">{player.lastObservation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/players/${player.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Development Goals</h3>
              <div className="space-y-4">
                {pdp.goals.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{goal.area}</h4>
                          <p className="text-gray-600 text-sm">{goal.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{goal.progress}%</span>
                        <p className="text-xs text-gray-500">progress</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Development Area: {goal.area}</span>
                      {goal.progress >= 80 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle className="text-xs" />
                          <span>On Track</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Development Timeline</h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-6">
                  {/* Start */}
                  <div className="relative flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                      <FaCalendarAlt className="text-white text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">PDP Started</h4>
                      <p className="text-gray-600 text-sm">{pdp.startDate}</p>
                      <p className="text-gray-500 text-xs">Initial assessment and goal setting</p>
                    </div>
                  </div>
                  
                  {/* Milestones based on goals */}
                  {pdp.goals.map((goal, index) => (
                    <div key={index} className="relative flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        goal.progress >= 80 
                          ? 'bg-green-500' 
                          : goal.progress >= 50 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-400'
                      }`}>
                        {goal.progress >= 80 ? (
                          <FaCheckCircle className="text-white text-sm" />
                        ) : (
                          <span className="text-white text-xs font-bold">{goal.progress}%</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.area} Development</h4>
                        <p className="text-gray-600 text-sm">{goal.target}</p>
                        <p className="text-gray-500 text-xs">Current progress: {goal.progress}%</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Target End */}
                  <div className="relative flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      pdp.status === 'Completed' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <TbTarget className="text-white text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Target Completion</h4>
                      <p className="text-gray-600 text-sm">{pdp.endDate}</p>
                      <p className="text-gray-500 text-xs">
                        {daysRemaining > 0 
                          ? `${daysRemaining} days remaining` 
                          : pdp.status === 'Completed' 
                          ? 'Completed successfully' 
                          : `${Math.abs(daysRemaining)} days overdue`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/players/${pdp.playerId}`}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaUser className="text-sm" />
            View Player Profile
          </Link>
          <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <FaFileAlt className="text-sm" />
            Generate Report
          </button>
          <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <FaCalendarAlt className="text-sm" />
            Schedule Review
          </button>
          <Link
            to="/observations"
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaChartLine className="text-sm" />
            View Observations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PDPDetail;