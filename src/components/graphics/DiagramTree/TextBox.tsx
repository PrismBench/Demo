import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeConfig } from "./data/GenericTreeTypes";

interface TextBoxProps {
  id: string;
  text: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  visible: boolean;
  config: TreeConfig;
  onAnimationComplete?: () => void;
}

const TextBox: React.FC<TextBoxProps> = ({
  id,
  text,
  position,
  width = 100,
  height = 40,
  visible,
  config,
  onAnimationComplete,
}) => {
  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Box corners
  const x = position.x - width / 2;
  const y = position.y - height / 2;

  // Adjust text position for proper centering
  const textX = position.x;
  const textY = position.y;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.g
          key={`textbox-${id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onAnimationComplete={visible ? onAnimationComplete : undefined}
        >
          {/* Box */}
          <motion.rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={4}
            ry={4}
            fill={config.colors.textBoxes.background}
            stroke={config.colors.textBoxes.border}
            strokeWidth={1}
          />

          {/* Text */}
          <motion.text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={config.colors.textBoxes.text}
            fontSize="8"
            fontWeight="500"
          >
            {text.split("\n").map((line, i) => (
              <tspan key={i} x={textX} dy={i === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </motion.text>
        </motion.g>
      )}
    </AnimatePresence>
  );
};

export default TextBox;
