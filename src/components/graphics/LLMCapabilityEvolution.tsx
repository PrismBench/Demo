import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  Label,
} from "recharts";

// Data representing the LLM capability evolution and benchmark difficulty
const data = [
  { version: "v1", capability: 20, benchmark: 50, label: "Initial release" },
  {
    version: "v2",
    capability: 40,
    benchmark: 52,
    label: "Chain-of-thought emerges",
  },
  {
    version: "v3",
    capability: 65,
    benchmark: 54,
    label: "Increasing model params",
  },
  {
    version: "v4",
    capability: 70,
    benchmark: 55,
    label: "Adding reasoning",
  },
  {
    version: "v5",
    capability: 85,
    benchmark: 56,
    label: "More inference hops",
  },
  { version: "v6", capability: 90, benchmark: 57, label: "RL-optimization" },
  { version: "v7", capability: 100, benchmark: 57, label: "" },
];

// Custom component for annotations
const CustomizedLabel = ({ x, y, stroke, value, index }: any) => {
  const label = data[index].label;
  if (!label) return null;

  return (
    <g>
      <text
        x={x}
        y={y - 15}
        dy={-10}
        fill="var(--mantine-color-body)"
        fontSize={12}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};

const LLMCapabilityEvolution: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "var(--mantine-color-text)",

        borderRadius: "8px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          style={{ backgroundColor: "var(--mantine-color-text)" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="version"
            label={{
              value: "Model Version",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          {/* LLM Capability line */}
          <Line
            type="monotone"
            dataKey="capability"
            stroke="#1A237E"
            strokeWidth={3}
            dot={{ fill: "#1A237E", r: 6 }}
            activeDot={{ r: 8 }}
            name="LLM Capability"
            label={<CustomizedLabel />}
          />

          {/* Benchmark Difficulty line */}
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#757575"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#757575", r: 4 }}
            name="Benchmark Difficulty"
          />

          {/* Special annotation for v3-v6 region */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LLMCapabilityEvolution;
