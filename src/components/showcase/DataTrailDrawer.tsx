import React, { useCallback } from "react";
import {
  Drawer,
  ScrollArea,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Accordion,
  Code,
  Stack,
  Box,
} from "@mantine/core";
import {
  ReactFlowProvider,
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
} from "reactflow";
import ReactMarkdown from "react-markdown";
import { NodeData, NodeDataTrailData } from "@/types/tree.ts";
import { TreeNode } from "./TreeNode";
import { DataTrailNode } from "./DataTrailNode";

// Markdown styling
const markdownStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.5",
};

/**
 * Props for the DataTrailDrawer component.
 *
 * @property {boolean} opened - Whether the drawer is open.
 * @property {() => void} onClose - Callback to close the drawer.
 * @property {NodeData | null | undefined} selectedNodeData - The currently selected node's data.
 * @property {Node[]} sidebarNodes - Nodes for the optional sidebar flow visualization.
 * @property {Edge[]} sidebarEdges - Edges for the optional sidebar flow visualization.
 * @property {NodeTypes} nodeTypes - Custom node types for React Flow.
 */
interface DataTrailDrawerProps {
  opened: boolean;
  onClose: () => void;
  selectedNodeData: NodeData | null | undefined;
  sidebarNodes: Node[];
  sidebarEdges: Edge[];
  nodeTypes: NodeTypes;
}

/**
 * DataTrailDrawer component
 *
 * Renders a drawer with challenge details and execution history for a selected node.
 *
 * @param {DataTrailDrawerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered drawer component.
 */
export const DataTrailDrawer: React.FC<DataTrailDrawerProps> = ({
  opened,
  onClose,
  selectedNodeData,
  sidebarNodes,
  sidebarEdges,
  nodeTypes,
}) => {
  /**
   * Renders the execution history (data trail) for the selected node.
   *
   * @returns {JSX.Element} The rendered data trail content.
   */
  const renderDataTrailContent = useCallback(() => {
    // If no run results are available, show a message
    if (
      !selectedNodeData ||
      !selectedNodeData.run_results ||
      selectedNodeData.run_results.length === 0
    ) {
      return <Text>No execution history available for this node.</Text>;
    }

    // For debugging: log the selected node data
    // console.log(selectedNodeData);

    return (
      <Accordion>
        {selectedNodeData.run_results.map((runResult, runIndex) => (
          <Accordion.Item key={`run-${runIndex}`} value={`run-${runIndex}`}>
            <Accordion.Control>
              <Group>
                <Text fw={500}>Run #{runIndex + 1}</Text>
                <Badge color={runResult.success ? "green" : "red"}>
                  {runResult.success ? "Success" : "Failed"}
                </Badge>
              </Group>
              {/* Show the problem statement for the first attempt, if available */}
              {runResult.data_trail[0].problem_statement && (
                <>
                  <Text fw={700}>Problem Statement:</Text>
                  <Paper p="xs" withBorder style={{ maxWidth: "100%" }}>
                    <div style={markdownStyle}>
                      <ReactMarkdown>
                        {runResult.data_trail[0].problem_statement}
                      </ReactMarkdown>
                    </div>
                  </Paper>
                </>
              )}
            </Accordion.Control>
            <Accordion.Panel>
              {/* Show attempts for this run */}
              {!runResult.data_trail || runResult.data_trail.length === 0 ? (
                <Text>No attempts data available for this run.</Text>
              ) : (
                <Accordion>
                  {runResult.data_trail.map((trail, idx) => (
                    <Accordion.Item
                      key={idx}
                      value={`attempt-${runIndex}-${idx}`}
                    >
                      <Accordion.Control>
                        <Group>
                          <Text fw={500}>
                            Attempt #{(trail.attempt_num ?? idx) + 1}
                          </Text>
                          <Badge
                            color={
                              trail.success
                                ? "green"
                                : trail.fixed_by_problem_fixer
                                ? "yellow"
                                : "red"
                            }
                          >
                            {trail.success
                              ? "Success"
                              : trail.fixed_by_problem_fixer
                              ? "Fixed"
                              : "Failed"}
                          </Badge>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack>
                          {/* Test results summary */}
                          {(trail.tests_passed_num !== null ||
                            trail.tests_failed_num !== null) && (
                            <Group>
                              <Text fw={700}>Test Results:</Text>
                              <Badge color="green">
                                {trail.tests_passed_num || 0} passed
                              </Badge>
                              <Badge color="red">
                                {trail.tests_failed_num || 0} failed
                              </Badge>
                              {trail.tests_errored_num !== null && (
                                <Badge color="yellow">
                                  {trail.tests_errored_num} errored
                                </Badge>
                              )}
                            </Group>
                          )}

                          {/* Solution code, if available */}
                          {trail.solution_code && (
                            <>
                              <Text fw={700}>Solution Code:</Text>
                              <Code block>{trail.solution_code}</Code>
                            </>
                          )}

                          {/* Test cases, if available */}
                          {trail.test_cases && (
                            <>
                              <Text fw={700}>Test Cases:</Text>
                              <Code block>{trail.test_cases}</Code>
                            </>
                          )}

                          {/* Execution output, if available */}
                          {trail.output && (
                            <>
                              <Text fw={700}>Execution Output:</Text>
                              <Code block>{trail.output}</Code>
                            </>
                          )}
                          {/*
                          // Uncomment to show error feedback if needed
                          {trail.error_feedback && (
                            <>
                              <Text fw={700} c="red">
                                Error Feedback:
                              </Text>
                              <Paper p="xs" withBorder bg="red.0">
                                <Text size="sm" c="red.8">
                                  {trail.error_feedback}
                                </Text>
                              </Paper>
                            </>
                          )} */}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  }, [selectedNodeData]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        selectedNodeData
          ? `Node ${selectedNodeData.id} Data Trail`
          : "Data Trail"
      }
      position="right"
      size="xl"
      padding="md"
    >
      {/* Only render content if a node is selected */}
      {selectedNodeData && (
        <ScrollArea h="calc(100vh - 60px)" offsetScrollbars>
          <Paper p="md" withBorder mb="md">
            <Title order={5} mb="sm">
              Challenge Details
            </Title>
            {/* List of concepts for the challenge */}
            <Group mt="sm">
              <Text fw={700}>Concepts:</Text>
              {[...selectedNodeData.concepts]
                .sort()
                .map((concept: string, idx: number) => (
                  <Badge key={idx}>{concept}</Badge>
                ))}
            </Group>
            {/* Difficulty and phase info */}
            <Group mt="sm">
              <Text fw={700}>Difficulty:</Text> {selectedNodeData.difficulty}
            </Group>
            <Group mt="sm">
              <Text fw={700}>Phase:</Text> {selectedNodeData.phase}
            </Group>
            {/*
            // Uncomment to show challenge description if needed
            <Group mt="sm">
              <Text fw={700}>Description:</Text>
              <div style={markdownStyle}>
                <ReactMarkdown>
                  {selectedNodeData.challenge_description}
                </ReactMarkdown>
              </div>
            </Group>
            */}
          </Paper>

          <Divider my="md" />

          <Title order={5} mb="md">
            Execution History
          </Title>
          {renderDataTrailContent()}

          {/*
          // Uncomment to show execution flow visualization if needed
          {sidebarNodes.length > 0 &&
            selectedNodeData.run_results &&
            selectedNodeData.run_results.length > 0 && (
              <>
                <Divider my="md" />
                <Title order={5} mb="md">
                  Execution Flow Visualization
                </Title>
                <Box
                  style={{
                    height:
                      300 +
                      (selectedNodeData.run_results.flatMap(
                        (run) => run.data_trail || []
                      ).length || 0) *
                        150,
                    width: "100%",
                  }}
                >
                  <ReactFlowProvider>
                    <ReactFlow
                      nodes={sidebarNodes}
                      edges={sidebarEdges}
                      nodeTypes={nodeTypes}
                      fitView
                      minZoom={0.2}
                      maxZoom={1.5}
                      defaultEdgeOptions={{
                        type: "straight",
                        style: { strokeWidth: 2 },
                      }}
                    >
                      <Controls showInteractive={false} />
                      <Background variant={BackgroundVariant.Dots} gap={12} />
                    </ReactFlow>
                  </ReactFlowProvider>
                </Box>
              </>
            )}
          */}
        </ScrollArea>
      )}
    </Drawer>
  );
};
