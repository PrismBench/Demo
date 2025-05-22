import { createDefaultTreeConfig } from "../../../../components/graphics/DiagramTree/data/GenericTreeTypes";

export const PHASE3_CONFIG = {
  ...createDefaultTreeConfig(),
  nodeSize: {
    default: 8,
    root: 12,
    child: 9,
    leaf: 7,
  },
  colors: {
    nodes: {
      default: "#ffffff",
      root: "#50C878", // Emerald green for root
      child: "#5c7cfa", // Blue for children
      leaf: "#d946ef", // Purple for leaves
      highlighted: "#ff5555", // Red for highlighted nodes
    },
    lines: {
      default: "#dddddd",
      root: "#dddddd",
      child: "#5c7cfa",
      leaf: "#d946ef",
    },
    labels: {
      default: "#ffffff",
      root: "#50C878",
      child: "#5c7cfa",
      leaf: "#d946ef",
    },
    textBoxes: {
      background: "rgba(0, 0, 0, 0.8)",
      text: "#ffffff",
      border: "#50C878",
    },
  },
  animation: {
    duration: 800,
    staggerDelay: 100,
  },
};
