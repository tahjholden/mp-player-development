import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'];

const PieChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // If data is promise, resolve it
    if (data && typeof data.then === 'function') {
      const fetchData = async () => {
        try {
          const result = await data;
          if (result && Array.isArray(result) && result.length > 0) {
            setChartData(result);
          }
        } catch (error) {
          console.error('Error fetching pie chart data:', error);
        }
      };
      fetchData();
    } else if (data && Array.isArray(data)) {
      setChartData(data);
    }
  }, [data]);
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;