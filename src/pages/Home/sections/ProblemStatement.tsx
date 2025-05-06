import React from "react";
import { Box } from "@mantine/core";

import HeroCard from "../../../components/common/HeroCard/HeroCard";
import { HeroCardContent } from "@/static/HeroCardContent";

const ProblemStatementSection: React.FC = () => {
  return (
    <Box
      id="problem-statement"
      style={{ padding: "var(--mantine-spacing-xl)" }}
    >
      <HeroCard
        title={HeroCardContent.title}
        description={HeroCardContent.description}
        expandButtonText={HeroCardContent.expandButtonText}
        collapseButtonText={HeroCardContent.collapseButtonText}
        heroDiagram={HeroCardContent.heroDiagram}
        sections={HeroCardContent.sections}
      />
    </Box>
  );
};

export default ProblemStatementSection;
