import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const RadarChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: players, error } = await supabase
          .from('players')
          .select('*');

        if (error) throw error;

        // Calculate average metrics for current and previous periods
        const currentPeriod = players?.filter(player => {
          const lastActive = new Date(player.last_active);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastActive >= thirtyDaysAgo;
        });

        const previousPeriod = players?.filter(player => {
          const lastActive = new Date(player.last_active);
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastActive >= sixtyDaysAgo && lastActive < thirtyDaysAgo;
        });

        const metrics = [
          { subject: 'Skill Level', current: 0, previous: 0 },
          { subject: 'Attendance', current: 0, previous: 0 },
          { subject: 'PDP Progress', current: 0, previous: 0 },
          { subject: 'Observations', current: 0, previous: 0 },
          { subject: 'Performance', current: 0, previous: 0 }
        ];

        // Calculate averages for current period
        if (currentPeriod?.length > 0) {
          metrics[0].current = currentPeriod.reduce((sum, p) => sum + (p.skill_level || 0), 0) / currentPeriod.length;
          metrics[1].current = currentPeriod.reduce((sum, p) => sum + (p.attendance || 0), 0) / currentPeriod.length;
          metrics[2].current = currentPeriod.reduce((sum, p) => sum + (p.pdp_progress || 0), 0) / currentPeriod.length;
          metrics[3].current = currentPeriod.reduce((sum, p) => sum + (p.observation_count || 0), 0) / currentPeriod.length;
          metrics[4].current = currentPeriod.reduce((sum, p) => sum + (p.performance_score || 0), 0) / currentPeriod.length;
        }

        // Calculate averages for previous period
        if (previousPeriod?.length > 0) {
          metrics[0].previous = previousPeriod.reduce((sum, p) => sum + (p.skill_level || 0), 0) / previousPeriod.length;
          metrics[1].previous = previousPeriod.reduce((sum, p) => sum + (p.attendance || 0), 0) / previousPeriod.length;
          metrics[2].previous = previousPeriod.reduce((sum, p) => sum + (p.pdp_progress || 0), 0) / previousPeriod.length;
          metrics[3].previous = previousPeriod.reduce((sum, p) => sum + (p.observation_count || 0), 0) / previousPeriod.length;
          metrics[4].previous = previousPeriod.reduce((sum, p) => sum + (p.performance_score || 0), 0) / previousPeriod.length;
        }

        setData(metrics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-72">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics Comparison</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Current Period"
            dataKey="current"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Radar
            name="Previous Period"
            dataKey="previous"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;