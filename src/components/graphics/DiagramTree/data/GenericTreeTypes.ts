// Generic tree data structures for animated tree visualization

// Base node type for tree visualization
export interface TreeNode {
  id: string; // Unique identifier
  x: number; // X coordinate
  y: number; // Y coordinate
  parentId?: string; // Parent node ID (if any)
  label?: string; // Node label text
  type?: string; // Optional node type for custom styling
  data?: any; // Optional custom data
}

// Visual configuration options
export interface TreeConfig {
  nodeSize: {
    [key: string]: number; // Map of node types to sizes
    default: number; // Default size
  };
  colors: {
    nodes: {
      [key: string]: string; // Map of node types to colors
      default: string; // Default node color
    };
    lines: {
      [key: string]: string; // Map of line types to colors
      default: string; // Default line color
    };
    labels: {
      [key: string]: string; // Map of label types to colors
      default: string; // Default label color
    };
    textBoxes: {
      background: string; // Text box background color
      text: string; // Text box text color
      border: string; // Text box border color
    };
  };
  animation: {
    duration: number; // Base animation duration in ms
    staggerDelay: number; // Delay between staggered animations
  };
}

// Types of animation steps
export type AnimationStepType =
  | "showNode" // Show specific node(s)
  | "hideNode" // Hide specific node(s)
  | "showAllNodes" // Show all nodes of specific type(s)
  | "hideAllNodes" // Hide all nodes of specific type(s)
  | "showEdge" // Show specific edge(s)
  | "hideEdge" // Hide specific edge(s)
  | "showAllEdges" // Show all edges connecting to specific node type(s)
  | "hideAllEdges" // Hide all edges connecting to specific node type(s)
  | "showTextBox" // Show a text box
  | "hideTextBox" // Hide a text box
  | "zoom" // Change the zoom/viewBox
  | "highlightNode" // Highlight specific node(s)
  | "unhighlightNode" // Remove highlight from node(s)
  | "pause"; // Pause animation for a duration

// Base animation step interface
export interface BaseAnimationStep {
  type: AnimationStepType;
  duration?: number; // Optional custom duration for this step
  delay?: number; // Optional delay before this step
  step?: number; // Optional step number for grouping multiple actions per step
}

// Show/hide node animation step
export interface NodeAnimationStep extends BaseAnimationStep {
  type: "showNode" | "hideNode" | "highlightNode" | "unhighlightNode";
  nodeIds: string[]; // IDs of nodes to show/hide/highlight
}

// Show/hide all nodes of specific type
export interface NodeTypeAnimationStep extends BaseAnimationStep {
  type: "showAllNodes" | "hideAllNodes";
  nodeTypes: string[]; // Types of nodes to show/hide
}

// Show/hide edge animation step
export interface EdgeAnimationStep extends BaseAnimationStep {
  type: "showEdge" | "hideEdge";
  sourceNodeId: string; // Source node ID
  targetNodeId: string; // Target node ID
}

// Show/hide all edges of specific node type
export interface EdgeTypeAnimationStep extends BaseAnimationStep {
  type: "showAllEdges" | "hideAllEdges";
  nodeTypes: string[]; // Types of nodes whose edges to show/hide
}

// Text box animation step
export interface TextBoxAnimationStep extends BaseAnimationStep {
  type: "showTextBox" | "hideTextBox";
  id: string; // Unique ID for the text box
  text?: string; // Text content (for showing)
  position?: {
    // Position (for showing)
    x: number;
    y: number;
  };
  width?: number; // Width of text box
  height?: number; // Height of text box
}

// Zoom animation step
export interface ZoomAnimationStep extends BaseAnimationStep {
  type: "zoom";
  viewBox: string; // New SVG viewBox value
}

// Pause animation step
export interface PauseAnimationStep extends BaseAnimationStep {
  type: "pause";
  duration: number; // Duration to pause in ms
}

// Union type of all animation steps
export type AnimationStep =
  | NodeAnimationStep
  | NodeTypeAnimationStep
  | EdgeAnimationStep
  | EdgeTypeAnimationStep
  | TextBoxAnimationStep
  | ZoomAnimationStep
  | PauseAnimationStep;

// Convenience function to create a default tree configuration
export const createDefaultTreeConfig = (): TreeConfig => ({
  nodeSize: {
    default: 8,
    root: 10,
    child: 8,
    leaf: 6,
  },
  colors: {
    nodes: {
      default: "#ffffff",
      root: "#ffffff",
      child: "#5c7cfa",
      leaf: "#d946ef",
      highlighted: "#ff5555",
    },
    lines: {
      default: "#dddddd",
      root: "#dddddd",
      child: "#5c7cfa",
      leaf: "#d946ef",
    },
    labels: {
      default: "#ffffff",
      root: "#ffffff",
      child: "#5c7cfa",
      leaf: "#d946ef",
    },
    textBoxes: {
      background: "rgba(0, 0, 0, 0.7)",
      text: "#ffffff",
      border: "#5c7cfa",
    },
  },
  animation: {
    duration: 800,
    staggerDelay: 100,
  },
});

// Helper functions
export const getNodeById = (
  nodes: TreeNode[],
  id: string
): TreeNode | undefined => nodes.find((node) => node.id === id);

export const getChildNodes = (
  nodes: TreeNode[],
  parentId: string
): TreeNode[] => nodes.filter((node) => node.parentId === parentId);

export const getNodesByType = (nodes: TreeNode[], type: string): TreeNode[] =>
  nodes.filter((node) => node.type === type);

export const getEdges = (
  nodes: TreeNode[]
): { source: string; target: string }[] => {
  return nodes
    .filter((node) => node.parentId !== undefined)
    .map((node) => ({
      source: node.parentId as string,
      target: node.id,
    }));
};
