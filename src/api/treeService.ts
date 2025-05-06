import { TreeData, NodeData, ModelMeta, TreeMeta } from "../types";
import { fetchData } from "./utils";

const API_BASE_URL = `${import.meta.env.BASE_URL}api`; // Uses Vite base path for GitHub Pages

/**
 * treeService.ts
 *
 * Provides API functions for fetching model and tree data for the Prism Interface showcase.
 *
 * - Fetches available models and their trees from static JSON endpoints.
 * - Fetches and processes tree data, including building edges if not present.
 *
 * Usage:
 *   import { fetchShowcaseModels, fetchTreesForModel, fetchTreeData } from './treeService';
 *
 * All functions throw on network or parsing errors (except 404 for trees, which returns an empty array).
 */

/**
 * Fetches the list of available models for the showcase.
 *
 * @returns {Promise<ModelMeta[]>} Promise resolving to an array of model metadata objects.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchShowcaseModels = async (): Promise<ModelMeta[]> => {
  return fetchData<ModelMeta[]>(`${API_BASE_URL}/models.json`);
};

/**
 * Fetches the list of available trees for a specific model.
 *
 * Assumes a `trees.json` file exists in `/api/models/{modelId}/trees/`.
 *
 * @param {string} modelId - The ID of the model to fetch trees for.
 * @returns {Promise<TreeMeta[]>} Promise resolving to an array of tree metadata objects.
 *   Returns an empty array if no trees.json is found (404).
 * @throws {Error} If the network request fails for reasons other than 404.
 */
export const fetchTreesForModel = async (
  modelId: string
): Promise<TreeMeta[]> => {
  return fetchData<TreeMeta[]>(
    `${API_BASE_URL}/models/${modelId}/trees/trees.json`
  );
};

/**
 * Fetches and processes tree data for a given model and tree file.
 *
 * - If the tree data does not include edges, they are constructed from parent-child relationships.
 * - Edge performance is determined by comparing node values ("improved", "same", or "decreased").
 *
 * @param {string} modelId - The ID of the model.
 * @param {string} treeFile - The filename of the tree JSON to fetch (e.g., 'tree1.json').
 * @returns {Promise<TreeData>} Promise resolving to the tree data object, with edges populated.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const fetchTreeData = async (
  modelId: string,
  treeFile: string
): Promise<TreeData> => {
  const data = await fetchData<TreeData>(
    `${API_BASE_URL}/models/${modelId}/trees/${treeFile}`
  );
  // Build edges from parent-child relationships if not already in the data
  if (!data.edges) {
    // For each node, create an edge for each child, and determine performance
    const edges = data.nodes.flatMap((node: NodeData) =>
      (node.children || []).map((childId: string) => {
        const childNode = data.nodes.find((n: NodeData) => n.id === childId);

        let performance: "improved" | "same" | "decreased" = "same";
        if (
          childNode &&
          node.value !== undefined &&
          childNode.value !== undefined
        ) {
          if (childNode.value > node.value) {
            performance = "improved";
          } else if (childNode.value < node.value) {
            performance = "decreased";
          }
        }

        return {
          source: node.id,
          target: childId,
          performance,
        };
      })
    );

    data.edges = edges;
  }

  return data;
};
