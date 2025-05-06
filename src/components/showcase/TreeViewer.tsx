import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Title, Loader, Center } from "@mantine/core";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  NodeTypes,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  NodeMouseHandler,
  ReactFlowProvider,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { fetchTreeData } from "../../api/treeService";
import { TreeData, NodeData, NodeDataTrailData } from "../../types/tree";
import { ControlsPanel } from "./ControlsPanel";
import { DataTrailDrawer } from "./DataTrailDrawer";
import { TreeNode } from "./TreeNode";
import { DataTrailNode } from "./DataTrailNode";
import { LegendDrawer } from "./LegendDrawer";

import dagre from "dagre"; // Import dagre

// Colors for performance edges
const edgeColors = {
  improved: "#008000", // green
  same: "#808080", // gray
  decreased: "#FF0000", // red
};

// Create a wrapper component to use the flow hooks
interface FlowWithProviderProps {
  treeData: TreeData | null;
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  nodes: Node<NodeData>[]; // Use Node<NodeData> for correct typing
  edges: Edge[];
  nodeTypes: NodeTypes;
}

function FlowWithProvider({
  treeData,
  selectedNode,
  setSelectedNode,
  nodes,
  edges,
  nodeTypes,
}: FlowWithProviderProps) {
  // State management for drawers
  const [dataTrailDrawerOpen, setDataTrailDrawerOpen] = useState(false);
  const [legendDrawerOpen, setLegendDrawerOpen] = useState(false);

  // State management for sidebar data trail visualization
  const [sidebarDataTrailNodes, setSidebarDataTrailNodes] = useState<Node[]>(
    []
  );
  const [sidebarDataTrailEdges, setSidebarDataTrailEdges] = useState<Edge[]>(
    []
  );

  const reactFlowInstance = useReactFlow();

  // Create datatrail nodes for sidebar visualization
  const createSidebarDataTrailNodes = useCallback((nodeData: NodeData) => {
    if (!nodeData.run_results || nodeData.run_results.length === 0) {
      setSidebarDataTrailNodes([]);
      setSidebarDataTrailEdges([]);
      return;
    }

    // Create a source node (the main challenge node)
    const sourceNode: Node<NodeData> = {
      id: "sidebar-source",
      type: "customNode", // Use the key defined in nodeTypes
      position: { x: 150, y: 150 },
      data: nodeData, // Pass the full NodeData
    };

    // Create nodes for each run result and their data_trail attempts
    let dataTrailNodes: Node[] = [];
    let dataTrailEdges: Edge[] = [];

    nodeData.run_results.forEach((runResult, runIndex) => {
      if (runResult.data_trail && runResult.data_trail.length > 0) {
        // Create a run node
        const runNode: Node = {
          id: `sidebar-run-${runIndex}`,
          type: "dataTrailNode",
          position: {
            x: 400,
            y: 50 + runIndex * 300, // Space runs vertically with more spacing
          },
          data: {
            success: runResult.success,
            attempt_num: runIndex + 1,
            problem_statement: "Run Summary",
            test_cases: null,
            solution_code: null,
            output: null,
            tests_passed_num: null,
            tests_failed_num: null,
            tests_errored_num: null,
            fixed_by_problem_fixer: null,
            error_feedback: null,
            index: runIndex,
          } as NodeDataTrailData & { index: number },
        };

        dataTrailNodes.push(runNode);

        // Create an edge from source to run node
        dataTrailEdges.push({
          id: `sidebar-edge-to-run-${runIndex}`,
          source: sourceNode.id,
          target: runNode.id,
          type: "straight",
          animated: true,
          style: { stroke: "#666", strokeDasharray: "5,5" },
        });

        // Create nodes for each attempt in this run
        runResult.data_trail.forEach(
          (trail: NodeDataTrailData, attemptIndex: number) => {
            const attemptNode: Node = {
              id: `sidebar-run-${runIndex}-attempt-${attemptIndex}`,
              type: "dataTrailNode",
              position: {
                x: 650, // Place attempt nodes to the right of run nodes
                y: 50 + runIndex * 300 + attemptIndex * 150, // Stack vertically with spacing
              },
              data: { ...trail, index: attemptIndex } as NodeDataTrailData & {
                index: number;
              },
            };

            dataTrailNodes.push(attemptNode);

            // Create edge from run node to attempt node
            dataTrailEdges.push({
              id: `sidebar-edge-from-run-${runIndex}-to-attempt-${attemptIndex}`,
              source: runNode.id,
              target: attemptNode.id,
              type: "straight",
              animated: false,
              style: { stroke: "#888", strokeWidth: 1, strokeDasharray: "3,3" },
            });
          }
        );
      }
    });

    setSidebarDataTrailNodes([sourceNode, ...dataTrailNodes]);
    setSidebarDataTrailEdges(dataTrailEdges);
  }, []);

  // Handle node click
  const onNodeClick: NodeMouseHandler = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node.id);
      setDataTrailDrawerOpen(true);
      createSidebarDataTrailNodes(node.data);
    },
    [setSelectedNode, createSidebarDataTrailNodes]
  );

  // Clear data trail nodes when drawer closes
  const handleDataTrailDrawerClose = useCallback(() => {
    setDataTrailDrawerOpen(false);
    setSidebarDataTrailNodes([]);
    setSidebarDataTrailEdges([]);
  }, []);

  // Get selected node details (using NodeData now)
  const selectedNodeData = useMemo(() => {
    if (!selectedNode || !treeData) return null;
    // Find the NodeData based on the selected ID
    return treeData.nodes.find((node: NodeData) => node.id === selectedNode);
  }, [selectedNode, treeData]);

  // Function to center view on a node
  const centerOnNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node && reactFlowInstance) {
        // Calculate center including node dimensions if available
        const nodeWidth = node.width || 300; // Estimate if not available
        const nodeHeight = node.height || 250;
        reactFlowInstance.setCenter(
          node.position.x + nodeWidth / 2,
          node.position.y + nodeHeight / 2,
          {
            zoom: 1.5,
            duration: 800,
          }
        );
      }
    },
    [nodes, reactFlowInstance]
  );

  // Reset view to fit all nodes
  const resetView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
      setSelectedNode(null); // Deselect node on reset
    }
  }, [reactFlowInstance, setSelectedNode]);

  // Ensure the entire tree is visible on first load or when nodes/edges change
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0 && edges.length > 0) {
      // Use a timeout to ensure nodes are rendered before fitting view
      const timeout = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [reactFlowInstance, nodes, edges]);

  return (
    <>
      <Box style={{ height: "90vh", width: "100%", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.05}
          onNodeClick={onNodeClick}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { strokeWidth: 2 },
          }}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <ControlsPanel
            selectedNodeData={selectedNodeData}
            onReset={resetView}
            onCenter={centerOnNode}
            onToggleLegend={() => setLegendDrawerOpen(true)}
          />
        </ReactFlow>
      </Box>

      <DataTrailDrawer
        opened={dataTrailDrawerOpen}
        onClose={handleDataTrailDrawerClose}
        selectedNodeData={selectedNodeData}
        sidebarNodes={sidebarDataTrailNodes}
        sidebarEdges={sidebarDataTrailEdges}
        nodeTypes={nodeTypes} // Pass nodeTypes for the sidebar flow
      />

      <LegendDrawer
        opened={legendDrawerOpen}
        onClose={() => setLegendDrawerOpen(false)}
      />
    </>
  );
}

// Add props for modelId and treeFile to TreeVisualization
interface TreeVisualizationProps {
  modelId: string;
  treeFile: string;
}

// Update the main component to accept props
export default function TreeVisualization({
  modelId,
  treeFile,
}: TreeVisualizationProps) {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Define node types *outside* FlowWithProvider to avoid redefining on re-render
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      customNode: TreeNode, // Use imported TreeNode component
      dataTrailNode: DataTrailNode, // Use imported DataTrailNode component
    }),
    []
  );

  useEffect(() => {
    setLoading(true); // Set loading when props change
    setTreeData(null); // Clear previous tree data
    setSelectedNode(null); // Clear selected node
    fetchTreeData(modelId, treeFile) // Call fetchTreeData with props
      .then((data) => {
        setTreeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tree data:", err);
        setLoading(false);
      });
  }, [modelId, treeFile]); // Re-run effect when modelId or treeFile changes

  // Transform tree data into React Flow nodes and edges
  // Use correct types: Node<NodeData>
  const { nodes, edges } = useMemo(() => {
    if (!treeData) return { nodes: [], edges: [] };

    // --- Dagre Layout Logic ---
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({})); // Default empty label for edges
    dagreGraph.setGraph({ rankdir: "TB", nodesep: 100, ranksep: 150 }); // Top-to-bottom layout, adjust spacing as needed

    const nodeWidth = 300; // Use the same node dimensions
    const nodeHeight = 320;

    // Add nodes to Dagre graph
    treeData.nodes.forEach((node: NodeData) => {
      dagreGraph.setNode(node.id, {
        label: node.id,
        width: nodeWidth,
        height: nodeHeight,
      });
    });

    // Add edges to Dagre graph
    treeData.edges.forEach((edge: { source: string; target: string }) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Convert Dagre nodes to React Flow nodes
    const reactFlowNodes: Node<NodeData>[] = treeData.nodes.map(
      (nodeData: NodeData) => {
        const nodeWithPosition = dagreGraph.node(nodeData.id);
        return {
          id: nodeData.id,
          // Dagre positions the center of the node, React Flow positions the top-left. Adjust accordingly.
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
          data: nodeData,
          type: "customNode",
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        };
      }
    );
    // --- End Dagre Layout Logic ---

    // Convert tree edges to ReactFlow edges
    const reactFlowEdges: Edge[] = treeData.edges.map(
      (edge: {
        source: string;
        target: string;
        performance?: "improved" | "same" | "decreased";
      }) => {
        const performance = edge.performance;
        return {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          style: {
            stroke:
              performance && performance in edgeColors
                ? edgeColors[performance]
                : edgeColors.same,
            strokeWidth: 2,
          },
          animated: performance === "improved",
          type: "smoothstep",
        };
      }
    );

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  }, [treeData]);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box>
      <Title order={2} mb="lg">
        Challenge Tree Visualization
      </Title>

      <ReactFlowProvider>
        <FlowWithProvider
          treeData={treeData}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
        />
      </ReactFlowProvider>
    </Box>
  );
}
