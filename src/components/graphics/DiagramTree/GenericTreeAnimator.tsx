import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box } from "@mantine/core";
import { useInView } from "react-intersection-observer";

import GenericNode from "./GenericNode";
import GenericEdge from "./GenericEdge";
import TextBox from "./TextBox";
import {
  TreeNode,
  TreeConfig,
  AnimationStep,
  createDefaultTreeConfig,
  getNodeById,
  getEdges,
} from "./data/GenericTreeTypes";

interface GenericTreeAnimatorProps {
  nodes: TreeNode[];
  animationSteps: AnimationStep[];
  currentStep: number;
  config?: TreeConfig;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  showLabels?: boolean;
  onStepComplete?: (step: number) => void;
}

const GenericTreeAnimator: React.FC<GenericTreeAnimatorProps> = ({
  nodes,
  animationSteps,
  currentStep,
  config = createDefaultTreeConfig(),
  autoPlay = false,
  autoPlayDelay = 2000,
  showLabels = true,
  onStepComplete,
}) => {
  // Track animation state
  const [visibleNodes, setVisibleNodes] = useState<Record<string, boolean>>({});
  const [highlightedNodes, setHighlightedNodes] = useState<
    Record<string, boolean>
  >({});
  const [visibleEdges, setVisibleEdges] = useState<Record<string, boolean>>({});
  const [textBoxes, setTextBoxes] = useState<
    Record<
      string,
      {
        visible: boolean;
        text: string;
        position: { x: number; y: number };
        width?: number;
        height?: number;
      }
    >
  >({});
  const [viewBox, setViewBox] = useState("0 0 300 240");

  // Auto-play timer reference
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection observer for visibility
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  // Apply animation step effect
  useEffect(() => {
    if (currentStep < 0 || animationSteps.length === 0) return;

    // Find all steps with the current step number
    const stepsWithStepKey = animationSteps.filter(
      (s) => typeof s.step === "number"
    );
    let stepsToRun: AnimationStep[] = [];
    if (stepsWithStepKey.length > 0) {
      // Use new step-based grouping
      stepsToRun = animationSteps.filter((s) => s.step === currentStep + 1); // step is 1-based
    } else {
      // Fallback: old behavior, one step at a time
      if (currentStep >= animationSteps.length) return;
      stepsToRun = [animationSteps[currentStep]];
    }

    // Batch state updates
    let nextVisibleNodes = { ...visibleNodes };
    let nextHighlightedNodes = { ...highlightedNodes };
    let nextVisibleEdges = { ...visibleEdges };
    let nextTextBoxes = { ...textBoxes };
    let nextViewBox = viewBox;

    stepsToRun.forEach((step) => {
      switch (step.type) {
        case "showNode":
          step.nodeIds.forEach((id) => {
            nextVisibleNodes[id] = true;
          });
          break;
        case "hideNode":
          step.nodeIds.forEach((id) => {
            nextVisibleNodes[id] = false;
          });
          break;
        case "highlightNode":
          step.nodeIds.forEach((id) => {
            nextHighlightedNodes[id] = true;
          });
          break;
        case "unhighlightNode":
          step.nodeIds.forEach((id) => {
            nextHighlightedNodes[id] = false;
          });
          break;
        case "showAllNodes":
          nodes.forEach((node) => {
            if (node.type && step.nodeTypes.includes(node.type)) {
              nextVisibleNodes[node.id] = true;
            }
          });
          break;
        case "hideAllNodes":
          nodes.forEach((node) => {
            if (node.type && step.nodeTypes.includes(node.type)) {
              nextVisibleNodes[node.id] = false;
            }
          });
          break;
        case "showEdge":
          nextVisibleEdges[`${step.sourceNodeId}-${step.targetNodeId}`] = true;
          break;
        case "hideEdge":
          nextVisibleEdges[`${step.sourceNodeId}-${step.targetNodeId}`] = false;
          break;
        case "showAllEdges": {
          const edges = getEdges(nodes);
          edges.forEach(({ source, target }) => {
            const targetNode = getNodeById(nodes, target);
            if (targetNode?.type && step.nodeTypes.includes(targetNode.type)) {
              nextVisibleEdges[`${source}-${target}`] = true;
            }
          });
          break;
        }
        case "hideAllEdges": {
          const edgesToHide = getEdges(nodes);
          edgesToHide.forEach(({ source, target }) => {
            const targetNode = getNodeById(nodes, target);
            if (targetNode?.type && step.nodeTypes.includes(targetNode.type)) {
              nextVisibleEdges[`${source}-${target}`] = false;
            }
          });
          break;
        }
        case "showTextBox":
          nextTextBoxes[step.id] = {
            visible: true,
            text: step.text || "",
            position: step.position || { x: 150, y: 120 },
            width: step.width,
            height: step.height,
          };
          break;
        case "hideTextBox":
          if (nextTextBoxes[step.id]) {
            nextTextBoxes[step.id] = {
              ...nextTextBoxes[step.id],
              visible: false,
            };
          }
          break;
        case "zoom":
          nextViewBox = step.viewBox;
          break;
        case "pause":
          // Pause is handled by the auto-play timer
          break;
      }
    });

    setVisibleNodes(nextVisibleNodes);
    setHighlightedNodes(nextHighlightedNodes);
    setVisibleEdges(nextVisibleEdges);
    setTextBoxes(nextTextBoxes);
    setViewBox(nextViewBox);

    // Auto-play to next step if enabled
    // Use the max duration of all steps in this group
    if (autoPlay && inView && stepsToRun.length > 0) {
      const maxDuration = Math.max(
        ...stepsToRun.map((s) => s.duration || autoPlayDelay)
      );
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      autoPlayTimerRef.current = setTimeout(() => {
        if (onStepComplete) {
          onStepComplete(currentStep);
        }
      }, maxDuration);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [
    currentStep,
    animationSteps,
    nodes,
    visibleNodes,
    highlightedNodes,
    visibleEdges,
    textBoxes,
    inView,
    autoPlay,
    autoPlayDelay,
    onStepComplete,
    viewBox,
  ]);

  // Get all edge data from nodes
  const edgeConnections = nodes
    .filter((node) => node.parentId)
    .map((node) => {
      const parentNode = getNodeById(nodes, node.parentId as string);
      if (!parentNode) return null;

      return {
        sourceNode: parentNode,
        targetNode: node,
        key: `${parentNode.id}-${node.id}`,
        index: nodes.findIndex((n) => n.id === node.id),
      };
    })
    .filter(Boolean) as {
    sourceNode: TreeNode;
    targetNode: TreeNode;
    key: string;
    index: number;
  }[];

  return (
    <Box
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#000000",
      }}
    >
      <motion.svg
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          background: "#000000",
          borderRadius: "8px",
        }}
        viewBox={viewBox}
        animate={{
          viewBox,
        }}
        transition={{ duration: 1 }}
      >
        {/* Render edges between nodes */}
        {edgeConnections.map(({ sourceNode, targetNode, key, index }) => (
          <GenericEdge
            key={key}
            sourceNode={sourceNode}
            targetNode={targetNode}
            visible={visibleEdges[key] || false}
            config={config}
            index={index}
          />
        ))}

        {/* Render all nodes */}
        {nodes.map((node, index) => (
          <GenericNode
            key={node.id}
            node={node}
            visible={visibleNodes[node.id] || false}
            highlighted={highlightedNodes[node.id] || false}
            showLabel={showLabels}
            config={config}
            index={index}
          />
        ))}

        {/* Render text boxes */}
        {Object.entries(textBoxes).map(([id, textBox]) => (
          <TextBox
            key={id}
            id={id}
            text={textBox.text}
            position={textBox.position}
            width={textBox.width}
            height={textBox.height}
            visible={textBox.visible}
            config={config}
          />
        ))}
      </motion.svg>
    </Box>
  );
};

export default GenericTreeAnimator;
