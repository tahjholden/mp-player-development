import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase, TABLES } from '../../lib/supabase';

const BubbleChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const domain = [0, 500];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(TABLES.PLAYERS)
          .select('*');

        if (error) throw error;

        // Process data for bubble chart
        const processedData = data.map(player => ({
          x: player.age || 0,
          y: player.rating || 0,
          z: player.experience || 0,
          name: `${player.first_name} ${player.last_name}`
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
            name="Age" 
            domain={domain} 
            label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Rating" 
            domain={domain} 
            label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} 
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[50, 400]} 
            name="Experience" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.map((entry, index) => (
            <Scatter 
              key={index} 
              name={entry.name} 
              data={[entry]} 
              fill="#8884d8"
              shape="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChart;