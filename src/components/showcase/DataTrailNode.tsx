/**
 * DataTrailNode.tsx
 *
 * This component renders a single node in a data trail visualization, typically used in tree or graph-based UIs to show the result of an attempt or step in a process (e.g., coding challenge attempts).
 *
 * Each node displays the attempt number, status (success, fixed, or failed), test results, and any error feedback. The node color and border indicate the result status for quick visual scanning.
 *
 * Usage:
 *   <DataTrailNode data={...} />
 *
 * Context:
 *   Used within a React Flow graph to represent attempts in a data trail. Integrates with Mantine UI and React Flow for styling and connection handles.
 *
 * Extensibility:
 *   - To add more details to each node, extend the NodeDataTrailData interface and update the rendering logic.
 *   - To change the color scheme, modify getStatusColor and the Card style.
 */

import { NodeDataTrailData } from "@/types/tree.ts";
import { Card, Text, Group, Badge, Stack } from "@mantine/core";
import { Position, Handle } from "reactflow";

/**
 * Props for DataTrailNode component.
 * @property {NodeDataTrailData & { index: number }} data - Data for this node, including attempt details and its index in the trail.
 *   @property {string | null} problem_statement - The problem statement for this attempt.
 *   @property {string | null} test_cases - The test cases used.
 *   @property {string | null} solution_code - The code submitted for this attempt.
 *   @property {boolean} success - Whether the attempt was successful.
 *   @property {string | null} output - Output from the attempt.
 *   @property {number | null} tests_passed_num - Number of tests passed.
 *   @property {number | null} tests_failed_num - Number of tests failed.
 *   @property {number | null} tests_errored_num - Number of tests errored.
 *   @property {boolean | null} fixed_by_problem_fixer - Whether the attempt was fixed by an automated fixer.
 *   @property {number | null} attempt_num - The attempt number (if available).
 *   @property {string | null} error_feedback - Error feedback, if any.
 *   @property {number} index - Index of this node in the data trail.
 */

/**
 * DataTrailNode React component.
 *
 * @param {Object} props - Component props.
 * @param {NodeDataTrailData & { index: number }} props.data - Data for this node.
 * @returns {JSX.Element} Rendered node for the data trail visualization.
 */

export const DataTrailNode = ({
  data,
}: {
  data: NodeDataTrailData & { index: number };
}) => {
  /**
   * Returns a background color based on the node's status.
   * @returns {string} Hex color code for background.
   */
  const getStatusColor = () => {
    if (data.success) return "#90EE90"; // lightgreen
    if (data.fixed_by_problem_fixer) return "#FFFACD"; // lightyellow
    return "#FFCCCB"; // lightred
  };

  const bgColor = getStatusColor();

  return (
    <div style={{ position: "relative" }}>
      {/* Target handle for connection from parent node */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555", width: 10, height: 10 }}
      />

      <Card
        padding="sm"
        radius="md"
        withBorder
        style={{
          backgroundColor: bgColor,
          borderColor: data.success ? "#006400" : "#8B0000",
          borderWidth: 2,
          width: 250,
          minHeight: 150,
          fontSize: "0.9rem",
        }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          {/* Attempt number header */}
          <Text fw={700}>Attempt #{data.attempt_num || data.index + 1}</Text>
        </Card.Section>

        <Stack mt="sm" gap="xs">
          {/* Status row */}
          <Group>
            <Text fw={500}>Status:</Text>
            <Badge
              color={
                data.success
                  ? "green"
                  : data.fixed_by_problem_fixer
                  ? "yellow"
                  : "red"
              }
            >
              {data.success
                ? "Success"
                : data.fixed_by_problem_fixer
                ? "Fixed"
                : "Failed"}
            </Badge>
          </Group>

          {/* Tests row, only shown if test results are available */}
          {(data.tests_passed_num !== null ||
            data.tests_failed_num !== null) && (
            <Group>
              <Text fw={500}>Tests:</Text>
              <Badge color="green">{data.tests_passed_num || 0} passed</Badge>
              <Badge color="red">{data.tests_failed_num || 0} failed</Badge>
              {data.tests_errored_num !== null && (
                <Badge color="yellow">{data.tests_errored_num} errored</Badge>
              )}
            </Group>
          )}

          {/* Error feedback, only shown if present */}
          {data.error_feedback && (
            <Text size="xs" fw={500} c="red">
              Error: {data.error_feedback.substring(0, 100)}
              {data.error_feedback.length > 100 ? "..." : ""}
            </Text>
          )}
        </Stack>
      </Card>
    </div>
  );
};
