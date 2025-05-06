import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode, TreeConfig, getNodeById } from "./data/GenericTreeTypes";

interface GenericEdgeProps {
  sourceNode: TreeNode;
  targetNode: TreeNode;
  visible: boolean;
  config: TreeConfig;
  index: number;
  onAnimationComplete?: () => void;
}

const GenericEdge: React.FC<GenericEdgeProps> = ({
  sourceNode,
  targetNode,
  visible,
  config,
  index,
  onAnimationComplete,
}) => {
  // Get appropriate color based on the target node's type
  const getColor = () => {
    if (targetNode.type && config.colors.lines[targetNode.type]) {
      return config.colors.lines[targetNode.type];
    }
    return config.colors.lines.default;
  };

  // Get appropriate stroke width based on the target node's type
  const getStrokeWidth = () => {
    if (targetNode.type === "root") return 2;
    if (targetNode.type === "child") return 1.5;
    return 1;
  };

  // Create curved path between nodes
  const getPathData = () => {
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;

    // Control point calculation for the curved path
    const cpx1 = sourceNode.x + dx * 0.5;
    const cpy1 = sourceNode.y;
    const cpx2 = sourceNode.x + dx * 0.5;
    const cpy2 = targetNode.y;

    // Create a cubic Bezier curve
    return `M ${sourceNode.x} ${sourceNode.y} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${targetNode.x} ${targetNode.y}`;
  };

  // Animation variants
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: (i * config.animation.staggerDelay) / 1000,
          duration: (config.animation.duration / 1000) * 1.2,
          ease: "easeInOut",
        },
        opacity: {
          delay: (i * config.animation.staggerDelay) / 1000,
          duration: 0.2,
        },
      },
    }),
    exit: {
      pathLength: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Apply filter based on node type for visual appeal
  const getFilter = () => {
    if (targetNode.type === "leaf") {
      return "drop-shadow(0 0 2px rgba(217, 70, 239, 0.5))";
    } else if (targetNode.type === "child") {
      return "drop-shadow(0 0 1px rgba(92, 124, 250, 0.3))";
    }
    return "none";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.path
          d={getPathData()}
          stroke={getColor()}
          strokeWidth={getStrokeWidth()}
          fill="none"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pathVariants}
          custom={index}
          strokeLinecap="round"
          strokeDasharray={targetNode.type === "root" ? "1" : "1"}
          style={{
            filter: getFilter(),
          }}
          onAnimationComplete={visible ? onAnimationComplete : undefined}
        />
      )}
    </AnimatePresence>
  );
};

export default GenericEdge;
