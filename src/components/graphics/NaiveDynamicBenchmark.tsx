import React from "react";

const NaiveDynamicBenchmark: React.FC = () => {
  return (
    <div
      className="evaluation-adaption-container"
      style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
    >
      <svg
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto" }}
      >
        {/* Dashed circle for the blind spot loop */}
        <circle
          cx="400"
          cy="300"
          r="240"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          strokeDasharray="10 5"
        />
        <text
          x="400"
          y="80"
          textAnchor="middle"
          fill="#444"
          fontSize="18"
          fontWeight="bold"
        >
          Blind Spot Loop
        </text>

        {/* LLM 1 - Task Generator */}
        <g transform="translate(200, 200)">
          <rect
            x="-50"
            y="-60"
            width="100"
            height="120"
            rx="10"
            fill="#6495ED"
          />
          <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="16">
            Task
          </text>
          <text x="0" y="0" textAnchor="middle" fill="white" fontSize="16">
            Generation
          </text>
          <text x="0" y="20" textAnchor="middle" fill="white" fontSize="16">
            LLM
          </text>
          {/* Robot features */}
          <circle cx="-20" cy="-35" r="8" fill="white" /> {/* Left eye */}
          <circle cx="20" cy="-35" r="8" fill="white" /> {/* Right eye */}
          <rect x="-25" y="-5" width="50" height="5" fill="white" />{" "}
          {/* Mouth */}
          <rect
            x="-30"
            y="-50"
            width="60"
            height="15"
            rx="5"
            fill="#4169E1"
          />{" "}
          {/* Top head */}
        </g>

        {/* LLM 2 - Evaluator */}
        <g transform="translate(600, 200)">
          <rect
            x="-50"
            y="-60"
            width="100"
            height="120"
            rx="10"
            fill="#FF7F50"
          />
          <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="16">
            Evaluation
          </text>
          <text x="0" y="0" textAnchor="middle" fill="white" fontSize="16">
            LLM
          </text>
          {/* Robot features */}
          <circle cx="-20" cy="-35" r="8" fill="white" /> {/* Left eye */}
          <circle cx="20" cy="-35" r="8" fill="white" /> {/* Right eye */}
          <rect x="-25" y="-5" width="50" height="5" fill="white" />{" "}
          {/* Mouth */}
          <rect
            x="-30"
            y="-50"
            width="60"
            height="15"
            rx="5"
            fill="#E25822"
          />{" "}
          {/* Top head */}
        </g>

        {/* LLM 3 - LLM being tested (in the middle) */}
        <g transform="translate(400, 400)">
          <rect
            x="-50"
            y="-60"
            width="100"
            height="120"
            rx="10"
            fill="#9370DB"
          />
          <text x="0" y="-20" textAnchor="middle" fill="white" fontSize="16">
            LLM Being
          </text>
          <text x="0" y="0" textAnchor="middle" fill="white" fontSize="16">
            Tested
          </text>
          {/* Robot features */}
          <circle cx="-20" cy="-35" r="8" fill="white" /> {/* Left eye */}
          <circle cx="20" cy="-35" r="8" fill="white" /> {/* Right eye */}
          <rect x="-25" y="-5" width="50" height="5" fill="white" />{" "}
          {/* Mouth */}
          <rect
            x="-30"
            y="-50"
            width="60"
            height="15"
            rx="5"
            fill="#7B68EE"
          />{" "}
          {/* Top head */}
        </g>

        {/* Arrows for the circular loop */}
        {/* Arrow from Task Generator to Tested LLM */}
        <path
          d="M 270 240 Q 335 320 380 360"
          fill="none"
          stroke="#6495ED"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        <text
          x="300"
          y="310"
          textAnchor="middle"
          fill="#444"
          fontSize="14"
          fontWeight="bold"
        >
          Task Generation
        </text>

        {/* Arrow from Tested LLM to Evaluator */}
        <path
          d="M 430 350 Q 520 300 580 240"
          fill="none"
          stroke="#9370DB"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow from Evaluator back to Task Generator */}
        <path
          d="M 550 160 Q 400 100 250 160"
          fill="none"
          stroke="#FF7F50"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        <text
          x="400"
          y="130"
          textAnchor="middle"
          fill="#444"
          fontSize="14"
          fontWeight="bold"
        >
          Evaluation
        </text>

        {/* Task bubbles floating around */}
        <g opacity="0.4">
          <ellipse
            cx="300"
            cy="180"
            rx="40"
            ry="25"
            fill="#f0f0f0"
            stroke="#ccc"
          />
          <text x="300" y="185" textAnchor="middle" fill="#666" fontSize="10">
            Summarize X
          </text>

          <ellipse
            cx="520"
            cy="150"
            rx="40"
            ry="25"
            fill="#f0f0f0"
            stroke="#ccc"
          />
          <text x="520" y="155" textAnchor="middle" fill="#666" fontSize="10">
            Explain Y
          </text>

          <ellipse
            cx="450"
            cy="450"
            rx="40"
            ry="25"
            fill="#f0f0f0"
            stroke="#ccc"
          />
          <text x="450" y="455" textAnchor="middle" fill="#666" fontSize="10">
            Analyze Z
          </text>

          <ellipse
            cx="280"
            cy="420"
            rx="40"
            ry="25"
            fill="#f0f0f0"
            stroke="#ccc"
          />
          <text x="280" y="425" textAnchor="middle" fill="#666" fontSize="10">
            Define W
          </text>
        </g>

        {/* Warning icons outside the loop */}
        <g>
          <circle
            cx="130"
            cy="330"
            r="15"
            fill="#fff"
            stroke="#e74c3c"
            strokeWidth="2"
          />
          <text
            x="130"
            y="335"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="16"
            fontWeight="bold"
          >
            !
          </text>
          <text
            x="130"
            y="360"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="10"
          >
            Missed Case
          </text>

          <circle
            cx="650"
            cy="380"
            r="15"
            fill="#fff"
            stroke="#e74c3c"
            strokeWidth="2"
          />
          <text
            x="650"
            y="385"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="16"
            fontWeight="bold"
          >
            !
          </text>
          <text
            x="650"
            y="410"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="10"
          >
            Blind Spot
          </text>

          <circle
            cx="500"
            cy="100"
            r="15"
            fill="#fff"
            stroke="#e74c3c"
            strokeWidth="2"
          />
          <text
            x="500"
            y="105"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="16"
            fontWeight="bold"
          >
            !
          </text>
          <text
            x="500"
            y="130"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="10"
          >
            Shared Bias
          </text>
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#444" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default NaiveDynamicBenchmark;
