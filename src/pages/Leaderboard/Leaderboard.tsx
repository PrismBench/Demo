import React, { useState, useEffect } from "react";
import { Container, Stack, Loader, Alert, Box } from "@mantine/core";
import { DefaultLayout } from "../../components/layout/DefaultLayout";
import ModelSelector from "../../components/leaderboard/ModelSelector/ModelSelector";
import {
  fetchModels,
  fetchCapabilityData,
  fetchTreeMetrics,
} from "../../api/leaderboardService";
import {
  ModelMeta,
  ConceptMetricsData,
  TreeMetricsData,
} from "../../types/leaderboard";
import { IconAlertCircle } from "@tabler/icons-react";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import ConceptMetricsSection from "./sections/ConceptMetricsSection";
import TreeMetricsSection from "./sections/TreeMetricsSection";
import ErrorMetricsSection from "./sections/ErrorMetricsSection";
import PatternMetricsSection from "./sections/PatternMetricsSection";

const LeaderboardPage: React.FC = () => {
  const [availableModels, setAvailableModels] = useState<ModelMeta[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [conceptMetrics, setConceptMetrics] = useState<
    Record<string, ConceptMetricsData>
  >({});
  const [treeMetrics, setTreeMetrics] = useState<
    Record<string, TreeMetricsData>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get selected models data
  const selectedModels = availableModels.filter((m) =>
    selectedModelIds.includes(m.id)
  );

  // Check if metrics data is available
  const hasMetricsData = Object.keys(conceptMetrics).length > 0;
  const hasTreeMetricsData = Object.keys(treeMetrics).length > 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [models, capabilities, trees] = await Promise.all([
          fetchModels(),
          fetchCapabilityData(),
          fetchTreeMetrics(),
        ]);

        setAvailableModels(models);
        setConceptMetrics(capabilities);
        setTreeMetrics(trees);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Could not load required leaderboard data.");
        setAvailableModels([]);
        setConceptMetrics({});
        setTreeMetrics({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render error alert component
  const renderErrorAlert = () => (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      title="Error"
      color="red"
      mt="md"
    >
      {error}
    </Alert>
  );

  return (
    <DefaultLayout>
      <Box style={{ width: "100%", maxWidth: "100%" }}>
        <Container
          fluid
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "0 var(--mantine-spacing-md)",
          }}
        >
          <Stack>
            <SectionTitle
              title="Model Leaderboard"
              subtitle="Select models to compare their capabilities."
              align="left"
            />

            {isLoading ? (
              <Loader />
            ) : error && availableModels.length === 0 ? (
              renderErrorAlert()
            ) : (
              <ModelSelector
                models={availableModels}
                selectedModelIds={selectedModelIds}
                onChange={setSelectedModelIds}
              />
            )}

            {error && availableModels.length > 0 && renderErrorAlert()}
          </Stack>

          <Stack gap="xl">
            <ConceptMetricsSection
              isLoading={isLoading}
              selectedModels={selectedModels}
              conceptMetrics={conceptMetrics}
              hasMetricsData={hasMetricsData}
            />

            <TreeMetricsSection
              isLoading={isLoading}
              selectedModels={selectedModels}
              treeMetrics={treeMetrics}
              hasMetricsData={hasTreeMetricsData}
            />

            <ErrorMetricsSection selectedModels={selectedModels} />

            <PatternMetricsSection selectedModels={selectedModels} />
          </Stack>
        </Container>
      </Box>
    </DefaultLayout>
  );
};

export default LeaderboardPage;
