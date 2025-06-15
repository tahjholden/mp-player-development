import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const BarChartComponent = () => {
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

        // Group players by skill level
        const skillLevelData = players?.reduce((acc, player) => {
          const level = player.skill_level || 0;
          if (!acc[level]) {
            acc[level] = {
              name: `Level ${level}`,
              players: 0,
              active: 0
            };
          }
          acc[level].players++;
          if (player.status === 'Active') {
            acc[level].active++;
          }
          return acc;
        }, {});

        setData(Object.values(skillLevelData || {}));
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
      <h2 className="text-lg font-medium text-gray-800 mb-4">Players by Skill Level</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="players" name="Total Players" fill="#8884d8" />
          <Bar dataKey="active" name="Active Players" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;