import React from "react";
import { Group, Box, Loader } from "@mantine/core";
import SectionTitle from "../../../components/common/SectionTitle/SectionTitle";
import TreeMetricsMatrix from "@/components/leaderboard/TreeMetricsMatrix/TreeMetricsMatrix";
import { ModelMeta, TreeMetricsData } from "../../../types";

interface TreeMetricsSectionProps {
  isLoading?: boolean;
  selectedModels: ModelMeta[];
  treeMetrics: Record<string, TreeMetricsData>;
  hasMetricsData?: boolean;
}

const TreeMetricsSection: React.FC<TreeMetricsSectionProps> = ({
  isLoading = false,
  selectedModels,
  treeMetrics,
  hasMetricsData = true,
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
            title="Tree Metrics Per Model"
            subtitle="Heatmap showing the count of nodes generated at different depths for various concepts within each selected model's solution tree."
            align="left"
          />

          {canShowMetrics && (
            <Box style={{ width: "100%", maxWidth: "100%" }}>
              {selectedModels.map((model) => (
                <Box
                  key={model.id}
                  style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}
                  mt="md"
                >
                  <TreeMetricsMatrix
                    selectedModel={model}
                    treeMetrics={treeMetrics[model.id] || null}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Group>
      )}
    </>
  );
};

export default TreeMetricsSection;
