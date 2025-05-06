import {
  ModelMeta,
  BasicMetrics,
  ConceptMetricsData,
  TreeMetricsData,
  ErrorMetricsData,
  PatternMetricsData,
} from "../types";
import { fetchData } from "./utils";

const API_BASE_URL = `${import.meta.env.BASE_URL}api`; // Uses Vite base path for GitHub Pages

/**
 * leaderboardService.ts
 *
 * Provides API functions for fetching leaderboard-related data for the Prism Interface.
 *
 * - Fetches available models, basic metrics, concept metrics, and combined capability data.
 * - All functions use fetchData for consistent error handling and response parsing.
 *
 * Usage:
 *   import { fetchModels, fetchModelBasicMetrics, fetchModelConceptMetrics, fetchCapabilityData, fetchModelTreeMetrics, fetchModelErrorMetrics } from './leaderboardService';
 */

/**
 * Fetches the list of available models.
 *
 * @returns {Promise<ModelMeta[]>} Promise resolving to an array of model metadata objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchModels = async (): Promise<ModelMeta[]> => {
  return fetchData<ModelMeta[]>(`${API_BASE_URL}/models.json`);
};

/**
 * Fetches the basic metrics data for a specific model.
 *
 * @param {string} modelId - The ID of the model.
 * @returns {Promise<BasicMetrics>} Promise resolving to the basic metrics data for the model.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchModelBasicMetrics = async (
  modelId: string
): Promise<BasicMetrics> => {
  return fetchData<BasicMetrics>(
    `${API_BASE_URL}/models/${modelId}/metrics/basic/final.json`
  );
};

/**
 * Fetches the concept metrics data (including difficulty breakdown) for a specific model.
 *
 * @param {string} modelId - The ID of the model.
 * @returns {Promise<ConceptMetricsData>} Promise resolving to the concept metrics data for the model.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchModelConceptMetrics = async (
  modelId: string
): Promise<ConceptMetricsData> => {
  return fetchData<ConceptMetricsData>(
    `${API_BASE_URL}/models/${modelId}/metrics/concept/final.json`
  );
};

/**
 * Fetches the combined capability data for all models from capability.json.
 *
 * @returns {Promise<Record<string, ConceptMetricsData>>} Promise resolving to a record mapping model IDs to their concept metrics data.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchCapabilityData = async (): Promise<
  Record<string, ConceptMetricsData>
> => {
  return fetchData<Record<string, ConceptMetricsData>>(
    `${API_BASE_URL}/capability.json`
  );
};

/**
 * Fetches the tree metrics data (nodes_by_concept, nodes_by_difficulty, path_success_by_concept)
 * for a specific model from metrics/tree/final.json.
 *
 * @param {string} modelId - The ID of the model.
 * @returns {Promise<TreeMetricsData>} Promise resolving to an object containing the required tree metrics data.
 * @throws {Error} If the network request fails, the response is not OK, or the required keys are missing in the JSON data.
 */
export const fetchModelTreeMetrics = async (
  modelId: string
): Promise<TreeMetricsData> => {
  const url = `${API_BASE_URL}/models/${modelId}/metrics/tree/final.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawText = await response.text();

    let parsedJson: any;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse JSON from:", url, parseError);
      const message =
        parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Failed to parse JSON from ${url}: ${message}`);
    }

    // Validate that the required keys exist
    const requiredKeys: (keyof TreeMetricsData)[] = [
      "nodes_by_concept",
      "nodes_by_difficulty",
      "path_success_by_concept",
    ];
    const missingKeys = requiredKeys.filter((key) => !(key in parsedJson));

    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required keys in ${url}: ${missingKeys.join(", ")}`
      );
    }

    // Construct the result object with proper typing
    const result: TreeMetricsData = {
      nodes_by_concept: parsedJson.nodes_by_concept,
      nodes_by_difficulty: parsedJson.nodes_by_difficulty,
      path_success_by_concept: parsedJson.path_success_by_concept,
    };

    return result;
  } catch (error) {
    console.error(
      "Error fetching or processing tree metrics from:",
      url,
      error
    );
    const message = error instanceof Error ? error.message : String(error);
    // Include modelId in the re-thrown error for better context
    throw new Error(`Failed for ${modelId}: ${message}`);
  }
};

/**
 * Fetches the error metrics data from the error_metrics.json file for a specific model.
 * Retrieves the data in the comparative_analysis key.
 *
 * @param {string} modelId - The ID of the model.
 * @returns {Promise<ErrorMetricsData>} Promise resolving to the error metrics data for the model.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchModelErrorMetrics = async (
  modelId: string
): Promise<ErrorMetricsData> => {
  const data = await fetchData<any>(
    `${API_BASE_URL}/models/${modelId}/metrics/error/error_metrics.json`
  );

  // Extract the comparative_analysis data
  if (!data.comparative_analysis) {
    throw new Error(`No comparative_analysis data found for model ${modelId}`);
  }

  return data.comparative_analysis;
};

/**
 * Fetches the pattern metrics data from the pattern_metrics.json file for a specific model.
 * Retrieves the data in the comparative_analysis key.
 *
 * @param {string} modelId - The ID of the model.
 * @returns {Promise<PatternMetricsData>} Promise resolving to the pattern metrics data for the model.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchModelPatternMetrics = async (
  modelId: string
): Promise<PatternMetricsData> => {
  const data = await fetchData<any>(
    `${API_BASE_URL}/models/${modelId}/metrics/pattern/pattern_metrics.json`
  );

  // Extract the comparative_analysis data
  if (!data.comparative_analysis) {
    throw new Error(`No comparative_analysis data found for model ${modelId}`);
  }

  return data.comparative_analysis;
};

// Fetch tree metrics for all models
export const fetchTreeMetrics = async (): Promise<
  Record<string, TreeMetricsData>
> => {
  try {
    const models = await fetchModels();
    const treeMetricsData: Record<string, TreeMetricsData> = {};

    // Fetch tree metrics for each model
    await Promise.all(
      models.map(async (model) => {
        const data = await fetchModelTreeMetrics(model.id);
        treeMetricsData[model.id] = data;
      })
    );

    return treeMetricsData;
  } catch (error) {
    console.error("Error fetching tree metrics:", error);
    throw error;
  }
};
