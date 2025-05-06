import React from "react";

interface BenchmarkWallProps {
  // Number of models to display
  modelCount?: number;
  // Number of tasks to display
  taskCount?: number;
  // Saturation point - model index where tasks start becoming all green
  saturationPoint?: number;
  // Whether to show the evaluation ceiling
  showCeiling?: boolean;
  // Width and height of the SVG
  width?: number;
  height?: number;
}

const StaticBenchmarkSaturation: React.FC<BenchmarkWallProps> = ({
  modelCount = 6,
  taskCount = 10,
  saturationPoint = 5,
  showCeiling = true,
  width = 600,
  height = 400,
}) => {
  // Calculate dimensions and spacing
  const margin = { top: 35, right: 40, bottom: 25, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const cellWidth = innerWidth / modelCount;
  const cellHeight = innerHeight / taskCount;

  // Generate model versions
  const models = Array.from({ length: modelCount }, (_, i) => `v${i + 1}`);

  // Generate tasks
  const tasks = Array.from({ length: taskCount }, (_, i) => `Task ${i + 1}`);

  // Determine which tasks are completed for each model
  const getTaskStatus = (modelIndex: number, taskIndex: number) => {
    if (modelIndex >= saturationPoint - 1) {
      // After saturation point, all tasks are completed
      return true;
    } else {
      // Before saturation point, tasks are completed based on a pattern
      // Earlier models complete fewer tasks
      return taskIndex <= modelIndex;
    }
  };

  return (
    <svg width={width} height={height}>
      {/* Background */}
      <rect x={0} y={0} width={width} height={height} fill="#f9f9f9" rx={5} />

      {/* Chart title */}
      <text
        x={width / 2}
        y={15}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={14}
      >
        Model Performance on Benchmark Tasks Over Updates
      </text>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Model labels (column headers) */}
        {models.map((model, i) => (
          <text
            key={`model-${i}`}
            x={i * cellWidth + cellWidth / 2}
            y={-15}
            textAnchor="middle"
            fontSize={10}
            fontWeight="bold"
          >
            {model}
          </text>
        ))}

        {/* Task labels (row headers) */}
        {tasks.map((task, i) => (
          <text
            key={`task-${i}`}
            x={-8}
            y={i * cellHeight + cellHeight / 2 + 3}
            textAnchor="end"
            fontSize={9}
            fontWeight={i === 0 ? "bold" : "normal"}
          >
            {task}
          </text>
        ))}

        {/* Task cells with checkmarks or x marks */}
        {models.map((_, modelIndex) =>
          tasks.map((_, taskIndex) => {
            const isCompleted = getTaskStatus(modelIndex, taskIndex);
            const cellSize = Math.min(cellWidth * 0.6, cellHeight * 0.6);

            return (
              <g
                key={`cell-${modelIndex}-${taskIndex}`}
                transform={`translate(${
                  modelIndex * cellWidth + cellWidth / 2
                }, ${taskIndex * cellHeight + cellHeight / 2})`}
              >
                {isCompleted ? (
                  // Checkmark
                  <g>
                    <circle cx={0} cy={0} r={cellSize * 0.5} fill="#e6f7e6" />
                    <path
                      d="M-3,0 L-1,2 L3,-2"
                      stroke="#2ecc71"
                      strokeWidth={1.5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                ) : (
                  // X mark
                  <g>
                    <circle cx={0} cy={0} r={cellSize * 0.5} fill="#ffeeee" />
                    <path
                      d="M-2,-2 L2,2 M-2,2 L2,-2"
                      stroke="#e74c3c"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          })
        )}

        {/* Evaluation ceiling line */}
        {showCeiling && (
          <g>
            <line
              x1={(saturationPoint - 1) * cellWidth - 5}
              y1={-10}
              x2={(saturationPoint - 1) * cellWidth - 5}
              y2={innerHeight + 5}
              stroke="#777"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text
              x={(saturationPoint - 1) * cellWidth}
              y={innerHeight + 20}
              textAnchor="middle"
              fontSize={7}
              fill="#666"
            >
              Evaluation ceiling
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

export default StaticBenchmarkSaturation;
