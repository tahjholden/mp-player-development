import React, { useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase, TABLES } from '../../../../src/lib/supabase';

const TreeMapChart = () => {
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

        // Process data for treemap
        const processedData = data.map(player => ({
          name: `${player.first_name} ${player.last_name}`,
          size: player.rating || 0,
          fill: `hsl(${Math.random() * 360}, 70%, 50%)`
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

  // Custom rendering for TreeMap to make it more visually appealing
  const CustomTreemap = ({ root, depth, x, y, width, height, index, colors, name, value }) => {
    return (
      <g>
        {root.children && root.children.map((node, i) => (
          <rect
            key={`rect-${i}`}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            style={{
              fill: node.children ? null : node.color,
              stroke: '#fff',
              strokeWidth: 2 / (depth + 1e-10),
              strokeOpacity: 1 / (depth + 1e-10),
            }}
          />
        ))}
        
        {/* Add text labels for larger rectangles */}
        {root.children && root.children.map((node, i) => {
          const fontSize = Math.min(16, Math.max(8, node.width / 8));
          if ((node.width > 50 && node.height > 30) || node.width > 100) {
            return (
              <text
                key={`text-${i}`}
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                fill="#fff"
                fontSize={fontSize}
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {node.name}
              </text>
            );
          }
          return null;
        })}
      </g>
    );
  };

  // Custom tooltip for better information display
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, size } = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <p className="text-sm">Players: {size}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-72">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Player Distribution by Age Group and Gender</h2>
      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          data={data}
          dataKey="size"
          nameKey="name"
          fill="#8884d8"
          stroke="#fff"
          animationDuration={1000}
          content={<CustomTreemap />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default TreeMapChart;