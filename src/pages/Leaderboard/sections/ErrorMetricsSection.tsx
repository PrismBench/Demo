import React from "react";
import { Group, Text, Box } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import ErrorMetricsTable from "../../../components/leaderboard/ErrorPatternTable/ErrorMetricsTable";
import { ModelMeta } from "../../../types";

interface ErrorMetricsSectionProps {
  selectedModels: ModelMeta[];
}

const ErrorMetricsSection: React.FC<ErrorMetricsSectionProps> = ({
  selectedModels,
}) => {
  return (
    <>
      <SectionTitle
        title="Error Metrics Analysis"
        subtitle="Detailed breakdown of error patterns and distributions for each model across concept groups and difficulty levels."
        align="left"
      />

      {selectedModels.length === 0 ? (
        <Group justify="center" mt="md">
          <Text>
            Select one or more models to view their error metrics analysis.
          </Text>
        </Group>
      ) : (
        <Box style={{ width: "100%", maxWidth: "100%" }} mt="md">
          <ErrorMetricsTable models={selectedModels} />
        </Box>
      )}
    </>
  );
};

export default ErrorMetricsSection;
