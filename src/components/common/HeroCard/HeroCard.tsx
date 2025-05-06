import React, { useState } from "react";
import {
  Card,
  Text,
  Box,
  Stack,
  Group,
  Button,
  Collapse,
  Divider,
  HoverCard,
} from "@mantine/core";
import styles from "./HeroCard.module.css";
import AnimatedDiagram from "../AnimatedDiagram/AnimatedDiagram";
/**
 * HeroCard.tsx
 *
 * A flexible, visually prominent card component for displaying a hero section with optional expandable sections.
 *
 * ## Usage
 * Use `HeroCard` to present a main title, description, and a hero diagram, with the option to expand/collapse additional sections.
 * Each section can include its own title, description, and diagram. The card is styled for high visibility and is suitable for landing or feature pages.
 *
 * - The main area displays a title, description, and a hero diagram side by side.
 * - An expand/collapse button toggles the visibility of additional sections.
 * - Each section alternates the position of text and diagram for visual interest.
 * - Citations in the description (e.g., `[1]`) can be linked to popovers showing content from a `citations` array.
 *
 * @component
 * @example
 * <HeroCard
 *   title="Welcome to Prism"
 *   description="A unified interface for model exploration.[1]"
 *   expandButtonText="Show More"
 *   collapseButtonText="Show Less"
 *   heroDiagram={<MyHeroDiagram />}
 *   sections={[
 *     { title: 'Section 1', description: 'Details...[1]', diagram: <Section1Diagram />, citations: [{ content: "Source A" }] },
 *     { title: 'Section 2', description: 'More...', diagram: <Section2Diagram /> },
 *   ]
 * />
 */

interface HeroCardProps {
  title?: string;
  description?: string;
  expandButtonText?: string;
  collapseButtonText?: string;
  heroDiagram?: React.ReactNode | string | any;
  sections?: {
    title: string;
    description: string;
    diagram: React.ReactNode | string | any;
    citations?: {
      content: string;
    }[];
  }[];
}

/**
 * Parses a description string containing citation markers like [1], [2], etc.,
 * and replaces them with HoverCard components displaying corresponding citation content.
 *
 * @param {string} description - The text containing potential citation markers.
 * @param {Array<{ content: string }>} citations - An array of citation objects.
 * @returns {Array<string | React.ReactNode>} An array of strings and React Nodes (HoverCards for citations).
 */
const parseDescriptionAndCitations = (
  description: string,
  citations: { content: string }[]
): (string | React.ReactNode)[] => {
  // Split the description by citation markers like [1], retaining the markers
  const parts = description.split(/(\[\d+\])/);

  return parts
    .map((part, index) => {
      // Check if the current part is a citation marker (e.g., "[1]")
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        // Extract the citation number (adjusting for 0-based array index)
        const citationIndex = parseInt(match[1], 10) - 1;
        // Check if a valid citation exists at this index
        if (
          citations &&
          citationIndex >= 0 &&
          citationIndex < citations.length
        ) {
          const citationContent = citations[citationIndex].content;
          // Return a HoverCard component for the citation
          return (
            <HoverCard
              key={`${part}-${index}`}
              classNames={{ dropdown: styles.dropdown }}
              width={300}
              position="top"
              withArrow
              shadow="md"
              openDelay={100} // Use HoverCard's openDelay
              closeDelay={200} // Use HoverCard's closeDelay
            >
              <HoverCard.Target>
                {/* Citation marker text, styled for interaction */}
                <Text
                  component="span"
                  variant="link" // Use link variant for visual cue
                  className={styles.citationMarker} // Add class for potential specific styling
                >
                  {part}
                </Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {/* Content of the dropdown */}
                <Text size="sm">{citationContent}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          );
        }
      }
      // If it's not a valid citation marker or no content found, return the text part as is
      return part;
    })
    .filter((part) => part !== ""); // Filter out potential empty strings from split
};

/**
 * Props for the HeroCard component.
 *
 * @property {string} [title] - The main title displayed on the card.
 * @property {string} [description] - The main description text.
 * @property {string} [expandButtonText] - Text for the expand button.
 * @property {string} [collapseButtonText] - Text for the collapse button.
 * @property {React.ReactNode | string | any} [heroDiagram] - The main diagram or visual element for the hero section.
 * @property {Array<{ title: string; description: string; diagram: React.ReactNode | string | any, citations?: { content: string }[] }>} [sections] - Optional expandable sections, each with a title, description, diagram, and optional citations.
 */

export const HeroCard: React.FC<HeroCardProps> = ({
  title,
  description,
  expandButtonText,
  collapseButtonText,
  heroDiagram,
  sections,
}) => {
  /**
   * State to control whether the expandable sections are open.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [opened, setOpened] = useState(false);

  return (
    <Card
      shadow="sm"
      padding="lg"
      className={`prism-invert-card ${styles.card}`}
    >
      <Group align="center" gap="xl" wrap="nowrap" className={styles.container}>
        {/* Left: Text */}
        <Box className={styles.textContainer}>
          {title && (
            <Text className={styles.title} py={10}>
              {title}
            </Text>
          )}
          <Text className={styles.description}>{description}</Text>
        </Box>
        {/* Right: Diagram */}
        <Box className={styles.diagramContainer}>
          {/* Render the hero diagram, supporting both React elements, SVG path strings, and component functions */}
          {typeof heroDiagram === "string" ? (
            <AnimatedDiagram svgPath={heroDiagram} />
          ) : typeof heroDiagram === "function" ? (
            React.createElement(heroDiagram)
          ) : (
            heroDiagram
          )}
        </Box>
      </Group>

      <Collapse
        in={opened}
        transitionDuration={300}
        transitionTimingFunction="ease"
      >
        <Stack className={styles.sectionContainer}>
          {sections?.map((section, index) => {
            /**
             * Alternates the layout of text and diagram for each section.
             * Even-indexed sections show diagram first, odd-indexed show text first.
             */
            const isEven = index % 2 === 0;
            const hasDiagram = section.diagram !== "";
            const hasCitations =
              section.citations && section.citations.length > 0;

            // Parse the description if citations exist, otherwise use the raw description string
            const descriptionContent = hasCitations
              ? parseDescriptionAndCitations(
                  section.description,
                  section.citations! // Assert non-null as we checked hasCitations
                )
              : section.description;

            const textContent = (
              <Box
                className={styles.sectionTextContainer}
                key="text"
                style={
                  !hasDiagram ? { textAlign: "center", width: "100%" } : {}
                } // Center text if no diagram
              >
                <Text className={styles.sectionTitle}>{section.title}</Text>
                <Text className={styles.sectionDescription}>
                  {/* Render the parsed or raw description content */}
                  {descriptionContent}
                </Text>
              </Box>
            );

            const diagramContent = hasDiagram ? (
              <Box className={styles.sectionDiagramContainer} key="diagram">
                {typeof section.diagram === "string" ? (
                  <AnimatedDiagram svgPath={section.diagram} />
                ) : typeof section.diagram === "function" ? (
                  React.createElement(section.diagram)
                ) : (
                  section.diagram
                )}
              </Box>
            ) : null;

            return (
              <React.Fragment key={index}>
                <Divider labelPosition="center" my="md" />
                <Group
                  align="flex-start"
                  gap="xl"
                  wrap="nowrap"
                  justify={!hasDiagram ? "center" : "flex-start"}
                  style={!hasDiagram ? { width: "100%" } : {}}
                >
                  {/* Render based on isEven only if diagram exists */}
                  {
                    hasDiagram
                      ? !isEven
                        ? [textContent, diagramContent]
                        : [diagramContent, textContent]
                      : [textContent] // Just text content if no diagram
                  }
                </Group>
              </React.Fragment>
            );
          })}
        </Stack>
      </Collapse>
      <Box className={styles.buttonContainer}>
        {/* Button toggles the expanded/collapsed state of the sections */}
        {sections &&
          sections.length > 0 && ( // Only show button if there are sections
            <Button
              className="prism-button"
              onClick={() => setOpened((o) => !o)}
            >
              {opened ? collapseButtonText : expandButtonText}
            </Button>
          )}
      </Box>
    </Card>
  );
};

export default HeroCard;
