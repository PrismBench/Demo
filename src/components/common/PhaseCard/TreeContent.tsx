import React from "react";
import { Box } from "@mantine/core";
import GenericTreeAnimator from "../../graphics/DiagramTree/GenericTreeAnimator";
import {
  TreeNode,
  AnimationStep,
  TreeConfig,
} from "../../graphics/DiagramTree/data/GenericTreeTypes";

interface TreeContentProps {
  treeNodes: TreeNode[];
  animationSteps: AnimationStep[];
  config?: TreeConfig;
  currentStep: number; // Now controlled by parent
}

const TreeContent: React.FC<TreeContentProps> = ({
  treeNodes,
  animationSteps,
  config,
  currentStep,
}) => {
  return (
    <Box style={{ width: "100%", height: "300px", position: "relative" }}>
      <GenericTreeAnimator
        nodes={treeNodes}
        animationSteps={animationSteps}
        currentStep={currentStep}
        config={config}
        showLabels={true}
      />
    </Box>
  );
};

export default TreeContent;
