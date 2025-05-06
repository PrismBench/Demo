/**
 * utils.ts
 *
 * Provides utility functions for API data fetching and error handling in the Prism Interface.
 *
 * - Centralizes fetch logic and error handling for API requests.
 * - Used by all service modules to ensure consistent error reporting and response parsing.
 *
 * Usage:
 *   import { fetchData } from './utils';
 */

/**
 * Helper function for fetching JSON data from a given URL with error handling.
 *
 * @template T The expected type of the response data.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<T>} Promise resolving to the parsed JSON data of type T.
 * @throws {Error} If the network request fails or the response is not OK (non-2xx status).
 */
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from:", url, error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export { fetchData };
