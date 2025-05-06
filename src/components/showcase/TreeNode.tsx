/**
 * TreeNode component
 *
 * Renders a single node in the tree visualization, displaying its concepts, difficulty, score, visits, and phase.
 * Integrates with React Flow for interactive graph visualization, supporting incoming and outgoing connections.
 *
 * Usage:
 * ```tsx
 * <TreeNode data={nodeData} selected={isSelected} />
 * ```
 *
 * - The node's appearance changes based on its phase and selection state.
 * - Concepts and difficulty are shown as badges; score and visits are displayed as text.
 * - Handles (top and bottom) allow for graph connections.
 *
 * @module TreeNode
 */
import { Card, Text, Group, Badge, Stack, Paper } from "@mantine/core";
import { Position, Handle } from "reactflow";

import { NodeData } from "@/types/tree.ts";
import { Phase, PhaseColors } from "./types";

const phaseColors: PhaseColors = {
  1: { bg: "#FFFACD", border: "#00008B" }, // lightyellow, darkblue
  2: { bg: "#90EE90", border: "#006400" }, // lightgreen, darkgreen
  3: { bg: "#ADD8E6", border: "#00008B" }, // lightblue, darkblue
};

/**
 * Props for the TreeNode component.
 *
 * @property {NodeData} data - The data object representing the node's properties and state.
 * @property {boolean} selected - Whether the node is currently selected in the UI.
 */

export const TreeNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected: boolean;
}) => {
  // Get the phase color safely with fallback
  const getPhaseColor = (phase: number): { bg: string; border: string } => {
    return phaseColors[phase as Phase] || { bg: "#FFFFFF", border: "#000000" };
  };

  const nodePhaseColor = getPhaseColor(data.phase);

  /**
   * Returns the background and border color for a given phase.
   *
   * @param {number} phase - The phase number (1, 2, or 3).
   * @returns {{ bg: string; border: string }} The color configuration for the phase.
   */

  return (
    <div style={{ position: "relative" }}>
      {/* Target handle (for incoming connections) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", width: 10, height: 10 }}
      />

      <Card
        padding="md"
        radius="md"
        withBorder
        style={{
          backgroundColor: nodePhaseColor.bg,
          borderColor: selected ? "#FF5500" : nodePhaseColor.border,
          borderWidth: selected ? 3 : 2,
          width: 280,
          minHeight: 200,
          fontSize: "0.9rem",
          boxShadow: selected ? "0 0 10px rgba(255, 85, 0, 0.5)" : "none",
        }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Group>
            <Group gap="xs">
              {/* Render a badge for each concept associated with the node */}
              {[...data.concepts].sort().map((concept: string, idx: number) => (
                <Badge key={idx} variant="light" size="m">
                  {concept}
                </Badge>
              ))}
            </Group>
            <Badge
              color={
                data.difficulty === "very easy"
                  ? "blue"
                  : data.difficulty === "easy"
                  ? "green"
                  : data.difficulty === "medium"
                  ? "yellow"
                  : data.difficulty === "hard"
                  ? "orange"
                  : "red"
              }
            >
              {data.difficulty}
            </Badge>
          </Group>
        </Card.Section>

        <Stack mt="sm" gap="xs">
          <Group>
            <Text fw={500}>Score:</Text>
            <Text>{data.value.toFixed(2)}</Text>
          </Group>

          <Group>
            <Text fw={500}>Visits:</Text>
            <Text>{data.visits}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={700}>Phase {data.phase}</Text>
          </Group>
          {/* <Text fw={500}>Challenge:</Text>
          <Paper p="xs" withBorder>
            <Text size="sm">{data.challenge_description}</Text>
          </Paper> */}
        </Stack>
      </Card>

      {/* Source handle (for outgoing connections) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555", width: 10, height: 10 }}
      />
    </div>
  );
};

/**
 * TreeNode React component
 *
 * @param {{ data: NodeData; selected: boolean }} props - The props for the component.
 * @returns {JSX.Element} The rendered tree node.
 */
