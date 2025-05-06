/**
 * LegendDrawer.tsx
 *
 * This component renders a side drawer displaying the legend for the tree visualization UI.
 * It explains the meaning of node phases, connection types, difficulty levels, and data trail statuses
 * using color-coded boxes and badges. This helps users interpret the visual cues in the tree.
 *
 * Usage:
 *   <LegendDrawer opened={opened} onClose={onClose} />
 *
 * Context:
 *   Used in the tree visualization view to provide users with a reference for the color and symbol meanings.
 *   Typically toggled by a button in the UI (see ControlsPanel).
 *
 * Extensibility:
 *   - To add more legend items, extend the JSX in the Drawer body.
 *   - To update color schemes, modify the phaseColors or edgeColors objects.
 *   - If phase or edge colors are shared, consider moving them to a shared types/constants file.
 */
import React from "react";
import { Drawer, Stack, Title, Text, Group, Box, Badge } from "@mantine/core";
import { PhaseColors } from "./types";

// Define phase colors (could also be imported if shared elsewhere)
const phaseColors: PhaseColors = {
  1: { bg: "#FFFACD", border: "#00008B" }, // lightyellow, darkblue
  2: { bg: "#90EE90", border: "#006400" }, // lightgreen, darkgreen
  3: { bg: "#ADD8E6", border: "#00008B" }, // lightblue, darkblue
};

// Define edge colors (could also be imported if shared elsewhere)
const edgeColors = {
  improved: "#008000", // green
  same: "#808080", // gray
  decreased: "#FF0000", // red
};

/**
 * Props for the LegendDrawer component.
 *
 * @property {boolean} opened - Whether the drawer is open.
 * @property {() => void} onClose - Callback to close the drawer.
 */
interface LegendDrawerProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * LegendDrawer component
 *
 * Renders a left-side drawer with a legend explaining the color and symbol meanings
 * used in the tree visualization. Includes node phases, connection types, difficulty levels,
 * and data trail statuses.
 *
 * @param {LegendDrawerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered legend drawer.
 */
export const LegendDrawer: React.FC<LegendDrawerProps> = ({
  opened,
  onClose,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Tree Visualization Legend"
      position="left"
      size="sm"
      padding="md"
    >
      <Stack>
        <Title order={4} mb="md">
          Legend
        </Title>

        {/* Node Phases Section: shows color and border for each phase */}
        <Text fw={700} size="sm" mt="md">
          Node Phases
        </Text>
        <Group>
          {Object.entries(phaseColors).map(([phase, colors]) => (
            <Group key={phase} gap="xs">
              <Box
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderRadius: "4px",
                }}
              />
              <Text size="sm">Phase {phase}</Text>
            </Group>
          ))}
        </Group>

        {/* Connection Types Section: shows line color for each connection type */}
        <Text fw={700} size="sm" mt="md">
          Connection Types
        </Text>
        <Group>
          {Object.entries(edgeColors).map(([performance, color]) => (
            <Group key={performance} gap="xs">
              <Box
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: color,
                }}
              />
              <Text size="sm">
                {performance.charAt(0).toUpperCase() + performance.slice(1)}
              </Text>
            </Group>
          ))}
        </Group>

        {/* Difficulty Levels Section: shows badge color for each difficulty */}
        <Text fw={700} size="sm" mt="md">
          Difficulty Levels
        </Text>
        <Group>
          {["very easy", "easy", "medium", "hard", "very hard"].map((diff) => (
            <Badge
              key={diff}
              color={
                diff === "very easy"
                  ? "blue"
                  : diff === "easy"
                  ? "green"
                  : diff === "medium"
                  ? "yellow"
                  : diff === "hard"
                  ? "orange"
                  : "red"
              }
            >
              {diff}
            </Badge>
          ))}
        </Group>

        {/* Data Trail Status Section: shows badge color for each status */}
        <Text fw={700} size="sm" mt="md">
          Data Trail Status
        </Text>
        <Group>
          <Badge color="green">Success</Badge>
          <Badge color="yellow">Fixed</Badge>
          <Badge color="red">Failed</Badge>
        </Group>
      </Stack>
    </Drawer>
  );
};
