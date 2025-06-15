import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { supabase, TABLES } from '../../lib/supabase';

const RadarChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLES.PLAYERS)
          .select('*');

        if (error) throw error;

        // Process data for radar chart
        const processedData = data.map(player => ({
          name: `${player.first_name} ${player.last_name}`,
          technical: player.technical_rating || 0,
          tactical: player.tactical_rating || 0,
          physical: player.physical_rating || 0,
          mental: player.mental_rating || 0,
          social: player.social_rating || 0
        }));

        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
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
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Technical" dataKey="technical" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Tactical" dataKey="tactical" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Radar name="Physical" dataKey="physical" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
          <Radar name="Mental" dataKey="mental" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
          <Radar name="Social" dataKey="social" stroke="#0088fe" fill="#0088fe" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;