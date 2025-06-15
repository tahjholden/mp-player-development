import React, { useState, useEffect } from 'react';
import AreaChartComponent from './charts/AreaChart';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';
import LineChartComponent from './charts/LineChart';
import RadarChartComponent from './charts/RadarChart';
import GaugeChart from './charts/GaugeChart';
import BubbleChart from './charts/BubbleChart';
import TreeMapChart from './charts/TreeMap';
import StatsCard from './StatsCard';
import { dashboardService } from '../lib/dashboardService';
import { areaChartData, barChartData, pieChartData, lineChartData, radarChartData } from '../data/mockData';

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Players',
      value: '...',
      change: '0%',
      trend: 'neutral',
      icon: {
        path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        bgColor: 'bg-green-500'
      }
    },
    {
      title: 'Active Coaches',
      value: '...',
      change: '0%',
      trend: 'neutral',
      icon: {
        path: 'M12 4.354a4 4 0 110 5.292V12H5.69a4 4 0 110-5.292V4.5a.5.5 0 01.5-.5h6a.5.5 0 01.5.5v2.146A4 4 0 0112 4.354z',
        bgColor: 'bg-blue-500'
      }
    },
    {
      title: 'Observations',
      value: '...',
      change: '0%',
      trend: 'neutral',
      icon: {
        path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        bgColor: 'bg-purple-500'
      }
    },
    {
      title: 'Groups',
      value: '...',
      change: '0%',
      trend: 'neutral',
      icon: {
        path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        bgColor: 'bg-indigo-500'
      }
    }
  ]);
  
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Insert sample data first (only inserts if tables are empty)
        await dashboardService.insertSampleData();
        
        // Fetch dashboard stats
        const dashboardStats = await dashboardService.getDashboardStats();
        
        // Update stats with actual data
        setStats(prev => [
          {
            ...prev[0],
            value: dashboardStats.playerCount?.toString() || '0',
            change: '+5.25%',
            trend: 'up'
          },
          {
            ...prev[1],
            value: dashboardStats.coachCount?.toString() || '0',
            change: '+2.5%',
            trend: 'up'
          },
          {
            ...prev[2],
            value: dashboardStats.observationsCount?.toString() || '0',
            change: '+12.4%',
            trend: 'up'
          },
          {
            ...prev[3],
            value: dashboardStats.groupCount?.toString() || '0',
            change: '+3.2%',
            trend: 'up'
          }
        ]);
        
        // Fetch activity chart data
        const chartData = await dashboardService.getActivityChartData();
        setActivityData(chartData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={loading ? '...' : stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Activity Trends</h2>
          {loading ? (
            <div className="flex items-center justify-center h-72">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <AreaChartComponent data={activityData} />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Group Distribution</h2>
          {loading ? (
            <div className="flex items-center justify-center h-72">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <BarChartComponent data={barChartData} />
          )}
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Player Positions</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <PieChartComponent data={pieChartData} />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Observation Growth</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <LineChartComponent data={lineChartData} />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <RadarChartComponent data={radarChartData} />
          )}
        </div>
      </div>
      
      {/* Charts - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Observation Completion</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <GaugeChart value={Math.floor(Math.random() * 35) + 65} min={0} max={100} title="Completion Rate" />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Player Development</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <BubbleChart />
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Group Distribution</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : (
            <TreeMapChart />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;