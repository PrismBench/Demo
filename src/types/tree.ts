/**
 * Represents the data trail for a single node, including problem statement, test cases, solution code, and test results.
 * Used for tracking the step-by-step progress and feedback for a node in the tree.
 */
export interface NodeDataTrailData {
  /** The problem statement for this node, or null if not applicable. */
  problem_statement: string | null;
  /** The test cases associated with this node, or null if not applicable. */
  test_cases: string | null;
  /** The solution code for this node, or null if not applicable. */
  solution_code: string | null;
  /** Whether the solution was successful. */
  success: boolean;
  /** The output produced by the solution, or null if not applicable. */
  output: string | null;
  /** Number of tests passed, or null if not applicable. */
  tests_passed_num: number | null;
  /** Number of tests failed, or null if not applicable. */
  tests_failed_num: number | null;
  /** Number of tests errored, or null if not applicable. */
  tests_errored_num: number | null;
  /** Whether the problem was fixed by an automated fixer, or null if not applicable. */
  fixed_by_problem_fixer: boolean | null;
  /** The attempt number for this solution, or null if not applicable. */
  attempt_num: number | null;
  /** Error feedback message, or null if not applicable. */
  error_feedback: string | null;
}

/**
 * Represents a single node in a tree, including its relationships, metadata, and run results.
 */
export interface NodeData {
  /** Unique identifier for the node. */
  id: string;
  /** Difficulty level of the node (e.g., 'easy', 'medium', 'hard'). */
  difficulty: string;
  /** List of concepts associated with this node. */
  concepts: string[];
  /** Description of the challenge for this node. */
  challenge_description: string;
  /** List of parent node IDs, or null if this is a root node. */
  parents: string[] | null;
  /** List of child node IDs. */
  children: string[];
  /** Depth of the node in the tree. */
  depth: number;
  /** Number of times this node has been visited. */
  visits: number;
  /** Score associated with this node. */
  score: number;
  /** Phase or stage of the node (used for progression tracking). */
  phase: number;
  /** Value metric for this node (used for performance comparison). */
  value: number;
  /**
   * Array of run results for this node.
   * Each result includes whether it was successful and the associated data trail.
   */
  run_results: { success: boolean; data_trail: NodeDataTrailData[] }[];
}

/**
 * Represents the entire tree structure, including all nodes, edges, and associated metadata.
 */
export interface TreeData {
  /** List of all concepts present in the tree. */
  concepts: string[];
  /** List of all difficulty levels present in the tree. */
  difficulties: string[];
  /** Array of all nodes in the tree. */
  nodes: NodeData[];
  /**
   * Array of edges representing parent-child relationships between nodes.
   * Each edge may include a performance indicator (improved, same, decreased).
   */
  edges: {
    /** Source node ID. */
    source: string;
    /** Target node ID. */
    target: string;
    /** Optional performance indicator for the edge. */
    performance?: "improved" | "same" | "decreased";
  }[];
}

