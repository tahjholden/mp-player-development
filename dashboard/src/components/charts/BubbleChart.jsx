import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const BubbleChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const domain = [0, 500];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: players, error } = await supabase
          .from('players')
          .select('*');

        if (error) throw error;

        // Transform player data for the bubble chart
        const chartData = players?.map(player => ({
          x: player.skill_level * 50, // Scale skill level to x-axis
          y: player.observation_count * 20, // Scale observation count to y-axis
          z: player.pdp_progress * 5, // Scale PDP progress to bubble size
          name: player.name,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
        })) || [];

        setData(chartData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Custom tooltip to display detailed bubble information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, x, y, z } = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <p className="text-sm">Skill Level: {x/50}</p>
          <p className="text-sm">Observations: {y/20}</p>
          <p className="text-sm">PDP Progress: {z/5}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-72">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Player Performance Overview</h2>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Skill Level" 
            domain={domain} 
            label={{ value: 'Skill Level', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Observations" 
            domain={domain} 
            label={{ value: 'Observations', angle: -90, position: 'insideLeft' }} 
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[50, 400]} 
            name="PDP Progress" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.map((entry, index) => (
            <Scatter 
              key={index} 
              name={entry.name} 
              data={[entry]} 
              fill={entry.color}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;