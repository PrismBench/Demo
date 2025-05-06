import React from "react";

const EvaluationAdaption: React.FC = () => {
  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 800 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Model A - Shortcut Path */}
      <rect
        x="100"
        y="50"
        width="200"
        height="80"
        rx="10"
        fill="#f0f0f0"
        stroke="#333"
        strokeWidth="2"
      />
      <text x="200" y="90" textAnchor="middle" fontWeight="bold" fontSize="18">
        Model A
      </text>

      {/* Model B - Reasoning Path */}
      <rect
        x="500"
        y="50"
        width="200"
        height="80"
        rx="10"
        fill="#f0f0f0"
        stroke="#333"
        strokeWidth="2"
      />
      <text x="600" y="90" textAnchor="middle" fontWeight="bold" fontSize="18">
        Model B
      </text>

      {/* Path Visualizations */}
      <rect
        x="130"
        y="150"
        width="140"
        height="30"
        rx="5"
        fill="#ffeeee"
        stroke="#ff6666"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
      <text x="200" y="170" textAnchor="middle" fontSize="14">
        heuristic match
      </text>
      <text x="200" y="195" textAnchor="middle" fontSize="12" fill="#cc0000">
        ⚠️ pattern shortcut
      </text>

      <rect
        x="530"
        y="150"
        width="140"
        height="30"
        rx="5"
        fill="#eeffee"
        stroke="#66cc66"
        strokeWidth="2"
      />
      <text x="600" y="170" textAnchor="middle" fontSize="14">
        semantic reasoning
      </text>
      <text x="600" y="195" textAnchor="middle" fontSize="12" fill="#008800">
        ✓ true understanding
      </text>

      {/* Task Box */}
      <rect
        x="250"
        y="220"
        width="300"
        height="60"
        rx="5"
        fill="#f8f8f8"
        stroke="#888"
        strokeWidth="2"
      />
      <text x="400" y="245" textAnchor="middle" fontWeight="bold" fontSize="14">
        Task: "Sort these numbers in descending order"
      </text>
      <text x="400" y="270" textAnchor="middle" fontSize="14">
        Static Test Result: ✓ PASS ✓
      </text>

      {/* Magnifying Glass - "Evaluation Lens" */}
      <circle
        cx="400"
        cy="210"
        r="30"
        fill="none"
        stroke="#444"
        strokeWidth="1.5"
      />
      <line x1="420" y1="230" x2="440" y2="250" stroke="#444" strokeWidth="3" />
      <text
        x="400"
        y="185"
        textAnchor="middle"
        fontSize="12"
        fontStyle="italic"
      >
        Evaluation lens: too coarse
      </text>

      {/* Arrows */}
      <line
        x1="200"
        y1="130"
        x2="200"
        y2="150"
        stroke="#333"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="600"
        y1="130"
        x2="600"
        y2="150"
        stroke="#333"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="200"
        y1="180"
        x2="200"
        y2="220"
        stroke="#333"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="600"
        y1="180"
        x2="600"
        y2="220"
        stroke="#333"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />

      {/* Arrow Marker Definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>
    </svg>
  );
};

export default EvaluationAdaption;
