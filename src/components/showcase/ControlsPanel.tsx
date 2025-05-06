import React from "react";
import { Button, ActionIcon, Tooltip } from "@mantine/core";
import { Panel } from "reactflow";
import { NodeData } from "../../types/tree"; // Adjust path as needed

interface ControlsPanelProps {
  selectedNodeData: NodeData | null | undefined;
  onReset: () => void;
  onCenter: (id: string) => void;
  onToggleLegend: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  selectedNodeData,
  onReset,
  onCenter,
  onToggleLegend,
}) => {
  return (
    <Panel position="top-right">
      <Tooltip label="Show legend">
        <ActionIcon
          onClick={onToggleLegend}
          color="blue"
          size="lg"
          variant="filled"
          mr="xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </ActionIcon>
      </Tooltip>
      <Button onClick={onReset} size="sm" mr="xs">
        Reset View
      </Button>
      {selectedNodeData && (
        <Button
          onClick={() => onCenter(selectedNodeData.id)}
          size="sm"
          color="blue"
        >
          Focus Selected
        </Button>
      )}
    </Panel>
  );
};
