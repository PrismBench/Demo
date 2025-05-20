import { TreeNode } from "../../../../graphics/DiagramTree/data/GenericTreeTypes";

export const PHASE1_NODES: TreeNode[] = [
  {
    id: "root",
    x: 50,
    y: 120,
    type: "root",
    label: "Root Concept",
  },

  // First level children
  {
    id: "child1",
    x: 150,
    y: 70,
    parentId: "root",
    type: "child",
    label: "Challenge A",
  },
  {
    id: "child2",
    x: 150,
    y: 120,
    parentId: "root",
    type: "child",
    label: "Challenge B",
  },
  {
    id: "child3",
    x: 150,
    y: 170,
    parentId: "root",
    type: "child",
    label: "Challenge C",
  },

  // Second level - grandchildren
  {
    id: "grandchild1",
    x: 250,
    y: 50,
    parentId: "child1",
    type: "leaf",
    label: "Challenge A1 (Harder)",
  },
  {
    id: "grandchild2",
    x: 250,
    y: 90,
    parentId: "child1",
    type: "leaf",
    label: "Challenge A2 (Combination of A1 and A2)",
  },
  {
    id: "grandchild3",
    x: 250,
    y: 120,
    parentId: "child2",
    type: "leaf",
    label: "Challenge B1 (Harder)",
  },
  {
    id: "grandchild4",
    x: 250,
    y: 160,
    parentId: "child3",
    type: "leaf",
    label: "Challenge C1 (Harder)",
  },
  {
    id: "grandchild5",
    x: 250,
    y: 190,
    parentId: "child3",
    type: "leaf",
    label: "Challenge C2 (Combination of C1 and C2)",
  },
];
