import {
  PHASE1_NODES,
  PHASE1_STEPS,
  PHASE1_CONFIG,
} from "./solution/phases/phase1";

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
        treeNodes: PHASE1_NODES,
        animationSteps: PHASE1_STEPS,
        config: PHASE1_CONFIG,
        stepDescriptions: [
          "We start with a root concept.",
          "From this concept, we generate a list of challenges.",
          "Each challenge is then executed in a sandbox.",
          "The results are then used to generate a list of sub-challenges.",
          "This is done until the model's performance stops improving.",
        ],
      },
    ],
  },
  {
    title: "Phase 3: Edge Case Analysis",
    description:
      "Once the root causes are identified, we can use the execution traces to thoroughly understand why the model fails to solve the edge cases.",
    expandButtonText: "Explore Analysis",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Phase 3: Edge Case Analysis",
        description:
          "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
        treeNodes: PHASE1_NODES,
        animationSteps: PHASE1_STEPS,
        config: PHASE1_CONFIG,
        stepDescriptions: [
          "We start with a root concept.",
          "From this concept, we generate a list of challenges.",
          "Each challenge is then executed in a sandbox.",
          "The results are then used to generate a list of sub-challenges.",
          "This is done until the model's performance stops improving.",
        ],
      },
    ],
  },
  {
    title: "Interaction Sandbox",
    description:
      "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
    expandButtonText: "Explore Comparison",
    collapseButtonText: "Return to Overview",
    phases: [
      {
        title: "Interaction Sandbox",
        description:
          "In this phase, we are interested in mapping the edge of the model's capabilities. For each successful task, we create a new task from it either with new concepts or higher difficulty. This is done until the model's performance stops improving.",
        treeNodes: PHASE1_NODES,
        animationSteps: PHASE1_STEPS,
        config: PHASE1_CONFIG,
        stepDescriptions: [
          "We start with a root concept.",
          "From this concept, we generate a list of challenges.",
          "Each challenge is then executed in a sandbox.",
          "The results are then used to generate a list of sub-challenges.",
          "This is done until the model's performance stops improving.",
        ],
      },
    ],
  },
];
