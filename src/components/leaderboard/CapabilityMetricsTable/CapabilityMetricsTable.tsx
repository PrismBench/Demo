import React from "react";
import { Table, Tooltip, Text, Title, Box, Group, Center } from "@mantine/core";
import { ModelMeta, ConceptMetricsData } from "../../../types/leaderboard";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "./CapabilityMetricsTable.module.css"; // Import the CSS module
import { formatConceptName } from "../../../utils/formatters"; // Import from utils

// Define the order and structure of difficulty groups for columns
const difficultyGroups = [
  { name: "Easy", keys: ["very easy", "easy"] },
  { name: "Medium", keys: ["medium"] },
  { name: "Hard", keys: ["hard", "very hard"] },
];

interface Props {
  models: ModelMeta[];
  conceptMetrics: Record<string, ConceptMetricsData>;
}

// Predefined order for concepts (rows)
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

// Helper function to calculate average failure rate for a group
function calculateGroupFailureRate(
  modelData: ConceptMetricsData | undefined,
  concept: string,
  difficultyKeys: string[]
): number | undefined {
  if (!modelData?.concept_mastery_distribution?.[concept]) {
    return undefined;
  }

  let totalSuccessRate = 0;
  let count = 0;

  difficultyKeys.forEach((key) => {
    const metric = modelData.concept_mastery_distribution[concept]?.[key];
    if (metric !== undefined && metric.success_rate !== undefined) {
      totalSuccessRate += metric.success_rate;
      count++;
    }
  });

  if (count === 0) {
    return undefined;
  }

  const avgSuccessRate = totalSuccessRate / count;
  return 1 - avgSuccessRate; // Return failure rate
}

const CapabilityMetricsTable: React.FC<Props> = ({
  models,
  conceptMetrics,
}) => {
  // Prevent rendering if no models or data
  if (models.length === 0 || Object.keys(conceptMetrics).length === 0) {
    // Check if *any* selected model has data yet
    const hasData = models.some((model) => conceptMetrics[model.id]);
    if (!hasData) return null; // Still loading or error
  }

  // --- Build Header Rows ---
  const headerRow1: React.ReactNode[] = [];
  const headerRow2: React.ReactNode[] = [];

  headerRow1.push(
    <Table.Th key="concept-h1" rowSpan={2}>
      Concept
    </Table.Th>
  );

  difficultyGroups.forEach((group) => {
    headerRow1.push(
      <Table.Th
        key={group.name}
        colSpan={models.length}
        className={classes.difficultyGroupHeader}
      >
        {group.name}
      </Table.Th>
    );
    models.forEach((model, modelIndex) => {
      const isLastModelInGroup = modelIndex === models.length - 1;
      headerRow2.push(
        <Table.Th
          key={`${group.name}-${model.id}`}
          className={`${classes.modelHeader} ${
            isLastModelInGroup ? classes.lastModelHeaderInGroup : ""
          }`.trim()}
        >
          {model.name}
        </Table.Th>
      );
    });
  });

  // --- Build Body Rows ---
  const bodyRows = concepts.map((concept) => (
    <Table.Tr key={concept} className={classes.tableRow}>
      <Table.Td className={classes.conceptCell}>
        <Text fw={500}>{formatConceptName(concept)}</Text>
      </Table.Td>
      {difficultyGroups.flatMap((group) =>
        models.map((model, modelIndex) => {
          const modelData = conceptMetrics[model.id];
          const failureRate = calculateGroupFailureRate(
            modelData,
            concept,
            group.keys
          );

          // Determine display content based on failure rate
          let displayContent: React.ReactNode;
          let tooltipLabel: string;
          let cellClassName = classes.dataCell; // Base class for TD
          let pillClassName = classes.pillBase; // Base class for pill

          if (failureRate === undefined) {
            displayContent = (
              <Text size="sm" c="dimmed">
                –
              </Text>
            );
            tooltipLabel = "N/A";
            pillClassName += ` ${classes.pillNa}`;
          } else if (failureRate <= 0) {
            // Use <= 0 for potential floating point inaccuracies
            displayContent = (
              <Center>
                <IconCheck size={16} />
              </Center>
            ); // Darker green
            tooltipLabel = "0.0% Failure Rate (Mastered)";
            pillClassName += ` ${classes.pillMastered}`;
          } else if (failureRate >= 1) {
            // Use >= 1
            displayContent = (
              <Center>
                <IconX size={16} />
              </Center>
            ); // Darker red
            tooltipLabel = "100.0% Failure Rate";
            pillClassName += ` ${classes.pillFailed}`;
          } else {
            displayContent = <Text size="sm">{failureRate.toFixed(2)}</Text>;
            tooltipLabel = `${(failureRate * 100).toFixed(1)}% Failure Rate`;
            pillClassName += ` ${classes.pillIntermediate}`;
          }

          const isLastModelInGroup = modelIndex === models.length - 1;
          const finalCellClassName = `${cellClassName} ${
            isLastModelInGroup ? classes.lastModelDataInGroup : ""
          }`.trim();

          // Calculate dynamic background color only for intermediate rates
          const dynamicBgColor =
            failureRate !== undefined && failureRate > 0 && failureRate < 1
              ? `hsl(${
                  (1 - Math.max(0, Math.min(1, failureRate))) * 120
                }, 85%, ${60 + Math.max(0, Math.min(1, failureRate)) * 20}%)`
              : undefined;

          return (
            <Table.Td
              key={`${concept}-${group.name}-${model.id}`}
              className={finalCellClassName} // Apply only TD structure classes
            >
              <Tooltip label={tooltipLabel} withArrow position="top">
                <Center
                  className={pillClassName}
                  style={{ backgroundColor: dynamicBgColor }}
                >
                  {displayContent}
                </Center>
              </Tooltip>
            </Table.Td>
          );
        })
      )}
    </Table.Tr>
  ));

  return (
    <Box mt="xl" className={classes.tableContainer}>
      <Title order={3} mb="md">
        Model Capability Analysis by Concept and Difficulty
      </Title>
      <Text size="xs" mb="md">
        Values represent average failure rates within difficulty groups (lower =
        better). ✓ indicates 0% failure, ✘ indicates 100% failure.
      </Text>
      <Box className={classes.tableOverflowContainer}>
        <Table highlightOnHover verticalSpacing="xs">
          <Table.Thead className={classes.tableHeader}>
            <Table.Tr>{headerRow1}</Table.Tr>
            <Table.Tr>{headerRow2}</Table.Tr>
          </Table.Thead>
          <Table.Tbody>{bodyRows}</Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default CapabilityMetricsTable;
