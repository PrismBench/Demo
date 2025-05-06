import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Alert,
  Accordion,
  List,
  ThemeIcon,
  Stack,
  Modal,
} from "@mantine/core";
import { IconAlertCircle, IconArrowRight } from "@tabler/icons-react";
import { TreeMeta, ModelMeta } from "../../types";
import TreeVisualization from "../../components/showcase/TreeViewer";
import { fetchShowcaseModels, fetchTreesForModel } from "../../api/treeService";
import { DefaultLayout } from "../../components/layout/DefaultLayout";

export function ShowcasePage() {
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [errorModels, setErrorModels] = useState<string | null>(null);

  // State for accordion
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | null>(
    null
  );

  // State to store trees fetched for each model { modelId: TreeMeta[] }
  const [modelTrees, setModelTrees] = useState<{ [key: string]: TreeMeta[] }>(
    {}
  );
  // State to track loading status for each model's trees { modelId: boolean }
  const [loadingModelTrees, setLoadingModelTrees] = useState<{
    [key: string]: boolean;
  }>({});
  // State to track errors for each model's trees { modelId: string }
  const [errorModelTrees, setErrorModelTrees] = useState<{
    [key: string]: string | null;
  }>({});

  // State for the tree currently being viewed
  const [viewingModel, setViewingModel] = useState<ModelMeta | null>(null);
  const [viewingTree, setViewingTree] = useState<TreeMeta | null>(null);

  // State for modal visibility
  const [modalOpened, setModalOpened] = useState(false);

  // Fetch models on component mount
  useEffect(() => {
    setLoadingModels(true);
    setErrorModels(null);
    fetchShowcaseModels()
      .then((data) => {
        setModels(data);
        setLoadingModels(false);
      })
      .catch((err) => {
        console.error("Error fetching models:", err);
        setErrorModels("Failed to load models. Please try again later.");
        setLoadingModels(false);
      });
  }, []);

  // Function to fetch trees for a specific model when its accordion opens
  const fetchTreesForAccordion = (modelId: string) => {
    // Only fetch if not already loading and not already fetched
    if (!loadingModelTrees[modelId] && !modelTrees[modelId]) {
      setLoadingModelTrees((prev) => ({ ...prev, [modelId]: true }));
      setErrorModelTrees((prev) => ({ ...prev, [modelId]: null })); // Clear previous error

      fetchTreesForModel(modelId)
        .then((data) => {
          setModelTrees((prev) => ({ ...prev, [modelId]: data }));
          setLoadingModelTrees((prev) => ({ ...prev, [modelId]: false }));
        })
        .catch((err) => {
          console.error(`Error fetching trees for ${modelId}:`, err);
          setErrorModelTrees((prev) => ({
            ...prev,
            [modelId]: `Failed to load trees.`,
          }));
          setLoadingModelTrees((prev) => ({ ...prev, [modelId]: false }));
        });
    }
  };

  // Effect to trigger tree fetching when accordion item changes
  useEffect(() => {
    if (activeAccordionItem) {
      fetchTreesForAccordion(activeAccordionItem);
    }
  }, [activeAccordionItem]); // Dependency on activeAccordionItem

  // Handler when a tree is clicked in the accordion panel
  const handleTreeViewSelect = (model: ModelMeta, tree: TreeMeta) => {
    setViewingModel(model);
    setViewingTree(tree);
    setModalOpened(true); // Open the modal
  };

  // Handler to close the visualization modal
  const handleCloseVisualization = () => {
    setViewingModel(null);
    setViewingTree(null);
    setModalOpened(false); // Close the modal
  };

  return (
    <DefaultLayout>
      <Container fluid>
        <Title order={1} mb="xl">
          Model Showcase
        </Title>

        {/* Loading State for Models */}
        {loadingModels && (
          <Center>
            <Loader />
            <Text ml="sm">Loading models...</Text>
          </Center>
        )}

        {/* Error State for Models */}
        {errorModels && !loadingModels && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error Loading Models"
            color="red"
            mb="lg"
          >
            {errorModels}
          </Alert>
        )}

        {/* Accordion for Model/Tree Selection (Show only if models loaded successfully) */}
        {!loadingModels && !errorModels && models.length > 0 && (
          <Accordion
            value={activeAccordionItem}
            onChange={setActiveAccordionItem} // Update state when item changes
            mb="xl" // Margin below accordion
          >
            {models.map((model) => (
              <Accordion.Item key={model.id} value={model.id}>
                <Accordion.Control>
                  <Text fw={500}>{model.name}</Text>
                  {model.description && (
                    <Text size="xs" c="dimmed">
                      {model.description}
                    </Text> // Smaller description
                  )}
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Loading state for this model's trees */}
                  {loadingModelTrees[model.id] && (
                    <Center>
                      <Loader size="xs" />
                      <Text size="sm" ml="xs">
                        Loading trees...
                      </Text>
                    </Center>
                  )}
                  {/* Error state for this model's trees */}
                  {errorModelTrees[model.id] &&
                    !loadingModelTrees[model.id] && (
                      <Alert
                        icon={<IconAlertCircle size="0.8rem" />}
                        title="Error"
                        color="red"
                        variant="light"
                        radius="xs"
                        p="xs"
                      >
                        <Text size="sm">{errorModelTrees[model.id]}</Text>
                      </Alert>
                    )}
                  {/* Display trees if loaded and no error */}
                  {!loadingModelTrees[model.id] &&
                    modelTrees[model.id] &&
                    !errorModelTrees[model.id] && (
                      <Stack gap="xs">
                        {modelTrees[model.id].length === 0 && (
                          <Text size="sm" c="dimmed">
                            No trees available for this model.
                          </Text>
                        )}
                        {modelTrees[model.id].length > 0 && (
                          <List
                            spacing="xs"
                            size="sm"
                            center
                            icon={
                              <ThemeIcon color="teal" size={18} radius="xl">
                                <IconArrowRight size="0.8rem" />
                              </ThemeIcon>
                            }
                          >
                            {modelTrees[model.id].map((tree) => (
                              <List.Item
                                key={tree.id}
                                onClick={() =>
                                  handleTreeViewSelect(model, tree)
                                }
                                style={{ cursor: "pointer" }}
                                onMouseEnter={(e) => {
                                  const target =
                                    e.currentTarget as HTMLLIElement;
                                  target.style.backgroundColor =
                                    "rgba(128, 128, 128, 0.1)"; // Example hover color
                                  target.style.borderRadius = "4px";
                                }}
                                onMouseLeave={(e) => {
                                  const target =
                                    e.currentTarget as HTMLLIElement;
                                  target.style.backgroundColor = "transparent"; // Revert on leave
                                }}
                              >
                                <Text
                                  style={{
                                    display: "inline-block",
                                    padding: "2px 4px",
                                  }}
                                >
                                  {tree.name}
                                </Text>
                              </List.Item>
                            ))}
                          </List>
                        )}
                      </Stack>
                    )}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        {/* Fallback if no models loaded and not loading */}
        {!loadingModels && models.length === 0 && !errorModels && (
          <Text>No models found.</Text>
        )}

        {/* Tree Visualization Modal */}
        {viewingModel && viewingTree && (
          <Modal
            opened={modalOpened}
            onClose={handleCloseVisualization}
            title={`Viewing: ${viewingTree.name} (Model: ${viewingModel.name})`}
            size="95%" // Use most of the width
            fullScreen // Use full height
            transitionProps={{ transition: "fade", duration: 200 }}
          >
            {/* Modal content */}
            <TreeVisualization
              modelId={viewingModel.id}
              treeFile={viewingTree.file}
            />
          </Modal>
        )}
      </Container>
    </DefaultLayout>
  );
}

export default ShowcasePage;
