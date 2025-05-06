/**
 * Metadata describing a model for the leaderboard or showcase.
 */
export interface ModelMeta {
  /** Unique identifier for the model. */
  id: string;
  /** Display name of the model. */
  name: string;
  /** Optional description of the model. */
  description?: string;
}

/**
 * Represents a single row in the leaderboard, containing model performance metrics.
 */
export interface LeaderboardRow {
  /** Model identifier. */
  modelId: string;
  /** Model display name. */
  modelName: string;
  /** Accuracy metric for the model. */
  accuracy: number;
  /** Runtime metric for the model. */
  runtime: number;
  /** Success rate metric for the model. */
  successRate: number;
  /** Error rate metric for the model. */
  errorRate: number;
}

/**
 * Represents a single data point for a chart, with an x and y value.
 */
export interface ChartDataPoint {
  /** X-axis value (can be a number or string label). */
  x: number | string;
  /** Y-axis value. */
  y: number;
}

/**
 * Represents a set of data points for a specific metric, used in chart visualizations.
 */
export interface ChartData {
  /** Name of the metric represented by this chart data. */
  metricName: string;
  /** Array of data points for the metric. */
  data: ChartDataPoint[];
}

/**
 * Basic aggregate metrics for a model, as found in metrics/basic/final.json.
 */
export interface BasicMetrics {
  /** Mapping from concept name to success rate (0-1). */
  success_rates_by_concept: Record<string, number>;
  /** Mapping from difficulty level to success rate (0-1). */
  success_rates_by_difficulty: Record<string, number>;
  /** Mapping from concept name to average number of attempts. */
  avg_attempts_by_concept: Record<string, number>;
  /** Mapping from difficulty level to average number of attempts. */
  avg_attempts_by_difficulty: Record<string, number>;
  /** Mapping from difficulty level to fixer intervention rate (0-1). */
  fixer_intervention_rate_difficulty: Record<string, number>;
  /** Mapping from concept name to fixer intervention rate (0-1). */
  fixer_intervention_rate_concept: Record<string, number>;
}

/**
 * Metrics for a specific concept and difficulty combination, as found in concept/final.json.
 */
export interface ConceptDifficultyMetrics {
  /** Success rate for this concept/difficulty (0-1). */
  success_rate: number;
  /** Number of visits (attempts) for this concept/difficulty. */
  visits: number;
}

/**
 * Structure of the concept metrics data, as found in concept/final.json.
 */
export interface ConceptMetricsData {
  /**
   * Nested mapping: concept name -> difficulty level -> metrics.
   * Example:
   * {
   *   "arithmetic": {
   *     "easy": { success_rate: 0.9, visits: 100 },
   *     "hard": { success_rate: 0.7, visits: 40 }
   *   },
   *   "algebra": {
   *     "medium": { success_rate: 0.8, visits: 60 }
   *   }
   * }
   */
  concept_mastery_distribution: Record<
    string,
    Record<string, ConceptDifficultyMetrics>
  >;
}

/**
 * Represents the node distribution data structured as depth -> concept -> count.
 * This is the format under the "nodes_by_concept" key in tree/final.json.
 */
export interface NodesByConceptData {
  /**
   * Nested mapping: depth level (string) -> concept name -> node count.
   * Example:
   * {
   *   "0": { "loops": 1, "conditionals": 1 },
   *   "1": { "loops": 9, "conditionals": 9 },
   *   "2": { "loops": 8.33, "conditionals": 7.33 }
   * }
   */
  [depth: string]: Record<string, number>;
}
/**
 * Represents the node distribution data structured as depth -> difficulty -> count.
 * Assumed format based on "nodes_by_difficulty" key in tree/final.json.
 */
export interface NodesByDifficultyData {
  /**
   * Nested mapping: depth level (string) -> difficulty level -> node count.
   * Example:
   * {
   *   "0": { "easy": 1, "medium": 0 },
   *   "1": { "easy": 5, "medium": 4 },
   *   "2": { "hard": 8.33 }
   * }
   */
  [depth: string]: Record<string, number>;
}

/**
 * Represents the path success rate data structured by concept.
 * Assumed format based on "path_success_by_concept" key in tree/final.json.
 */
export interface PathSuccessByConceptData {
  /**
   * Mapping: concept name -> depth -> success rate (0-1).
   * Example:
   * {
   *   "loops": {
   *     "2": 0.85,
   *     "3": 0.92
   *   },
   *   "conditionals": {
   *     "2": 0.78,
   *     "3": 0.87
   *   }
   * }
   */
  [concept: string]: Record<string, number>;
}

/**
 * Represents the combined metrics data extracted from tree/final.json.
 */
export interface TreeMetricsData {
  nodes_by_concept: NodesByConceptData;
  nodes_by_difficulty: NodesByDifficultyData;
  path_success_by_concept: PathSuccessByConceptData;
}

/**
 * Represents the error distribution data from error_metrics.json.
 */
export interface ErrorDistribution {
  logic_errors: number;
  implementation_errors: number;
  edge_case_errors: number;
  test_setup_errors: number;
}

/**
 * Represents a single concept-difficulty error analysis entry from error_metrics.json.
 */
export interface ErrorAnalysisEntry {
  /** Success rate for this concept/difficulty (0-1). */
  success_rate: number;
  /** Average number of attempts for this concept/difficulty. */
  avg_attempts: number;
  /** Mapping of error pattern name to occurrence count. */
  error_patterns: Record<string, number>;
  /** Distribution of errors by category. */
  error_distribution: ErrorDistribution;
}

/**
 * Represents the comparative analysis data from error_metrics.json.
 * Keys are in the format of "concept-concept-concept-difficulty".
 * Example: "conditionals-data_structures-error_handling-loops-very hard"
 */
export interface ErrorMetricsData {
  [conceptDifficultyKey: string]: ErrorAnalysisEntry;
}

/**
 * Represents a single concept-difficulty pattern analysis entry from pattern_metrics.json.
 */
export interface PatternAnalysisEntry {
  /** Success rate for this concept/difficulty (0-1). */
  success_rate: number;
  /** Average number of attempts for this concept/difficulty. */
  avg_attempts: number;
  /** Mapping of pattern name to occurrence count. */
  patterns: Record<string, number>;
  /** Distribution of patterns by category. */
  pattern_distribution: Record<string, number>;
}

/**
 * Represents the comparative analysis data from pattern_metrics.json.
 * Keys are in the format of "concept-concept-concept-difficulty".
 * Example: "conditionals-data_structures-error_handling-loops-very hard"
 */
export interface PatternMetricsData {
  [conceptDifficultyKey: string]: PatternAnalysisEntry;
}
