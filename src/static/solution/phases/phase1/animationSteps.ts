import { AnimationStep } from "../../../../components/graphics/DiagramTree/data/GenericTreeTypes";

export const PHASE1_STEPS: AnimationStep[] = [
  {
    type: "showNode",
    nodeIds: ["root"],
    step: 1,
  },

  {
    type: "showTextBox",
    id: "description1",
    text: "We start with a root concept.\nFrom this concept, we generate\n a list of challenges.",
    position: { x: 120, y: 80 },
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
    type: "showNode",
    nodeIds: ["child1", "child2", "child3"],
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "root",
    targetNodeId: "child1",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "root",
    targetNodeId: "child2",
    step: 2,
  },
  {
    type: "showEdge",
    sourceNodeId: "root",
    targetNodeId: "child3",
    step: 2,
  },
  {
    type: "showTextBox",
    id: "description2",
    text: "Each challenge is then executed in a sandbox.\nThe results are then used to generate a\n list of sub-challenges.",
    position: { x: 150, y: 200 },
    width: 180,
    height: 50,
    step: 2,
  },

  {
    type: "hideTextBox",
    id: "description2",
    step: 3,
  },

  {
    type: "showNode",
    nodeIds: [
      "grandchild1",
      "grandchild2",
      "grandchild3",
      "grandchild4",
      "grandchild5",
    ],
    step: 4,
  },
  {
    type: "showAllEdges",
    nodeTypes: ["leaf"],
    step: 4,
  },
  {
    type: "showTextBox",
    id: "description3",
    text: "Based on the results, we can recursively generate\n a list of sub-challenges until we determine model's capability.",
    position: { x: 150, y: 30 },
    width: 260,
    height: 70,
    step: 4,
  },
];
