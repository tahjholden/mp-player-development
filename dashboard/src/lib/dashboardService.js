import { supabase, TABLES } from './supabase';

/**
 * Dashboard Service for MPB Coaches Dashboard
 * Provides data for dashboard components based on MPB MVP requirements
 */
export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const [
        { data: players, error: playersError },
        { data: observations, error: observationsError },
        { data: pdps, error: pdpsError }
      ] = await Promise.all([
        supabase.from(TABLES.PLAYERS).select('*'),
        supabase.from(TABLES.OBSERVATIONS).select('*'),
        supabase.from(TABLES.PDP).select('*')
      ]);

      if (playersError) throw playersError;
      if (observationsError) throw observationsError;
      if (pdpsError) throw pdpsError;

      const activePdps = pdps?.filter(pdp => pdp.active) || [];
      const highPerformers = players?.filter(player => player.skill_level >= 8) || [];

      // Get current week observations (Monday-Sunday)
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday (0)
      startOfWeek.setDate(currentDate.getDate() - diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const weeklyObservationsCount = observations?.filter(obs => {
        const obsDate = new Date(obs.observation_date);
        return obsDate >= startOfWeek && obsDate <= endOfWeek;
      }).length || 0;

      return {
        playerCount: players?.length || 0,
        observationCount: weeklyObservationsCount,
        pdpCount: activePdps.length,
        highPerformers: highPerformers.length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get activity chart data
  getActivityChartData: async () => {
    try {
      const { data: observations, error } = await supabase
        .from(TABLES.OBSERVATIONS)
        .select('*')
        .order('observation_date', { ascending: true });

      if (error) throw error;

      // Process observations into weekly data
      const weeklyData = observations?.reduce((acc, obs) => {
        const date = new Date(obs.observation_date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        acc[weekKey] = (acc[weekKey] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(weeklyData || {}).map(([date, count]) => ({
        date,
        count
      }));
    } catch (error) {
      console.error('Error fetching activity chart data:', error);
      throw error;
    }
  },

  // Get performance metrics data
  getPerformanceMetricsData: async () => {
    try {
      const { data: players, error } = await supabase
        .from(TABLES.PLAYERS)
        .select('*');

      if (error) throw error;

      return players?.map(player => ({
        name: player.name,
        position: player.position,
        groupId: player.group_id
      })) || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  },

  // Get observation completion rate
  getObservationCompletionRate: async () => {
    try {
      const { data: observations, error } = await supabase
        .from(TABLES.OBSERVATIONS)
        .select('*');

      if (error) throw error;

      const totalObservations = observations?.length || 0;
      const completedObservations = observations?.filter(obs => obs.content).length || 0;

      return totalObservations > 0 ? (completedObservations / totalObservations) * 100 : 0;
    } catch (error) {
      console.error('Error fetching observation completion rate:', error);
      throw error;
    }
  },

  // Get player distribution data
  getPlayerDistributionData: async () => {
    try {
      const { data: players, error } = await supabase
        .from(TABLES.PLAYERS)
        .select('*');

      if (error) throw error;

      const distribution = players?.reduce((acc, player) => {
        const position = player.position || 'Unknown';
        acc[position] = (acc[position] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(distribution || {}).map(([position, value]) => ({
        name: position,
        value
      }));
    } catch (error) {
      console.error('Error fetching player distribution:', error);
      throw error;
    }
  },

  // Get recent observations
  getRecentObservations: async () => {
    try {
      const { data: observations, error } = await supabase
        .from(TABLES.OBSERVATIONS)
        .select('*')
        .order('observation_date', { ascending: false })
        .limit(5);

      if (error) throw error;

      return observations || [];
    } catch (error) {
      console.error('Error fetching recent observations:', error);
      throw error;
    }
  },

  // Get player performance data
  getPlayerPerformanceData: async () => {
    try {
      const { data: players, error } = await supabase
        .from(TABLES.PLAYERS)
        .select('*');

      if (error) throw error;

      return players?.map(player => ({
        name: player.name,
        position: player.position,
        groupId: player.group_id
      })) || [];
    } catch (error) {
      console.error('Error fetching player performance data:', error);
      throw error;
    }
  }
};
