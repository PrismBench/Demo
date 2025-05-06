import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import {
  Box,
  Title,
  Text,
  Paper,
  SimpleGrid,
  useMantineColorScheme,
  useMantineTheme,
  Group,
} from "@mantine/core";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ModelMeta } from "../../../types/leaderboard";
import { ConceptMetricsData } from "@/types/leaderboard.ts";
import classes from "./CapabilityMetricsRadar.module.css"; // Import CSS module

// Same concept order as the table for consistency
const concepts = [
  "algorithms",
  "conditionals",
  "data_structures",
  "dynamic_programming",
  "error_handling",
  "functions",
  "loops",
  "recursion",
  "searching",
  "sorting",
];

// Define difficulty groups and their associated keys/colors for the Radar lines
const difficultyLevels = [
  {
    name: "Easy", // Legend name
    dataKey: "Easy", // Key in the chart data object
    keys: ["very easy", "easy"],
    color: "green", // Mantine color name
    title: "Easy Tasks (Very Easy/Easy)",
  },
  {
    name: "Medium",
    dataKey: "Medium",
    keys: ["medium"],
    color: "yellow",
    title: "Medium Tasks",
  },
  {
    name: "Hard",
    dataKey: "Hard",
    keys: ["hard", "very hard"],
    color: "red",
    title: "Hard Tasks (Hard/Very Hard)",
  },
];

interface Props {
  models: ModelMeta[];
  conceptMetrics: Record<string, ConceptMetricsData>;
}

// Helper to format concept names (same as table)
function formatConceptName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to calculate average success rate for a group
function calculateGroupSuccessRate(
  modelData: ConceptMetricsData | undefined,
  concept: string,
  difficultyKeys: string[]
): number {
  if (!modelData?.concept_mastery_distribution?.[concept]) return 0;

  let totalSuccessRate = 0;
  let count = 0;

  difficultyKeys.forEach((key) => {
    const metric = modelData.concept_mastery_distribution[concept]?.[key];
    if (metric?.success_rate !== undefined) {
      totalSuccessRate += metric.success_rate;
      count++;
    }
  });

  // Return success rate (0-1) or 0 if no data
  return count > 0 ? totalSuccessRate / count : 0;
}

// Custom Tooltip Content - Updated for Difficulty Levels per Concept
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        withBorder
        shadow="md"
        radius="md"
        p="xs"
        className={classes.tooltip}
      >
        <Text fw={500} mb={5}>
          {label as string}
        </Text>
        {payload.map((entry) => (
          <Text key={entry.name} size="sm" style={{ color: entry.color }}>
            {entry.name}: {(entry.value as number).toFixed(2)}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

const CapabilityMetricsRadar: React.FC<Props> = ({
  models,
  conceptMetrics,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Prevent rendering if no models or data
  if (models.length === 0 || Object.keys(conceptMetrics).length === 0) {
    const hasData = models.some((model) => conceptMetrics[model.id]);
    if (!hasData) return null; // Still loading or error
  }

  // --- Create one chart per model ---
  const charts = models.map((model) => {
    const modelData = conceptMetrics[model.id];

    // Prepare data for this specific model's radar chart
    // Each item represents a concept, containing success rates for each difficulty level
    const chartData = concepts.map((concept) => {
      // Explicitly define the type for the data point
      type ConceptDifficultyData = {
        concept: string;
        Easy: number;
        Medium: number;
        Hard: number;
      };

      const dataPoint: ConceptDifficultyData = {
        concept: formatConceptName(concept), // Use formatted name for display
        Easy: 0, // Initialize with 0
        Medium: 0,
        Hard: 0,
      };

      difficultyLevels.forEach((level) => {
        const successRate = calculateGroupSuccessRate(
          modelData,
          concept,
          level.keys
        );
        // Assign the calculated rate to the corresponding difficulty key
        dataPoint[
          level.dataKey as keyof Omit<ConceptDifficultyData, "concept">
        ] = successRate;
      });

      return dataPoint;
    });

    // Define the color for this model (consistent or based on theme)
    // For simplicity, using a fixed color or cycling through a palette might be best
    // Here we just use the primary color for the title maybe? Or pass model.color if available?
    // Let's stick to simple titles for now.

    return (
      <Paper
        key={model.id}
        shadow="sm"
        p="md"
        withBorder
        className={classes.chartPaper}
      >
        {/* Use model name in the title */}
        <Title order={4} ta="center" mb="md">
          {model.name}
        </Title>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid
              stroke={
                colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[3]
              }
            />
            <PolarAngleAxis
              dataKey="concept"
              tick={{
                fill:
                  colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.colors.gray[7],
                fontSize: 12,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 1]}
              tickCount={6}
              stroke={
                colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[5]
              }
            />
            {/* Create a Radar for each difficulty level */}
            {difficultyLevels.map((level) => {
              // Get the Mantine color index (e.g., 6 for standard shades)
              const colorShade = colorScheme === "dark" ? 4 : 6;
              const difficultyColor = theme.colors[level.color][colorShade];
              return (
                <Radar
                  key={level.dataKey}
                  name={level.name} // Legend name (Easy, Medium, Hard)
                  dataKey={level.dataKey} // Data key (Easy, Medium, Hard)
                  stroke={difficultyColor}
                  fill={difficultyColor}
                  fillOpacity={0.2} // Lower opacity to see overlaps
                />
              );
            })}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </Paper>
    );
  });

  return (
    <Box className={classes.radarContainer} mt="xl">
      <Title order={3} mb="lg">
        Model Capability Radar Analysis by Difficulty
      </Title>
      <Text size="xs" mb="md">
        Each chart shows a model's success rates across concepts, broken down by
        task difficulty. Higher values (closer to the edge) indicate better
        performance (0-1 scale). Green: Easy, Yellow: Medium, Red: Hard.
      </Text>
      {/* Adjust grid columns based on expected number of selected models */}
      <SimpleGrid
        cols={{ base: 1, md: 2, lg: models.length > 2 ? 3 : models.length }}
        spacing="xs"
      >
        {charts}
      </SimpleGrid>
    </Box>
  );
};

export default CapabilityMetricsRadar;
