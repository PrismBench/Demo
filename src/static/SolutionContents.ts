import {
  PHASE1_NODES,
  PHASE1_STEPS,
  PHASE1_CONFIG,
} from "./solution/phases/phase1";
import {
  PHASE2_NODES,
  PHASE2_STEPS,
  PHASE2_CONFIG,
} from "./solution/phases/phase2";
import {
  PHASE3_NODES,
  PHASE3_STEPS,
  PHASE3_CONFIG,
} from "./solution/phases/phase3";
import {
  PHASE4_NODES,
  PHASE4_STEPS,
  PHASE4_CONFIG,
  PHASE4_HAS_SVG,
} from "./solution/phases/phase4";

export const phaseCards = [
  {
    title: "Phase 1: Capability Mapping",
    description:
      "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
    expandButtonText: "Explore Assessment",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Phase 1: Capability Mapping",
        description:
          "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
        treeNodes: PHASE1_NODES,
        animationSteps: PHASE1_STEPS,
        config: PHASE1_CONFIG,
        stepDescriptions: [
          "We start with a root concept. These concepts are programming challenges similar to those on LeetCode (Algorithms, DP, etc.).",
          "From this concept, we generate a list of challenges.",
          "Each challenge is then executed in a sandbox.",
          "The results are then used to generate a list of sub-challenges.",
          "This is done until the model's performance stops improving.",
        ],
      },
    ],
  },
  {
    title: "Phase 2: Vulnerability Probing",
    description:
      "This phase builds upon the results of the previous phase. Now that we have identified the edge of the model's capabilities, in this phase our aim is to identify the root cause of the model's failure. We do this by probing the model with edge cases.",
    expandButtonText: "Explore Vulnerabilities",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Phase 2: Vulnerability Probing",
        description:
          "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
        treeNodes: PHASE2_NODES,
        animationSteps: PHASE2_STEPS,
        config: PHASE2_CONFIG,
        stepDescriptions: [
          "We start from the tree from Phase 1. Here, we select the nodes where the model recieved low rewards as the starting point.",
          "From these nodes, we generate a list of sub-challenges where each sub-challenge is a meant to pinpoint the exact scenarios where the model fails consistently.",
          "Each sub-challenge is then executed in a sandbox. We then use the collected performance signals to determine which areas the model is weak in and recursively generate more sub-challenges until we determine the exact areas where the model performs poorly.",
        ],
      },
    ],
  },
  {
    title: "Phase 3: Edge Case Analysis",
    description:
      "In this phase, we leverage the tree from Phase 2 to identify the root causes of failure. By analyzing execution traces and generating variations of the challenges, we can gain a deeper understanding of why the model struggles with specific edge cases.",
    expandButtonText: "Explore Analysis",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Phase 3: Edge Case Analysis",
        description:
          "In this phase, we leverage the tree from Phase 2 to identify the root causes of failure. By analyzing execution traces and generating variations of the challenges, we can gain a deeper understanding of why the model struggles with specific edge cases.",
        treeNodes: PHASE3_NODES,
        animationSteps: PHASE3_STEPS,
        config: PHASE3_CONFIG,
        stepDescriptions: [
          "We start from the tree from Phase 2. Here, we select the nodes where the model recieved low rewards as the starting point.",
          "However, instead of combining nodes, we create variations of challenges from the same concept and difficulty as the selected node.",
          "This way, we pinpoint whether low performance is due to the model's inability to handle the specific challenge or due to the model's inability to handle the concept.",
        ],
      },
    ],
  },
  {
    title: "Interaction Sandbox",
    description:
      "Each node is evaluated in isolation, with separate agents handling challenge solving, test creation, and debugging. The same model generates both solutions and tests, without access to each other's work, ensuring fair and realistic assessment. This approach allows us to measure each capability independently and compare models consistently.",
    expandButtonText: "The Interaction Sandbox",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Interaction Sandbox",
        description:
          "Each node is evaluated in a sandboxed environment, where separate agents handle different steps like challenge solving, test creation, and debugging. To ensure fairness, agents only share information through the node's state, and the same model is used for both writing solutions and tests—without access to each other's work. This setup mirrors real-world programming, requiring the model to understand tasks, create valid tests and solutions, and fix errors using feedback, all without hidden information. By isolating these steps, we can accurately measure each capability and compare models consistently.",
        treeNodes: PHASE4_NODES,
        animationSteps: PHASE4_STEPS,
        config: PHASE4_CONFIG,
        hasSvg: PHASE4_HAS_SVG,
        stepDescriptions: [
          "We start with the Challenge Designer agent that creates programming tasks based on concepts and difficulty levels.",
          "The challenge is processed by two independent agents: Test Generator and Problem Solver. Each agent works in isolation, without access to each other's outputs.",
          "The Program to Run combines the solution and tests and executes them. The run rseults (whether success or failure) are then analyzed by analyzer agents. This sandbox approach mirrors real-world programming scenarios and enables fair assessment.",
        ],
      },
    ],
  },
];
