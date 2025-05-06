import { useState, useRef, useEffect } from "react";
import { Container, Box, Timeline } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";

import {
  PhaseCard,
  Phase,
} from "../../../components/common/PhaseCard/PhaseCard";
import { phaseCards } from "../../../static/SolutionContents";
import TreeContent from "../../../components/common/PhaseCard/TreeContent";

export function SolutionSection() {
  // Create state for each card's active phase
  const [activePhases, setActivePhases] = useState([0, 0, 0, 0]);

  // Track which card is expanded (if any)
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerMinHeight, setContainerMinHeight] = useState<string>("500px"); // Initial height

  // Render functions for each card's content
  const renderPhaseContent =
    (cardIndex: number) =>
    (phase: Phase, index: number, currentAnimationStep?: number) => {
      const { treeNodes, animationSteps, config } =
        phaseCards[cardIndex].phases[index];
      return (
        <TreeContent
          treeNodes={treeNodes}
          animationSteps={animationSteps}
          config={config}
          currentStep={currentAnimationStep ?? 0}
        />
      );
    };

  // Handle card expansion/collapse and adjust container height
  const handleCardToggle = (cardIndex: number, isExpanded: boolean) => {
    const newIndex = isExpanded ? cardIndex : null;
    setExpandedCardIndex(newIndex);
  };

  useEffect(() => {
    if (expandedCardIndex !== null) {
      setContainerMinHeight("auto"); // Use viewport height for better adaptivity
    } else {
      setContainerMinHeight("auto"); // Let grid determine height when collapsed
    }
  }, [expandedCardIndex]);

  return (
    <Box id="solution" style={{ padding: "var(--mantine-spacing-xl) 0" }}>
      <Container size="xl">
        <SectionTitle
          title="How It Works"
          subtitle="Prism's powerful analysis framework in four key areas:"
        />

        <div
          ref={containerRef}
          style={{
            position: "relative",
            minHeight: containerMinHeight,
            transition: "min-height 0.3s ease", // Add transition for smooth height change
          }}
        >
          {expandedCardIndex !== null ? (
            // When a card is expanded, show only that card (no absolute positioning)
            <div style={{ width: "100%", height: "100%" }}>
              <PhaseCard
                title={phaseCards[expandedCardIndex].title}
                description={phaseCards[expandedCardIndex].description}
                expandButtonText={
                  phaseCards[expandedCardIndex].expandButtonText
                }
                collapseButtonText={
                  phaseCards[expandedCardIndex].collapseButtonText
                }
                phases={phaseCards[expandedCardIndex].phases}
                renderPhaseContent={renderPhaseContent(expandedCardIndex)}
                initialActivePhase={activePhases[expandedCardIndex]}
                isExpanded={true} // Pass true when this card is the expanded one
                onToggleExpand={() =>
                  handleCardToggle(expandedCardIndex, false)
                }
                animationSteps={
                  phaseCards[expandedCardIndex].phases[0].animationSteps
                }
                stepDescriptions={
                  phaseCards[expandedCardIndex].phases[0].stepDescriptions ??
                  phaseCards[expandedCardIndex].phases[0].animationSteps.map(
                    (_: any, idx: number) => `Description for Step ${idx + 1}`
                  )
                }
              />
            </div>
          ) : (
            // When no card is expanded, show all cards in a grid
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                width: "100%",
                alignItems: "stretch", // Ensure grid items stretch
              }}
            >
              {phaseCards.map((card, idx) => (
                <div key={card.title} style={{ height: "100%" }}>
                  <PhaseCard
                    title={card.title}
                    description={card.description}
                    expandButtonText={card.expandButtonText}
                    collapseButtonText={card.collapseButtonText}
                    phases={card.phases}
                    renderPhaseContent={renderPhaseContent(idx)}
                    initialActivePhase={activePhases[idx]}
                    isExpanded={false} // Pass false when showing the grid
                    onToggleExpand={() => handleCardToggle(idx, true)} // Click toggles to true
                    animationSteps={card.phases[0].animationSteps}
                    stepDescriptions={
                      card.phases[0].stepDescriptions ??
                      card.phases[0].animationSteps.map(
                        (_: any, idx: number) =>
                          `Description for Step ${idx + 1}`
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Box>
  );
}

export default SolutionSection;
