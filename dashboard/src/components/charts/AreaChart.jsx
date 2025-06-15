import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AreaChartComponent = ({ data = [] }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="observations" 
            stackId="1"
            name="Observations"
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6} 
          />
          <Area 
            type="monotone" 
            dataKey="pdps" 
            stackId="1"
            name="PDPs"
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.6} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;