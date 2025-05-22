import { AnimationStep } from "../../../../components/graphics/DiagramTree/data/GenericTreeTypes";

export const PHASE3_STEPS: AnimationStep[] = [
  {
    type: "zoom",
    viewBox: "0 0 600 400",
    step: 1,
  },
  {
    type: "showNode",
    nodeIds: [
      "root",
      "child1",
      "child2",
      "child3",
      "grandchild1",
      "grandchild2",
      "grandchild3",
      "grandchild4",
      "grandchild5",
      "grandchild5",
      "phase2_child1",
      "phase2_child2",
      "phase2_child3",
      "phase2_child4",
      "phase2_child5",
    ],
    step: 1,
  },

  {
    type: "showAllEdges",
    nodeTypes: ["child"],
    step: 1,
  },
  {
    type: "showAllEdges",
    nodeTypes: ["leaf"],
    step: 1,
  },
  {
    type: "showAllEdges",
    nodeTypes: ["highlight"],
    step: 1,
  },
  {
    type: "showTextBox",
    id: "description1",
    text: "We select low-value nodes\nfrom the previous phase.",
    position: { x: 0, y: 40 },
    width: 140,
    height: 60,
    step: 1,
  },

  {
    type: "hideTextBox",
    id: "description1",
    step: 2,
  },
  {
    type: "zoom",
    viewBox: "360 50 400 280",
    step: 2,
  },
  {
    type: "showNode",
    nodeIds: [
      "phase3_child1",
      "phase3_child2",
      "phase3_child3",
      "phase3_child4",
      "phase3_child5",
    ],
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child1",
    targetNodeId: "phase3_child1",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child1",
    targetNodeId: "phase3_child2",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child1",
    targetNodeId: "phase3_child3",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child1",
    targetNodeId: "phase3_child4",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child1",
    targetNodeId: "phase3_child5",
    step: 2,
  },

  {
    type: "zoom",
    viewBox: "0 0 600 600",
    step: 3,
  },
  {
    type: "showNode",
    nodeIds: [
      "phase3_child6",
      "phase3_child7",
      "phase3_child8",
      "phase3_child9",
      "phase3_child10",
    ],
    step: 3,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child3",
    targetNodeId: "phase3_child6",
    step: 3,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child3",
    targetNodeId: "phase3_child7",
    step: 3,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child3",
    targetNodeId: "phase3_child8",
    step: 3,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child3",
    targetNodeId: "phase3_child9",
    step: 3,
  },
  {
    type: "showEdge",
    sourceNodeId: "phase2_child3",
    targetNodeId: "phase3_child10",
    step: 3,
  },
];
