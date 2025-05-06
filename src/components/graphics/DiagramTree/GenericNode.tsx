import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode, TreeConfig } from "./data/GenericTreeTypes";

interface GenericNodeProps {
  node: TreeNode;
  visible: boolean;
  highlighted: boolean;
  showLabel: boolean;
  config: TreeConfig;
  index: number;
  onAnimationComplete?: () => void;
}

const GenericNode: React.FC<GenericNodeProps> = ({
  node,
  visible,
  highlighted,
  showLabel,
  config,
  index,
  onAnimationComplete,
}) => {
  // Get appropriate size based on the node's type
  const getSize = () => {
    if (node.type && config.nodeSize[node.type]) {
      return config.nodeSize[node.type];
    }
    return config.nodeSize.default;
  };

  // Get appropriate color based on the node's type
  const getColor = () => {
    if (highlighted) {
      return config.colors.nodes.highlighted;
    }

    if (node.type && config.colors.nodes[node.type]) {
      return config.colors.nodes[node.type];
    }

    return config.colors.nodes.default;
  };

  // Get label color
  const getLabelColor = () => {
    if (highlighted) {
      return config.colors.nodes.highlighted;
    }

    if (node.type && config.colors.labels[node.type]) {
      return config.colors.labels[node.type];
    }

    return config.colors.labels.default;
  };

  // Size and position
  const size = getSize();
  const labelYOffset = size + 10;
  const labelFontSize =
    node.type === "root" ? 9 : node.type === "child" ? 8 : 7;

  // Animation variants
  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        scale: {
          delay: 0.1 + (i * config.animation.staggerDelay) / 1000,
          duration: config.animation.duration / 1000,
          type: "spring",
          stiffness: 200,
        },
        opacity: {
          delay: 0.1 + (i * config.animation.staggerDelay) / 1000,
          duration: 0.3,
        },
      },
    }),
    highlighted: {
      scale: 1.2,
      filter: "drop-shadow(0 0 4px rgba(255, 85, 85, 0.8))",
      transition: {
        duration: 0.4,
        yoyo: Infinity,
        repeatDelay: 0.5,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const labelVariants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + (i * config.animation.staggerDelay) / 1000,
        duration: 0.3,
      },
    }),
    exit: {
      opacity: 0,
      y: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={size}
            fill={getColor()}
            stroke={highlighted ? "rgba(255, 85, 85, 0.8)" : "none"}
            strokeWidth={highlighted ? 2 : 0}
            initial="hidden"
            animate={highlighted ? "highlighted" : "visible"}
            exit="exit"
            variants={circleVariants}
            custom={index}
            onAnimationComplete={
              visible && !highlighted ? onAnimationComplete : undefined
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && showLabel && node.label && (
          <motion.text
            x={node.x}
            y={node.y + labelYOffset}
            textAnchor="middle"
            fill={getLabelColor()}
            fontSize={labelFontSize}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={labelVariants}
            custom={index}
          >
            {node.label}
          </motion.text>
        )}
      </AnimatePresence>
    </>
  );
};

export default GenericNode;
