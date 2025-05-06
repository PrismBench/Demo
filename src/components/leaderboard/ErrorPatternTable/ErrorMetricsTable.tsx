import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import {
  ModelMeta,
  ErrorMetricsData,
  ErrorAnalysisEntry,
} from "../../../types";
import { fetchModelErrorMetrics } from "../../../api/leaderboardService";
import styles from "./ErrorMetricsTable.module.css";

interface ErrorMetricsTableProps {
  models: ModelMeta[];
}

// Interface for error distribution
interface ErrorDistribution {
  logic_errors: number;
  implementation_errors: number;
  edge_case_errors: number;
  test_setup_errors: number;
  [key: string]: number;
}

const ErrorMetricsTable: React.FC<ErrorMetricsTableProps> = ({ models }) => {
  const [errorMetrics, setErrorMetrics] = useState<
    Record<string, ErrorMetricsData>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedDifficulties, setExpandedDifficulties] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Fetch error metrics data for all selected models
  useEffect(() => {
    const fetchErrorMetricsData = async () => {
      if (models.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const metricsPromises = models.map((model) =>
          fetchModelErrorMetrics(model.id)
            .then((data) => ({ modelId: model.id, data }))
            .catch((err) => {
              console.error(
                `Error fetching error metrics for ${model.id}:`,
                err
              );
              return { modelId: model.id, error: err.message };
            })
        );

        const results = await Promise.all(metricsPromises);

        const metricsData: Record<string, ErrorMetricsData> = {};
        results.forEach((result) => {
          if ("data" in result) {
            metricsData[result.modelId] = result.data;
          }
        });

        setErrorMetrics(metricsData);

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
        console.error("Failed to fetch error metrics data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorMetricsData();
  }, [models]);

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

    Object.values(errorMetrics).forEach((modelData) => {
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
    modelData: ErrorMetricsData
  ): ErrorMetricsData => {
    if (selectedCategory === "all") return modelData;

    return Object.entries(modelData).reduce((filtered, [key, value]) => {
      if (key.startsWith(selectedCategory)) {
        filtered[key] = value;
      }
      return filtered;
    }, {} as ErrorMetricsData);
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

  // Render error distribution with progress bars
  const renderErrorDistribution = (distribution: ErrorDistribution) => {
    const categories = [
      { key: "logic_errors", label: "Logic", color: "blue" },
      { key: "edge_case_errors", label: "Edge Cases", color: "orange" },
      { key: "test_setup_errors", label: "Test Setup", color: "teal" },
    ];

    // Calculate total for percentage (excluding implementation_errors)
    const total = Object.entries(distribution)
      .filter(([key]) => key !== "implementation_errors")
      .reduce((sum, [_, value]) => sum + value, 0);

    return (
      <Stack gap="xs" className={styles.distributionContainer}>
        {categories.map(({ key, label, color }) => {
          const value = distribution[key];
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

          return (
            <Box key={key} className={styles.distributionItem}>
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Text size="xs" fw={500} w={100}>
                  {label}:
                </Text>
                <Text size="xs" c="dimmed" w={40} ta="right">
                  {percentage}%
                </Text>
              </Group>
              <Progress value={percentage} color={color} size="sm" />
            </Box>
          );
        })}
      </Stack>
    );
  };

  // Normalize error pattern name (remove fix_ prefix)
  const normalizeErrorPattern = (pattern: string): string => {
    return pattern.startsWith("fix_") ? pattern.substring(4) : pattern;
  };

  // Process error patterns to combine similar ones (with/without fix_ prefix)
  const processErrorPatterns = (
    patterns: Record<string, number>
  ): [string, number][] => {
    // Group patterns by normalized name and sum counts
    const normalizedPatterns: Record<string, number> = {};

    Object.entries(patterns).forEach(([pattern, count]) => {
      const normalizedName = normalizeErrorPattern(pattern);
      normalizedPatterns[normalizedName] =
        (normalizedPatterns[normalizedName] || 0) + count;
    });

    // Convert to array and sort by count (descending)
    return Object.entries(normalizedPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Get top 3
  };

  // Format error pattern names to be more readable
  const formatErrorPattern = (pattern: string): string => {
    // Replace underscores with spaces and capitalize first letter
    return pattern
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  // Get color for error pattern based on ranking
  const getErrorPatternColor = (index: number): string => {
    const colors = ["red", "orange", "yellow"];
    return colors[index] || "gray";
  };

  // Render a single model's error metrics table
  const renderModelTable = (model: ModelMeta) => {
    const modelData = errorMetrics[model.id];
    if (!modelData) {
      return (
        <Paper p="md" radius="md" withBorder mb="lg" key={model.id}>
          <Title order={4} mb="md">
            {model.name}
          </Title>
          <Text ta="center" py="md">
            No error metrics data available for {model.name}.
          </Text>
        </Paper>
      );
    }

    const filteredData = filterDataByCategory(modelData);

    // Group entries by difficulty
    const groupedByDifficulty: Record<
      string,
      { key: string; entry: ErrorAnalysisEntry }[]
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
            No matching error metrics data for the selected category.
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
            className={styles.errorMetricsTable}
          >
            <Table.Thead className={styles.tableHeader}>
              <Table.Tr>
                <Table.Th>Concept Group</Table.Th>
                <Table.Th>Success Rate</Table.Th>
                <Table.Th>Top Error Patterns</Table.Th>
                <Table.Th>Error Distribution</Table.Th>
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
                      <Table.Td colSpan={4} className={styles.difficultyHeader}>
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

                        // Process and get top error patterns
                        const topErrorPatterns = processErrorPatterns(
                          entry.error_patterns
                        );

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
                            <Table.Td className={styles.errorPatternCell}>
                              {topErrorPatterns.map(([pattern, count], i) => (
                                <Group key={i} align="center" gap="xs">
                                  <Badge
                                    size="sm"
                                    color={getErrorPatternColor(i)}
                                  >
                                    {count.toFixed(1)}
                                  </Badge>
                                  <Text size="sm">
                                    {formatErrorPattern(pattern)}
                                  </Text>
                                </Group>
                              ))}
                            </Table.Td>
                            <Table.Td className={styles.errorDistributionCell}>
                              {renderErrorDistribution(
                                entry.error_distribution as ErrorDistribution
                              )}
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
    <div className={styles.errorAnalysisContainer}>
      <Paper p="md" radius="md" withBorder className={styles.filterContainer}>
        <div className={styles.filterControls}>
          <Title order={3}>Error Metrics Analysis</Title>
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
        </div>
      </Paper>

      {isLoading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <div className={styles.modelsContainer}>
          {models.map((model) => renderModelTable(model))}
        </div>
      )}
    </div>
  );
};

export default ErrorMetricsTable;
