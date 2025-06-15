import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const LineChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: observations, error } = await supabase
          .from('observations')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group observations by month
        const monthlyData = observations?.reduce((acc, obs) => {
          const date = new Date(obs.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!acc[monthKey]) {
            acc[monthKey] = {
              name: new Date(date.getFullYear(), date.getMonth()).toLocaleString('default', { month: 'short' }),
              observations: 0,
              pdps: 0
            };
          }
          
          acc[monthKey].observations++;
          if (obs.pdp_id) {
            acc[monthKey].pdps++;
          }
          
          return acc;
        }, {});

        setData(Object.values(monthlyData || {}));
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
      <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Activity</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line 
            type="monotone" 
            dataKey="observations" 
            name="Observations"
            stroke="#8884d8" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="pdps" 
            name="PDPs"
            stroke="#82ca9d" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;