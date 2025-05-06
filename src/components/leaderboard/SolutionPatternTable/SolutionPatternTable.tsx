import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Text,
  Group,
  Select,
  Box,
  Loader,
  Paper,
  Title,
  Divider,
  Badge,
  Chip,
  Progress,
  Stack,
  Tooltip,
  ActionIcon,
  RingProgress,
  SimpleGrid,
  Button,
  Tabs,
  TextInput,
  ScrollArea,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconInfoCircle,
  IconSearch,
  IconActivity,
  IconListDetails,
  IconChartBar,
} from "@tabler/icons-react";
import {
  ModelMeta,
  PatternMetricsData,
  PatternAnalysisEntry,
} from "../../../types";
import { fetchModelPatternMetrics } from "../../../api/leaderboardService";
import styles from "./SolutionPatternTable.module.css";

interface SolutionPatternTableProps {
  models: ModelMeta[];
}

// Define a type for the aggregated pattern effectiveness data
interface PatternEffectivenessData {
  patternName: string;
  averageSuccessRate: number;
  totalOccurrences: number;
  successfulOccurrences: number;
  difficultyDistribution: Record<string, number>;
}

const SolutionPatternTable: React.FC<SolutionPatternTableProps> = ({
  models,
}) => {
  const [patternMetrics, setPatternMetrics] = useState<
    Record<string, PatternMetricsData>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedDifficulties, setExpandedDifficulties] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [showEffectivenessView, setShowEffectivenessView] =
    useState<boolean>(false);
  const [patternSearchQuery, setPatternSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("most-common");

  // Fetch pattern metrics data for all selected models
  useEffect(() => {
    const fetchPatternMetricsData = async () => {
      if (models.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const metricsPromises = models.map((model) =>
          fetchModelPatternMetrics(model.id)
            .then((data) => ({ modelId: model.id, data }))
            .catch((err) => {
              console.error(
                `Error fetching pattern metrics for ${model.id}:`,
                err
              );
              return { modelId: model.id, error: err.message };
            })
        );

        const results = await Promise.all(metricsPromises);

        const metricsData: Record<string, PatternMetricsData> = {};
        results.forEach((result) => {
          if ("data" in result) {
            metricsData[result.modelId] = result.data;
          }
        });

        setPatternMetrics(metricsData);

        // Initialize expanded state for each model and difficulty
        const initialExpandedState: Record<
          string,
          Record<string, boolean>
        > = {};
        models.forEach((model) => {
          const modelData = metricsData[model.id];
          if (modelData) {
            initialExpandedState[model.id] = {};

            // Extract all difficulties
            const difficulties = new Set<string>();
            Object.keys(modelData).forEach((key) => {
              const parts = key.split("-");
              const difficulty = parts[parts.length - 1].toLowerCase();
              difficulties.add(difficulty);
            });

            // Set all to expanded by default
            difficulties.forEach((difficulty) => {
              initialExpandedState[model.id][difficulty] = true;
            });
          }
        });

        setExpandedDifficulties(initialExpandedState);
      } catch (err) {
        console.error("Failed to fetch pattern metrics data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatternMetricsData();
  }, [models]);

  // Aggregate pattern effectiveness data across all models
  const patternEffectivenessData = useMemo(() => {
    const patternData: Record<string, PatternEffectivenessData> = {};

    // Process all models and their metrics
    Object.entries(patternMetrics).forEach(([modelId, modelMetrics]) => {
      Object.entries(modelMetrics).forEach(([conceptDifficultyKey, entry]) => {
        const parts = conceptDifficultyKey.split("-");
        const difficulty = parts[parts.length - 1].toLowerCase();
        const successRate = entry.success_rate;

        // Process each pattern in this entry
        Object.entries(entry.patterns).forEach(([patternName, count]) => {
          if (!patternData[patternName]) {
            patternData[patternName] = {
              patternName,
              averageSuccessRate: 0,
              totalOccurrences: 0,
              successfulOccurrences: 0,
              difficultyDistribution: {},
            };
          }

          // Update pattern data
          patternData[patternName].totalOccurrences += count;
          patternData[patternName].successfulOccurrences += count * successRate;

          // Update difficulty distribution
          if (!patternData[patternName].difficultyDistribution[difficulty]) {
            patternData[patternName].difficultyDistribution[difficulty] = 0;
          }
          patternData[patternName].difficultyDistribution[difficulty] += count;
        });
      });
    });

    // Calculate average success rate for each pattern
    Object.values(patternData).forEach((pattern) => {
      pattern.averageSuccessRate =
        pattern.totalOccurrences > 0
          ? pattern.successfulOccurrences / pattern.totalOccurrences
          : 0;
    });

    // Convert to array and sort by effectiveness (success rate)
    return Object.values(patternData).sort(
      (a, b) => b.averageSuccessRate - a.averageSuccessRate
    );
  }, [patternMetrics]);

  // Format a single concept name
  const formatConceptName = (concept: string): string => {
    // Split by underscore and capitalize each word
    return concept
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format the concept groups for display
  const formatConceptGroup = (conceptStr: string): string[] => {
    return conceptStr.split("-").map(formatConceptName);
  };

  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    if (category === "all") return "All Categories";
    return formatConceptGroup(category).join(", ");
  };

  // Get categories from available data
  const getCategories = (): string[] => {
    const categories = new Set<string>();

    Object.values(patternMetrics).forEach((modelData) => {
      Object.keys(modelData).forEach((key) => {
        // Extract category from key (format: concept-concept-concept-difficulty)
        const parts = key.split("-");
        if (parts.length > 1) {
          // Get concept combination without the difficulty
          const conceptPart = parts.slice(0, -1).join("-");
          categories.add(conceptPart);
        }
      });
    });

    return ["all", ...Array.from(categories)];
  };

  // Filter data based on selected category
  const filterDataByCategory = (
    modelData: PatternMetricsData
  ): PatternMetricsData => {
    if (selectedCategory === "all") return modelData;

    return Object.entries(modelData).reduce((filtered, [key, value]) => {
      if (key.startsWith(selectedCategory)) {
        filtered[key] = value;
      }
      return filtered;
    }, {} as PatternMetricsData);
  };

  // Get difficulty sort priority (lower number = higher priority)
  const getDifficultySortPriority = (difficulty: string): number => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === "very hard") return 1;
    if (lowerDifficulty === "hard") return 2;
    if (lowerDifficulty === "medium") return 3;
    if (lowerDifficulty === "easy") return 4;
    return 5; // Default for unknown difficulties
  };

  // Toggle difficulty expansion
  const toggleDifficulty = (modelId: string, difficulty: string) => {
    setExpandedDifficulties((prev) => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {}),
        [difficulty.toLowerCase()]: !(
          prev[modelId]?.[difficulty.toLowerCase()] ?? false
        ),
      },
    }));
  };

  // Format pattern names to be more readable
  const formatPatternName = (pattern: string): string => {
    // Replace underscores with spaces and capitalize first letter
    return pattern
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Process patterns to get top patterns sorted by count
  const processPatterns = (
    patterns: Record<string, number>
  ): [string, number][] => {
    // Convert to array and sort by count (descending)
    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Get top 3
  };

  // Format difficulty label to be more readable
  const formatDifficultyLabel = (difficulty: string): string => {
    // Capitalize each word
    return difficulty
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "green";
      case "medium":
        return "yellow";
      case "hard":
        return "orange";
      case "very hard":
        return "red";
      default:
        return "gray";
    }
  };

  // Get color for pattern based on ranking
  const getPatternColor = (index: number): string => {
    const colors = ["blue", "cyan", "teal"];
    return colors[index] || "gray";
  };

  // Get color based on success rate
  const getEffectivenessColor = (rate: number): string => {
    if (rate >= 0.7) return "green";
    if (rate >= 0.5) return "yellow";
    if (rate >= 0.3) return "orange";
    return "red";
  };

  // Render a single pattern effectiveness row
  const renderPatternRow = (pattern: PatternEffectivenessData) => {
    return (
      <div key={pattern.patternName} className={styles.patternEffectivenessRow}>
        <Group justify="space-between" align="center" wrap="nowrap" w="100%">
          <Group gap="xs" wrap="nowrap">
            <Badge size="md" color="blue">
              {pattern.totalOccurrences.toFixed(1)}
            </Badge>
            <Tooltip
              label={
                <div>
                  <Text fw={600}>
                    Success Rate:{" "}
                    {(pattern.averageSuccessRate * 100).toFixed(1)}%
                  </Text>
                  <Text size="sm">
                    Occurrences: {pattern.totalOccurrences.toFixed(1)}
                  </Text>
                  <Divider my="xs" />
                  <Text fw={600}>Difficulty Distribution:</Text>
                  {Object.entries(pattern.difficultyDistribution)
                    .sort(
                      (a, b) =>
                        getDifficultySortPriority(a[0]) -
                        getDifficultySortPriority(b[0])
                    )
                    .map(([difficulty, count]) => (
                      <Text key={difficulty} size="sm">
                        {formatDifficultyLabel(difficulty)}: {count.toFixed(1)}
                      </Text>
                    ))}
                </div>
              }
              position="top"
              withArrow
            >
              <Group gap="xs" wrap="nowrap" className={styles.patternName}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {formatPatternName(pattern.patternName)}
                </Text>
                <IconInfoCircle
                  size="0.9rem"
                  stroke={1.5}
                  style={{ opacity: 0.5 }}
                />
              </Group>
            </Tooltip>
          </Group>

          <Group gap="md" wrap="nowrap">
            <RingProgress
              size={38}
              thickness={4}
              roundCaps
              sections={[
                {
                  value: pattern.averageSuccessRate * 100,
                  color: getEffectivenessColor(pattern.averageSuccessRate),
                },
              ]}
              label={
                <Text size="xs" ta="center" fw={700}>
                  {Math.round(pattern.averageSuccessRate * 100)}%
                </Text>
              }
            />
          </Group>
        </Group>
        <Progress
          value={pattern.averageSuccessRate * 100}
          color={getEffectivenessColor(pattern.averageSuccessRate)}
          size="sm"
          mt={4}
          animated
        />
      </div>
    );
  };

  // Render the pattern effectiveness visualization with tabs
  const renderPatternEffectivenessVisualization = () => {
    if (patternEffectivenessData.length === 0) {
      return (
        <Paper p="md" radius="md" withBorder>
          <Text ta="center" py="md">
            No pattern effectiveness data available.
          </Text>
        </Paper>
      );
    }

    // Filter patterns based on search query
    const filteredPatterns = patternSearchQuery
      ? patternEffectivenessData.filter((pattern) =>
          formatPatternName(pattern.patternName)
            .toLowerCase()
            .includes(patternSearchQuery.toLowerCase())
        )
      : patternEffectivenessData;

    // Get top 15 patterns by occurrence count
    const mostCommonPatterns = [...filteredPatterns]
      .sort((a, b) => b.totalOccurrences - a.totalOccurrences)
      .slice(0, 15);

    // Get top 15 patterns by success rate (with minimum occurrence threshold)
    const highestSuccessPatterns = [...filteredPatterns]
      .filter((pattern) => pattern.totalOccurrences >= 2) // Minimum threshold to filter out rare patterns
      .sort((a, b) => b.averageSuccessRate - a.averageSuccessRate)
      .slice(0, 15);

    return (
      <Paper p="md" radius="md" withBorder mb="lg">
        <Title order={4} mb="md">
          Pattern Effectiveness Analysis
        </Title>

        <Tabs
          value={activeTab}
          onChange={(value: string | null) => {
            if (value) {
              setActiveTab(value);
            }
          }}
          mb="md"
        >
          <Tabs.List>
            <Tabs.Tab
              value="most-common"
              leftSection={<IconChartBar size="0.9rem" />}
            >
              Most Common
            </Tabs.Tab>
            <Tabs.Tab
              value="highest-success"
              leftSection={<IconActivity size="0.9rem" />}
            >
              Highest Success
            </Tabs.Tab>
            <Tabs.Tab
              value="all-patterns"
              leftSection={<IconListDetails size="0.9rem" />}
            >
              All Patterns ({filteredPatterns.length})
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {(activeTab === "all-patterns" || patternSearchQuery) && (
          <TextInput
            placeholder="Search patterns..."
            leftSection={<IconSearch size="0.9rem" />}
            value={patternSearchQuery}
            onChange={(e) => setPatternSearchQuery(e.currentTarget.value)}
            mb="md"
          />
        )}

        <Text size="sm" mb="md" c="dimmed">
          {activeTab === "most-common" &&
            "Showing the most frequently used solution patterns across all problem types."}
          {activeTab === "highest-success" &&
            "Showing patterns with the highest success rates (minimum 2 occurrences)."}
          {activeTab === "all-patterns" &&
            `Showing all ${filteredPatterns.length} patterns${
              patternSearchQuery ? " matching your search" : ""
            }.`}
        </Text>

        <div className={styles.patternEffectivenessContainer}>
          {activeTab === "most-common" &&
            mostCommonPatterns.map(renderPatternRow)}

          {activeTab === "highest-success" &&
            highestSuccessPatterns.map(renderPatternRow)}

          {activeTab === "all-patterns" && (
            <ScrollArea h={500} offsetScrollbars scrollbarSize={8}>
              {filteredPatterns.length > 0 ? (
                filteredPatterns.map(renderPatternRow)
              ) : (
                <Text ta="center" py="md">
                  No patterns match your search.
                </Text>
              )}
            </ScrollArea>
          )}
        </div>
      </Paper>
    );
  };

  // Render a single model's pattern metrics table
  const renderModelTable = (model: ModelMeta) => {
    const modelData = patternMetrics[model.id];
    if (!modelData) {
      return (
        <Paper p="md" radius="md" withBorder mb="lg" key={model.id}>
          <Title order={4} mb="md">
            {model.name}
          </Title>
          <Text ta="center" py="md">
            No pattern metrics data available for {model.name}.
          </Text>
        </Paper>
      );
    }

    const filteredData = filterDataByCategory(modelData);

    // Group entries by difficulty
    const groupedByDifficulty: Record<
      string,
      { key: string; entry: PatternAnalysisEntry }[]
    > = {};

    Object.entries(filteredData).forEach(([key, entry]) => {
      const parts = key.split("-");
      const difficulty = parts[parts.length - 1].toLowerCase();

      if (!groupedByDifficulty[difficulty]) {
        groupedByDifficulty[difficulty] = [];
      }

      groupedByDifficulty[difficulty].push({ key, entry });
    });

    // Sort entries within each difficulty group by success rate (highest first)
    Object.keys(groupedByDifficulty).forEach((difficulty) => {
      groupedByDifficulty[difficulty].sort(
        (a, b) => b.entry.success_rate - a.entry.success_rate
      );
    });

    // Get sorted difficulties
    const sortedDifficulties = Object.keys(groupedByDifficulty).sort(
      (a, b) => getDifficultySortPriority(a) - getDifficultySortPriority(b)
    );

    if (sortedDifficulties.length === 0) {
      return (
        <Paper p="md" radius="md" withBorder mb="lg" key={model.id}>
          <Title order={4} mb="md">
            {model.name}
          </Title>
          <Text ta="center" py="md">
            No matching pattern metrics data for the selected category.
          </Text>
        </Paper>
      );
    }

    return (
      <Paper p="md" radius="md" withBorder mb="lg" key={model.id}>
        <Title order={4} mb="md">
          {model.name}
        </Title>
        <div className={styles.tableWrapper}>
          <Table
            striped
            withTableBorder
            highlightOnHover
            className={styles.patternMetricsTable}
          >
            <Table.Thead className={styles.tableHeader}>
              <Table.Tr>
                <Table.Th>Concept Group</Table.Th>
                <Table.Th>Success Rate</Table.Th>
                <Table.Th>Top Solution Patterns</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedDifficulties.map((difficulty) => {
                const entries = groupedByDifficulty[difficulty];
                const isExpanded =
                  expandedDifficulties[model.id]?.[difficulty.toLowerCase()] ||
                  false;

                return (
                  <React.Fragment key={`${model.id}-${difficulty}`}>
                    {/* Difficulty Header Row */}
                    <Table.Tr
                      className={styles.difficultyHeaderRow}
                      onClick={() => toggleDifficulty(model.id, difficulty)}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Td colSpan={3} className={styles.difficultyHeader}>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <IconChevronDown size="1rem" />
                            ) : (
                              <IconChevronRight size="1rem" />
                            )}
                          </ActionIcon>
                          <Badge
                            color={getDifficultyColor(difficulty)}
                            variant="filled"
                            size="md"
                          >
                            {formatDifficultyLabel(difficulty)} (
                            {entries.length})
                          </Badge>
                        </Group>
                      </Table.Td>
                    </Table.Tr>

                    {/* Data Rows (only when expanded) */}
                    {isExpanded &&
                      entries.map(({ key, entry }) => {
                        // Extract concepts from the key
                        const parts = key.split("-");
                        const conceptsArray = parts.slice(0, -1);
                        const formattedConcepts =
                          conceptsArray.map(formatConceptName);

                        // Process and get top patterns
                        const topPatterns = processPatterns(entry.patterns);

                        return (
                          <Table.Tr
                            key={`${model.id}-${key}`}
                            className={styles.dataRow}
                          >
                            <Table.Td className={styles.conceptCell}>
                              <div className={styles.conceptChips}>
                                {formattedConcepts.map((concept, i) => (
                                  <Badge
                                    key={i}
                                    className={styles.conceptBadge}
                                    size="sm"
                                    variant="light"
                                    color="blue"
                                  >
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </Table.Td>
                            <Table.Td>
                              <Text
                                fw={600}
                                size="md"
                                c={
                                  entry.success_rate > 0.8
                                    ? "green.6"
                                    : entry.success_rate < 0.5
                                    ? "red.6"
                                    : "orange.6"
                                }
                              >
                                {(entry.success_rate * 100).toFixed(1)}%
                              </Text>
                            </Table.Td>
                            <Table.Td className={styles.patternCell}>
                              {topPatterns.map(([pattern, count], i) => (
                                <Group key={i} align="center" gap="xs">
                                  <Badge size="sm" color={getPatternColor(i)}>
                                    {count.toFixed(1)}
                                  </Badge>
                                  <Text size="sm">
                                    {formatPatternName(pattern)}
                                  </Text>
                                </Group>
                              ))}
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <Paper p="md" radius="md" withBorder>
      <Group justify="center" py="md">
        <Loader />
      </Group>
    </Paper>
  );

  // Render error state
  const renderError = () => (
    <Paper p="md" radius="md" withBorder>
      <Text color="red" ta="center" py="md">
        Error loading data: {error}
      </Text>
    </Paper>
  );

  return (
    <div className={styles.patternAnalysisContainer}>
      <Paper p="md" radius="md" withBorder className={styles.filterContainer}>
        <div className={styles.filterControls}>
          <Title order={3}>Solution Pattern Analysis</Title>
          <Group gap="md">
            <Select
              className={styles.filterSelect}
              label="Filter by Concept Category"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || "all")}
              data={getCategories().map((category) => ({
                value: category,
                label: getCategoryDisplayName(category),
              }))}
              style={{ minWidth: 250 }}
            />
            <Button
              variant={showEffectivenessView ? "filled" : "light"}
              onClick={() => setShowEffectivenessView(!showEffectivenessView)}
              mt={25}
            >
              {showEffectivenessView
                ? "Show Tables"
                : "Show Pattern Effectiveness"}
            </Button>
          </Group>
        </div>
      </Paper>

      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : showEffectivenessView ? (
        renderPatternEffectivenessVisualization()
      ) : (
        <div className={styles.modelsContainer}>
          {models.map((model) => renderModelTable(model))}
        </div>
      )}
    </div>
  );
};

export default SolutionPatternTable;
