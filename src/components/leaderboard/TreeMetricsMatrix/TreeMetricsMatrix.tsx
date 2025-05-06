import React, { useState, useMemo } from "react";
import {
  Table,
  Tooltip,
  Text,
  Title,
  Box,
  Center,
  Loader,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { ModelMeta, TreeMetricsData } from "../../../types";
import classes from "./TreeMetricsMatrix.module.css";
import {
  formatConceptName,
  formatDifficultyName,
} from "../../../utils/formatters";

interface TreeMetricsMatrixProps {
  selectedModel: ModelMeta | null;
  treeMetrics?: TreeMetricsData | null;
}

// Moved outside the component
const difficultyOrder: Record<string, number> = {
  "very easy": 1,
  easy: 2,
  medium: 3,
  hard: 4,
  "very hard": 5,
};

// Define Depths for Rows - Moved outside and capitalized as constant
const DISPLAY_DEPTHS = Array.from({ length: 12 }, (_, i) => i); // 0 to 11

// --- Color Function (Counts - Cell Style) ---
const getCountCellStyle = (
  count: number,
  maxCount: number
): React.CSSProperties => {
  if (count <= 0 || maxCount === 0) {
    // Use a very light gray for empty/zero cells, distinct from hover
    return {
      backgroundColor: "var(--mantine-color-body)",
      color: "var(--mantine-color-gray-6)",
    };
  }
  const intensity = Math.sqrt(Math.min(1, Math.max(0, count / maxCount)));
  const lightness = 90 - intensity * 50;
  // Only return background and text color
  return {
    backgroundColor: `hsl(210, 80%, ${lightness}%)${""}`, // Fixed template literal
    color: lightness < 60 ? "white" : "var(--mantine-color-blue-9)",
  };
};

// --- Color Function (Rates - Cell Style) ---
const getRateColor = (rate: number | undefined): React.CSSProperties => {
  if (rate === undefined || rate < 0 || rate > 1) {
    return {
      backgroundColor: "var(--mantine-color-body)",
      color: "var(--mantine-color-gray-6)",
    }; // Use style object for consistency
  }
  const hue = rate * 120; // Green (120) to Red (0)
  const lightness = 65; // Adjust for good visibility
  const saturation = 70;
  // Determine text color based on background lightness
  const textColor = lightness > 50 ? "var(--mantine-color-gray-9)" : "white";
  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    color: textColor,
  };
};

const TreeMetricsMatrix: React.FC<TreeMetricsMatrixProps> = ({
  selectedModel,
  treeMetrics,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized processing for Nodes by Concept
  const conceptDistribution = useMemo(() => {
    if (!treeMetrics?.nodes_by_concept)
      return {
        processedData: {},
        sortedConcepts: [],
        maxCount: 0,
        hasData: false,
      };

    const data: Record<string, Record<number, number>> = {};
    const concepts = new Set<string>();
    let max = 0;

    Object.entries(treeMetrics.nodes_by_concept).forEach(
      ([depthStr, conceptData]) => {
        const depth = parseInt(depthStr, 10);
        if (isNaN(depth)) return;
        Object.entries(conceptData).forEach(([concept, count]) => {
          concepts.add(concept);
          if (!data[concept]) data[concept] = {};
          data[concept][depth] = count;
          if (count > max) max = count;
        });
      }
    );

    const sorted = Array.from(concepts).sort();
    return {
      processedData: data,
      sortedConcepts: sorted,
      maxCount: max,
      hasData: sorted.length > 0,
    };
  }, [treeMetrics]);

  // Memoized processing for Nodes by Difficulty
  const difficultyDistribution = useMemo(() => {
    if (!treeMetrics?.nodes_by_difficulty)
      return {
        processedData: {},
        sortedDifficulties: [],
        maxCount: 0,
        hasData: false,
      };

    const data: Record<string, Record<number, number>> = {};
    const difficulties = new Set<string>();
    let max = 0;

    Object.entries(treeMetrics.nodes_by_difficulty).forEach(
      ([depthStr, difficultyData]) => {
        const depth = parseInt(depthStr, 10);
        if (isNaN(depth)) return;
        Object.entries(difficultyData).forEach(([difficulty, count]) => {
          difficulties.add(difficulty);
          if (!data[difficulty]) data[difficulty] = {};
          data[difficulty][depth] = count;
          if (count > max) max = count;
        });
      }
    );

    const sorted = Array.from(difficulties).sort(
      (a, b) => (difficultyOrder[a] ?? 99) - (difficultyOrder[b] ?? 99)
    );
    return {
      processedData: data,
      sortedDifficulties: sorted,
      maxCount: max,
      hasData: sorted.length > 0,
    };
  }, [treeMetrics]);

  // Memoized processing for Path Success Rate
  const pathSuccessData = useMemo(() => {
    if (!treeMetrics?.path_success_by_concept || !conceptDistribution.hasData)
      return {
        processedData: {},
        sortedPathLengths: [],
        hasData: false,
      };

    const data: Record<string, Record<number, number>> = {};
    const pathLengths = new Set<number>();

    Object.entries(treeMetrics.path_success_by_concept).forEach(
      ([concept, pathData]) => {
        if (!data[concept]) data[concept] = {};
        Object.entries(pathData).forEach(([pathLengthStr, rate]) => {
          const pathLength = parseInt(pathLengthStr, 10);
          if (isNaN(pathLength)) return;
          pathLengths.add(pathLength);
          data[concept][pathLength] = rate;
        });
      }
    );

    const sorted = Array.from(pathLengths).sort((a, b) => a - b);
    return {
      processedData: data,
      sortedPathLengths: sorted,
      hasData: sorted.length > 0,
    };
  }, [treeMetrics, conceptDistribution.hasData]);

  // --- Build Concept Table Headers ---
  const buildConceptHeaders = () => {
    if (!conceptDistribution.hasData) return null;
    const headerRow1: React.ReactNode[] = [];
    const headerRow2: React.ReactNode[] = [];

    headerRow1.push(
      <Table.Th key="depth-h1" rowSpan={2} className={classes.depthCell}>
        Depth
      </Table.Th>
    );
    headerRow1.push(
      <Table.Th
        key="concepts-group"
        colSpan={conceptDistribution.sortedConcepts.length}
        className={classes.categoryGroupHeader}
      >
        Concepts
      </Table.Th>
    );
    conceptDistribution.sortedConcepts.forEach((concept) => {
      headerRow2.push(
        <Table.Th key={`concept-${concept}`} className={classes.itemHeader}>
          {formatConceptName(concept)}
        </Table.Th>
      );
    });

    return { headerRow1, headerRow2 };
  };

  // --- Build Concept Table Body Rows ---
  const buildConceptBodyRows = () => {
    if (!conceptDistribution.hasData) return null;
    return DISPLAY_DEPTHS.map((depth) => (
      <Table.Tr key={depth} className={classes.tableRow}>
        <Table.Td className={classes.depthCell}>{depth}</Table.Td>
        {conceptDistribution.sortedConcepts.map((concept) => {
          const count =
            conceptDistribution.processedData?.[concept]?.[depth] ?? 0;
          const roundedCount = Math.ceil(count);
          const { backgroundColor, color } = getCountCellStyle(
            count,
            conceptDistribution.maxCount
          );
          return (
            <Table.Td
              key={`concept-${concept}-${depth}`}
              className={classes.dataCell}
              style={{ backgroundColor, color }}
            >
              <Tooltip
                label={`Count: ${count.toFixed(2)}`}
                withArrow
                position="top"
              >
                <span className={classes.tooltipContentSpan}>
                  {roundedCount > 0 ? roundedCount : ""}
                </span>
              </Tooltip>
            </Table.Td>
          );
        })}
      </Table.Tr>
    ));
  };

  // --- Build Difficulty Table Headers ---
  const buildDifficultyHeaders = () => {
    if (!difficultyDistribution.hasData) return null;
    const headerRow1: React.ReactNode[] = [];
    const headerRow2: React.ReactNode[] = [];

    headerRow1.push(
      <Table.Th key="depth-h1" rowSpan={2} className={classes.depthCell}>
        Depth
      </Table.Th>
    );
    headerRow1.push(
      <Table.Th
        key="difficulties-group"
        colSpan={difficultyDistribution.sortedDifficulties.length}
        className={classes.categoryGroupHeader}
      >
        Difficulties
      </Table.Th>
    );
    difficultyDistribution.sortedDifficulties.forEach((difficulty) => {
      headerRow2.push(
        <Table.Th
          key={`difficulty-${difficulty}`}
          className={classes.itemHeader}
        >
          {formatDifficultyName(difficulty)}
        </Table.Th>
      );
    });
    return { headerRow1, headerRow2 };
  };

  // --- Build Difficulty Table Body Rows ---
  const buildDifficultyBodyRows = () => {
    if (!difficultyDistribution.hasData) return null;
    return DISPLAY_DEPTHS.map((depth) => (
      <Table.Tr key={depth} className={classes.tableRow}>
        <Table.Td className={classes.depthCell}>{depth}</Table.Td>
        {difficultyDistribution.sortedDifficulties.map((difficulty) => {
          const count =
            difficultyDistribution.processedData?.[difficulty]?.[depth] ?? 0;
          const roundedCount = Math.ceil(count);
          const { backgroundColor, color } = getCountCellStyle(
            count,
            difficultyDistribution.maxCount
          );
          return (
            <Table.Td
              key={`difficulty-${difficulty}-${depth}`}
              className={classes.dataCell}
              style={{ backgroundColor, color }}
            >
              <Tooltip
                label={`Count: ${count.toFixed(2)}`}
                withArrow
                position="top"
              >
                <span className={classes.tooltipContentSpan}>
                  {roundedCount > 0 ? roundedCount : ""}
                </span>
              </Tooltip>
            </Table.Td>
          );
        })}
      </Table.Tr>
    ));
  };

  // --- Build Path Success Table Components ---
  const buildPathSuccessHeaders = () => {
    if (!pathSuccessData.hasData) return null;
    // Path success rows are Concepts, columns are Path Lengths
    return (
      <Table.Tr>
        <Table.Th className={classes.conceptCell}>Concept</Table.Th>
        {pathSuccessData.sortedPathLengths.map((pathLength) => (
          <Table.Th
            key={`pathLength-${pathLength}`}
            className={classes.itemHeader}
          >
            Len {pathLength}
          </Table.Th>
        ))}
      </Table.Tr>
    );
  };

  const buildPathSuccessBodyRows = () => {
    // Check required data
    if (!pathSuccessData.hasData || !conceptDistribution.hasData) return null;

    // Iterate through CONCEPTS for rows
    return conceptDistribution.sortedConcepts.map((concept) => (
      <Table.Tr key={`path-concept-${concept}`} className={classes.tableRow}>
        {/* Concept Name Cell */}
        <Table.Td className={classes.conceptCell}>
          {formatConceptName(concept)}
        </Table.Td>
        {/* Data cells for each Path Length */}
        {pathSuccessData.sortedPathLengths.map((pathLength) => {
          const rate = pathSuccessData.processedData?.[concept]?.[pathLength];
          const displayRate =
            rate !== undefined ? `${(rate * 100).toFixed(0)}%` : "";
          const cellStyle = getRateColor(rate);

          return (
            <Table.Td
              key={`path-cell-${concept}-${pathLength}`}
              style={cellStyle}
              className={classes.dataCell}
            >
              <Tooltip
                label={`Rate: ${rate !== undefined ? rate.toFixed(3) : "N/A"}`}
                position="top"
                withArrow
                disabled={rate === undefined}
              >
                <span className={classes.tooltipContentSpan}>
                  {displayRate}
                </span>
              </Tooltip>
            </Table.Td>
          );
        })}
      </Table.Tr>
    ));
  };

  // Call the builder functions
  const conceptHeaders = buildConceptHeaders();
  const conceptBodyRows = buildConceptBodyRows();
  const difficultyHeaders = buildDifficultyHeaders();
  const difficultyBodyRows = buildDifficultyBodyRows();
  const pathSuccessHeaderRow = buildPathSuccessHeaders();
  const pathSuccessBodyRows = buildPathSuccessBodyRows();

  // Handle loading/error/no model selected states
  if (loading) {
    return (
      <Center>
        <Loader />
        <Text ml="sm">Loading tree metrics...</Text>
      </Center>
    );
  }
  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }
  if (!selectedModel) {
    return <Text>Select a model to view tree metrics.</Text>;
  }
  if (
    !treeMetrics ||
    (!conceptDistribution.hasData &&
      !difficultyDistribution.hasData &&
      !pathSuccessData.hasData)
  ) {
    return (
      <Text mt="md">
        Required tree metrics data is missing or incomplete for{" "}
        {selectedModel.name}.
      </Text>
    );
  }

  return (
    <Box mt="xl" w="100%">
      <Title order={3} mb="lg" ta="left">
        Tree Metrics for {selectedModel?.name}
      </Title>

      {/* Node Distribution by Concept Table */}
      {conceptDistribution.hasData && conceptHeaders && conceptBodyRows && (
        <Box mb="xl" className={classes.boxContainer}>
          <Title order={4} mb="xs">
            Node Distribution by Concept & Depth
          </Title>
          <Text size="xs" mb="md">
            Node counts at each depth, grouped by Concept.
          </Text>
          <div className={classes.tableContainer}>
            <Table className={classes.metricsTable} highlightOnHover>
              <Table.Thead className={classes.tableHeader}>
                <Table.Tr>{conceptHeaders.headerRow1}</Table.Tr>
                <Table.Tr>{conceptHeaders.headerRow2}</Table.Tr>
              </Table.Thead>
              <Table.Tbody>{conceptBodyRows}</Table.Tbody>
            </Table>
          </div>
        </Box>
      )}
      {!conceptDistribution.hasData && treeMetrics && (
        <Text mt="md">
          No concept node distribution data available for {selectedModel?.name}.
        </Text>
      )}

      {/* Node Distribution by Difficulty Table */}
      {difficultyDistribution.hasData &&
        difficultyHeaders &&
        difficultyBodyRows && (
          <Box mb="xl" className={classes.boxContainer}>
            <Title order={4} mb="xs">
              Node Distribution by Difficulty & Depth
            </Title>
            <Text size="xs" mb="md">
              Node counts at each depth, grouped by Difficulty.
            </Text>
            <div className={classes.tableContainer}>
              <Table className={classes.metricsTable} highlightOnHover>
                <Table.Thead className={classes.tableHeader}>
                  <Table.Tr>{difficultyHeaders.headerRow1}</Table.Tr>
                  <Table.Tr>{difficultyHeaders.headerRow2}</Table.Tr>
                </Table.Thead>
                <Table.Tbody>{difficultyBodyRows}</Table.Tbody>
              </Table>
            </div>
          </Box>
        )}
      {!difficultyDistribution.hasData && treeMetrics && (
        <Text mt="md">
          No difficulty node distribution data available for{" "}
          {selectedModel?.name}.
        </Text>
      )}

      {/* Path Success Rate Table */}
      {pathSuccessData.hasData &&
        pathSuccessHeaderRow &&
        pathSuccessBodyRows && (
          <Box mt="xl" className={classes.boxContainer}>
            <Title order={4} mb="xs">
              Path Success Rate by Concept & Path Length
            </Title>
            <Text size="xs" mb="md">
              Heatmap showing the success rate (0-100%) for paths ending at a
              given length, categorized by the target concept. Color indicates
              rate (Green=High, Red=Low).
            </Text>
            <div className={classes.tableContainer}>
              <Table className={classes.metricsTable} highlightOnHover>
                <Table.Thead className={classes.tableHeader}>
                  {/* Use the single header row builder */}
                  {pathSuccessHeaderRow}
                </Table.Thead>
                <Table.Tbody>{pathSuccessBodyRows}</Table.Tbody>
              </Table>
            </div>
          </Box>
        )}
      {/* Message if path success data is missing but other data exists */}
      {!pathSuccessData.hasData &&
        treeMetrics &&
        (conceptDistribution.hasData || difficultyDistribution.hasData) && (
          <Text mt="md">
            No path success rate data available for {selectedModel?.name}.
          </Text>
        )}
    </Box>
  );
};

export default TreeMetricsMatrix;
