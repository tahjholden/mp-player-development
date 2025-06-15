import { supabase } from './supabase';
import { areaChartData, barChartData, pieChartData, lineChartData, radarChartData, COLORS } from '../data/mockData';

/**
 * Dashboard Service for MPB Coaches Dashboard
 * Provides data for dashboard components based on MPB MVP requirements
 */
export const dashboardService = {
  // Sample data insertion for demo purposes
  insertSampleData: async () => {
    try {
      // Check if tables exist and have data
      const { count: playerCount, error: playerCountError } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true });

      // Only insert sample data if tables are empty
      if (playerCountError || playerCount === 0) {
        console.log('Inserting sample data for demo...');
        // Sample data would be inserted here in a real implementation
        // We'll simulate success for the dashboard demo
      }
      
      return true;
    } catch (error) {
      console.error('Error inserting sample data:', error);
      return false;
    }
  },
  
  // Get stats for the dashboard stats cards
  getDashboardStats: async () => {
    try {
      // Get counts from our tables where available
      const [playersPromise, coachesPromise, parentsPromise] = [
        supabase.from('players').select('*', { count: 'exact', head: true }),
        supabase.from('coaches').select('*', { count: 'exact', head: true }),
        supabase.from('parents').select('*', { count: 'exact', head: true })
      ];
      
      const [playersResult, coachesResult, parentsResult] = await Promise.all([
        playersPromise, 
        coachesPromise, 
        parentsPromise
      ]);
      
      return {
        playerCount: playersResult.error ? 12 : playersResult.count || 12, // Fallback to demo data
        coachCount: coachesResult.error ? 4 : coachesResult.count || 4,
        parentCount: parentsResult.error ? 18 : parentsResult.count || 18,
        observationsCount: 42, // Demo data
        groupCount: 6 // Demo data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return demo data when error occurs
      return {
        playerCount: 12,
        coachCount: 4,
        parentCount: 18,
        observationsCount: 42,
        groupCount: 6
      };
    }
  },
  
  // Get activity chart data for observations and PDPs
  getActivityChartData: async () => {
    try {
      // We'll use player data to generate mock activity trends for now
      const { data: players, error } = await supabase.from('players').select('*');
      
      if (error) throw error;
      
      if (players && players.length > 0) {
        // Generate simulated data based on player count
        return [
          { name: 'Jan', observations: Math.round(players.length * 2.5), pdps: Math.round(players.length * 0.8) },
          { name: 'Feb', observations: Math.round(players.length * 1.8), pdps: Math.round(players.length * 0.7) },
          { name: 'Mar', observations: Math.round(players.length * 3.2), pdps: Math.round(players.length * 0.9) },
          { name: 'Apr', observations: Math.round(players.length * 2.7), pdps: Math.round(players.length * 1.2) },
          { name: 'May', observations: Math.round(players.length * 3.5), pdps: Math.round(players.length * 1.1) },
          { name: 'Jun', observations: Math.round(players.length * 4.2), pdps: Math.round(players.length * 1.3) }
        ];
      }
      
      // Fall back to mock data if no players found
      return areaChartData;
    } catch (error) {
      console.error('Error fetching activity chart data:', error);
      return areaChartData;
    }
  },
  
  // Get players per coach distribution for bar chart
  getGroupDistributionData: async () => {
    try {
      const { data: coaches, error: coachesError } = await supabase.from('coaches').select('id, first_name, last_name');
      
      if (coachesError) throw coachesError;
      
      if (coaches && coaches.length > 0) {
        // For now, generate simulated distribution data
        return coaches.map((coach) => {
          const playerCount = Math.floor(Math.random() * 10) + 5; // Random number between 5-15
          return {
            name: `${coach.first_name} ${coach.last_name}`,
            players: playerCount
          };
        });
      }
      
      return barChartData;
    } catch (error) {
      console.error('Error fetching coach distribution data:', error);
      return barChartData;
    }
  },
  
  // Get player positions data for pie chart
  getPlayerPositionsData: async () => {
    try {
      const { data: players, error } = await supabase.from('players').select('position');
      
      if (error) throw error;
      
      if (players && players.length > 0) {
        const positions = {};
        
        // Count players by position
        players.forEach(player => {
          const position = player.position || 'Unassigned';
          positions[position] = (positions[position] || 0) + 1;
        });
        
        // Format for pie chart
        return Object.entries(positions).map(([name, value]) => ({ name, value }));
      }
      
      return pieChartData;
    } catch (error) {
      console.error('Error fetching player positions data:', error);
      return pieChartData;
    }
  },
  
  // Get PDP progress data for line chart
  getObservationGrowthData: async () => {
    // This would come from observation and PDP tables when available
    return lineChartData;
  },
  
  // Get performance metrics data for radar chart
  getPerformanceMetricsData: async () => {
    return radarChartData;
  },
  
  // Get observation completion rate for gauge chart
  getObservationCompletionRate: () => {
    // Return a mock percentage between 0-100
    return Math.floor(Math.random() * 35) + 65; // Returns 65-100%
  },
  
  // Get bubble chart data
  getBubbleChartData: () => {
    return [
      { name: 'Group A', value: 700, count: 10 },
      { name: 'Group B', value: 500, count: 8 },
      { name: 'Group C', value: 400, count: 6 },
      { name: 'Group D', value: 200, count: 3 }
    ];
  },
  
  // Get treemap data
  getTreeMapData: () => {
    return [
      {
        name: 'U12',
        children: [
          { name: 'Boys', size: 8 },
          { name: 'Girls', size: 6 }
        ]
      },
      {
        name: 'U14',
        children: [
          { name: 'Boys', size: 10 },
          { name: 'Girls', size: 7 }
        ]
      },
      {
        name: 'U16',
        children: [
          { name: 'Boys', size: 9 },
          { name: 'Girls', size: 8 }
        ]
      }
    ];
  },
  
  // Get recent observations
  getRecentObservations: async (limit = 5) => {
    try {
      // Mock data until observations table is available
      return [
        {
          id: '1',
          date: '2023-06-15',
          type: 'Practice',
          player_name: 'Dillon Rice',
          observer_name: 'Tahj Holden',
          summary: 'Improved passing skills'
        },
        {
          id: '2',
          date: '2023-06-14',
          type: 'Game',
          player_name: 'Cole Holden',
          observer_name: 'Tahj Holden',
          summary: 'Strong defense performance'
        }
      ];
    } catch (error) {
      console.error('Error fetching recent observations:', error);
      return [];
    }
  }
};
