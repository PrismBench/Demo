import React from "react";
import { Card, Text, Box, Group, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./ExploreCard.module.css";

/**
 * ExploreCard.tsx
 *
 * A card component for navigation and exploration within the application.
 *
 * ## Usage
 * Use `ExploreCard` to present a title, description, and a call-to-action button that links to another route. Optionally, display a diagram or visual element alongside the text.
 *
 * - The left side displays the title, description, and a navigation button.
 * - The right side can display a diagram or illustration if provided.
 *
 * @component
 * @example
 * <ExploreCard
 *   title="Explore Models"
 *   description="Dive into model capabilities and metrics."
 *   buttonText="Start Exploring"
 *   linkTo="/models"
 *   diagram={<ModelDiagram />}
 * />
 */

interface ExploreCardProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
  diagram?: React.ReactNode;
}

/**
 * Props for the ExploreCard component.
 *
 * @property {string} title - The main title displayed on the card.
 * @property {string} description - The description text.
 * @property {string} buttonText - The text for the navigation button.
 * @property {string} linkTo - The route to navigate to when the button is clicked.
 * @property {React.ReactNode} [diagram] - Optional diagram or visual element displayed on the right side.
 */

/**
 * ExploreCard component displays a card with a title, description, and a navigation button.
 * Optionally, a diagram or visual element can be shown on the right.
 *
 * @param {ExploreCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ExploreCard component.
 */

export const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  description,
  buttonText,
  linkTo,
  diagram,
}) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      className={`prism-invert-card ${styles.card}`}
      withBorder
    >
      <Group align="center" gap="xl" wrap="nowrap" className={styles.container}>
        {/* Left: Text */}
        <Box className={styles.textContainer}>
          <Text className={styles.title}>{title}</Text>
          <Text className={styles.description}>{description}</Text>
          <Group justify="flex-end">
            {/* Button navigates to the specified route using react-router Link */}
            <Button className="prism-button" component={Link} to={linkTo}>
              {buttonText}
            </Button>
          </Group>
        </Box>

        {/* Right: Diagram (if provided) */}
        {diagram && (
          <Box className={styles.diagramContainer}>
            {/* Render the diagram, supporting both React elements and component functions */}
            {typeof diagram === "function"
              ? React.createElement(diagram)
              : diagram}
          </Box>
        )}
      </Group>
    </Card>
  );
};

export default ExploreCard;
