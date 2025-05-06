import React from "react";
import { Group, Loader, Box } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import CapabilityMetricsTable from "../../../components/leaderboard/CapabilityMetricsTable/CapabilityMetricsTable";
import CapabilityMetricsRadar from "../../../components/leaderboard/CapabilityMetricsRadar/CapabilityMetricsRadar";
import { ModelMeta, ConceptMetricsData } from "../../../types/leaderboard";

interface ConceptMetricsSectionProps {
  isLoading: boolean;
  selectedModels: ModelMeta[];
  conceptMetrics: Record<string, ConceptMetricsData>;
  hasMetricsData: boolean;
}

const ConceptMetricsSection: React.FC<ConceptMetricsSectionProps> = ({
  isLoading,
  selectedModels,
  conceptMetrics,
  hasMetricsData,
}) => {
  // Check if metrics can be displayed
  const canShowMetrics =
    !isLoading && hasMetricsData && selectedModels.length > 0;

  return (
    <>
      {isLoading ? (
        <Loader mt="md" />
      ) : (
        <Group>
          <SectionTitle
            title="Capability Metrics"
            subtitle="These metrics display the performance of models across concepts and difficulties."
            align="left"
          />

          {canShowMetrics && (
            <Box style={{ width: "100%", maxWidth: "100%" }}>
              <Group justify="center" style={{ flexWrap: "wrap" }}>
                <Box style={{ width: "100%", maxWidth: "100%" }}>
                  <CapabilityMetricsTable
                    models={selectedModels}
                    conceptMetrics={conceptMetrics}
                  />
                </Box>
                <Box style={{ width: "100%", maxWidth: "100%" }}>
                  <CapabilityMetricsRadar
                    models={selectedModels}
                    conceptMetrics={conceptMetrics}
                  />
                </Box>
              </Group>
            </Box>
          )}
        </Group>
      )}
    </>
  );
};

export default ConceptMetricsSection;
