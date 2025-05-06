import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Box,
  Stack,
  Group,
  Button,
  Collapse,
  Divider,
  Timeline,
  Grid,
} from "@mantine/core";
import styles from "./PhaseCard.module.css";

/**
 * PhaseCard.tsx
 *
 * A flexible, expandable card component for displaying phases with interactive timeline.
 *
 * ## Usage
 * Use `PhaseCard` to present phases with a title, description, and expandable timeline.
 * When collapsed, it shows a compact view with just title and description.
 * When expanded, it shows an interactive timeline with phase details and custom content.
 *
 * @component
 * @example
 * <PhaseCard
 *   title="Benchmarking Phases"
 *   description="Explore the different phases of the benchmarking process."
 *   expandButtonText="Explore Phases"
 *   collapseButtonText="Hide Phases"
 *   phases={...}
 *   renderPhaseContent={(phase) => <SomeComponent phase={phase} />}
 * />
 */

export interface Phase {
  title: string;
  description: string;
  [key: string]: any;
}

interface PhaseCardProps {
  title?: string;
  description?: string;
  expandButtonText?: string;
  collapseButtonText?: string;
  phases: Phase[];
  renderPhaseContent?: (
    phase: Phase,
    phaseIndex: number,
    currentAnimationStep?: number
  ) => React.ReactNode;
  initialActivePhase?: number;
  onToggleExpand?: (isExpanded: boolean) => void;
  isExpanded?: boolean;
  animationSteps?: any[];
  stepDescriptions?: string[];
}

/**
 * Props for the PhaseCard component.
 *
 * @property {string} [title] - The main title displayed on the card.
 * @property {string} [description] - The main description text.
 * @property {string} [expandButtonText] - Text for the expand button.
 * @property {string} [collapseButtonText] - Text for the collapse button.
 * @property {Phase[]} phases - Array of phase objects, each with title and description.
 * @property {function} [renderPhaseContent] - Function to render content for the active phase.
 * @property {number} [initialActivePhase] - Index of the initially active phase.
 * @property {function} [onToggleExpand] - Callback when card is expanded/collapsed.
 * @property {boolean} [isExpanded] - Controls the expanded state externally.
 * @property {any[]} [animationSteps] - Array of animation steps for the current phase.
 * @property {string[]} [stepDescriptions] - Array of descriptions for each animation step.
 */

export const PhaseCard: React.FC<PhaseCardProps> = ({
  title,
  description,
  expandButtonText = "Show Phases",
  collapseButtonText = "Hide Phases",
  phases,
  renderPhaseContent,
  initialActivePhase = 0,
  onToggleExpand,
  isExpanded = false,
  animationSteps = [],
  stepDescriptions = [],
}) => {
  // State to track the currently active phase in the timeline
  const [activePhase, setActivePhase] = useState(initialActivePhase);
  // State for the current animation step (per phase)
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);

  // Reset animation step when phase changes
  useEffect(() => {
    setCurrentAnimationStep(0);
  }, [activePhase]);

  // Handle expand/collapse toggle
  const handleExpandToggle = () => {
    if (onToggleExpand) onToggleExpand(!isExpanded);
  };

  // Timeline steps logic
  const uniqueSteps = Array.from(new Set(animationSteps.map((s) => s.step)))
    .filter((s) => typeof s === "number")
    .sort((a, b) => (a as number) - (b as number));

  return (
    <Card
      shadow="sm"
      padding="lg"
      className={`prism-invert-card ${styles.card} ${
        isExpanded ? styles.expanded : ""
      }`}
    >
      {/* Header */}
      <Group align="center" gap="xl" wrap="nowrap" className={styles.container}>
        <Box className={styles.textContainer}>
          {title && <Text className={styles.title}>{title}</Text>}
          <Text className={styles.description}>{description}</Text>
        </Box>
      </Group>

      {/* Expandable timeline section */}
      <Collapse
        in={isExpanded}
        transitionDuration={300}
        transitionTimingFunction="ease"
      >
        <Divider my="lg" />
        <Box className={styles.expandedContent}>
          <Grid gutter="xl">
            {/* Timeline Column */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack justify="space-between" style={{ height: "100%" }}>
                {animationSteps.length > 0 && (
                  <>
                    <Timeline
                      active={currentAnimationStep}
                      bulletSize={24}
                      lineWidth={2}
                      style={{ marginBottom: 16 }}
                    >
                      {uniqueSteps.map((stepNum, idx) => (
                        <Timeline.Item
                          key={stepNum}
                          title={`Step ${idx + 1}`}
                          onClick={() => setCurrentAnimationStep(idx)}
                          style={{ cursor: "pointer", color: "white" }}
                        >
                          {idx <= currentAnimationStep
                            ? stepDescriptions[idx] ||
                              `Description for Step ${idx + 1}`
                            : ""}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                    <Group justify="center" mt="lg">
                      <Button
                        onClick={() =>
                          setCurrentAnimationStep((s) => Math.max(0, s - 1))
                        }
                        disabled={currentAnimationStep === 0}
                        className="prism-button"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() =>
                          setCurrentAnimationStep((s) =>
                            Math.min(uniqueSteps.length - 1, s + 1)
                          )
                        }
                        disabled={
                          currentAnimationStep === uniqueSteps.length - 1
                        }
                        className="prism-button"
                      >
                        Next
                      </Button>
                    </Group>
                  </>
                )}
              </Stack>
            </Grid.Col>
            {/* Content Column */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Box className={styles.phaseContent}>
                {renderPhaseContent &&
                  renderPhaseContent(
                    phases[activePhase],
                    activePhase,
                    animationSteps.length > 0 ? currentAnimationStep : undefined
                  )}
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Collapse>

      <Box className={styles.buttonContainer}>
        <Button className="prism-button" onClick={handleExpandToggle}>
          {isExpanded ? collapseButtonText : expandButtonText}
        </Button>
      </Box>
    </Card>
  );
};

export default PhaseCard;
