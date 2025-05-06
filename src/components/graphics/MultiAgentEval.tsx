import React from "react";

const MultiAgentEval: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Task-generating agents */}
      <g>
        {/* A1 Circle */}
        <circle cx="200" cy="120" r="60" stroke="white" strokeWidth="3" />
        <text
          x="200"
          y="140"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="40"
        >
          A1
        </text>

        {/* A2 Circle */}
        <circle cx="200" cy="260" r="60" stroke="white" strokeWidth="3" />
        <text
          x="200"
          y="280"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="40"
        >
          A2
        </text>

        {/* A3 Circle */}
        <circle cx="200" cy="400" r="60" stroke="white" strokeWidth="3" />
        <text
          x="200"
          y="420"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="40"
        >
          A3
        </text>

        {/* Label */}
        <text
          x="200"
          y="520"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          Task-generating
        </text>
        <text
          x="200"
          y="565"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          agents
        </text>
      </g>

      {/* First Arrow */}
      <g>
        <line
          x1="300"
          y1="260"
          x2="420"
          y2="260"
          stroke="white"
          strokeWidth="3"
        />
        <polygon points="420,260 400,250 400,270" fill="white" />
      </g>

      {/* Structured task space */}
      <g>
        {/* Tree Structure */}
        {/* Root node */}
        <circle cx="500" cy="160" r="30" stroke="white" strokeWidth="3" />

        {/* Level 1 node */}
        <circle cx="500" cy="260" r="30" stroke="white" strokeWidth="3" />

        {/* Level 2 node */}
        <circle cx="500" cy="360" r="30" stroke="white" strokeWidth="3" />

        {/* Tree Connections */}
        <line
          x1="500"
          y1="190"
          x2="500"
          y2="230"
          stroke="white"
          strokeWidth="3"
        />
        <line
          x1="500"
          y1="290"
          x2="500"
          y2="330"
          stroke="white"
          strokeWidth="3"
        />

        {/* Branches */}
        <line
          x1="500"
          y1="160"
          x2="600"
          y2="200"
          stroke="white"
          strokeWidth="3"
        />
        <line
          x1="500"
          y1="260"
          x2="600"
          y2="300"
          stroke="white"
          strokeWidth="3"
        />

        {/* Label */}
        <text
          x="500"
          y="520"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          Structured
        </text>
        <text
          x="500"
          y="565"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          task space
        </text>
      </g>

      {/* Second Arrow */}
      <g>
        <line
          x1="600"
          y1="260"
          x2="720"
          y2="260"
          stroke="white"
          strokeWidth="3"
        />
        <polygon points="720,260 700,250 700,270" fill="white" />
      </g>

      {/* External reward signal */}
      <g>
        {/* Shield Shape */}
        <path
          d="M800 140 L880 140 C880 140 900 300 800 380 C700 300 720 140 720 140 L800 140"
          stroke="white"
          strokeWidth="3"
          fill="none"
        />

        {/* Checkmark */}
        <path
          d="M760 260 L785 310 L850 210"
          stroke="white"
          strokeWidth="5"
          fill="none"
        />

        {/* Label */}
        <text
          x="800"
          y="520"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          External
        </text>
        <text
          x="800"
          y="565"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="normal"
        >
          reward signal
        </text>
      </g>
    </svg>
  );
};

export default MultiAgentEval;
