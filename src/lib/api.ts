import axios, { AxiosResponse } from "axios";
import {
  ApiResponse,
  Character,
  Episode,
  Location,
  CharacterFilters,
  EpisodeFilters,
  LocationFilters,
  ApiError,
} from "@/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

/**
 * Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for logging and request modification
 */
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      const apiError: ApiError = {
        error: "Not Found",
        message: "The requested resource was not found",
      };
      return Promise.reject(apiError);
    }

    if (error.code === "ECONNABORTED") {
      const apiError: ApiError = {
        error: "Timeout",
        message: "Request timed out. Please try again.",
      };
      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to build query string from filters
 */
function buildQueryString(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Character Repository
 */
export class CharacterRepository {
  /**
   * Get paginated list of characters with optional filters
   */
  static async getCharacters(
    filters: CharacterFilters = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<Character>> {
    const queryString = buildQueryString(filters);
    const url = `${API_ENDPOINTS.CHARACTERS}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<ApiResponse<Character>> = await apiClient.get(
      url,
      {
        signal,
      }
    );

    return response.data;
  }

  /**
   * Get a single character by ID
   */
  static async getCharacterById(
    id: number,
    signal?: AbortSignal
  ): Promise<Character> {
    const response: AxiosResponse<Character> = await apiClient.get(
      `${API_ENDPOINTS.CHARACTERS}/${id}`,
      { signal }
    );

    return response.data;
  }
}

/**
 * Episode Repository
 */
export class EpisodeRepository {
  /**
   * Get paginated list of episodes with optional filters
   */
  static async getEpisodes(
    filters: EpisodeFilters = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<Episode>> {
    const queryString = buildQueryString(filters);
    const url = `${API_ENDPOINTS.EPISODES}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<ApiResponse<Episode>> = await apiClient.get(
      url,
      {
        signal,
      }
    );

    return response.data;
  }

  /**
   * Get a single episode by ID
   */
  static async getEpisodeById(
    id: number,
    signal?: AbortSignal
  ): Promise<Episode> {
    const response: AxiosResponse<Episode> = await apiClient.get(
      `${API_ENDPOINTS.EPISODES}/${id}`,
      { signal }
    );

    return response.data;
  }
}

/**
 * Location Repository
 */
export class LocationRepository {
  /**
   * Get paginated list of locations with optional filters
   */
  static async getLocations(
    filters: LocationFilters = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<Location>> {
    const queryString = buildQueryString(filters);
    const url = `${API_ENDPOINTS.LOCATIONS}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<ApiResponse<Location>> = await apiClient.get(
      url,
      {
        signal,
      }
    );

    return response.data;
  }

  /**
   * Get a single location by ID
   */
  static async getLocationById(
    id: number,
    signal?: AbortSignal
  ): Promise<Location> {
    const response: AxiosResponse<Location> = await apiClient.get(
      `${API_ENDPOINTS.LOCATIONS}/${id}`,
      { signal }
    );

    return response.data;
  }
}

/**
 * Generic API utilities
 */
export const apiUtils = {
  /**
   * Extract ID from Rick & Morty API URL
   */
  extractIdFromUrl: (url: string): number => {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  },

  /**
   * Check if error is an AbortError (request was cancelled)
   */
  isAbortError: (error: unknown): boolean => {
    return error instanceof Error && error.name === "AbortError";
  },

  /**
   * Check if error is a "no results found" 404 error from the API
   */
  isNoResultsError: (error: unknown): error is ApiError => {
    return !!(
      error &&
      typeof error === "object" &&
      "error" in error &&
      (error as ApiError).error === "Not Found"
    );
  },

  /**
   * Check if filters are applied (excluding default page)
   */
  hasActiveFilters: (filters: Record<string, unknown>): boolean => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "page" && (value === 1 || value === undefined)) {
        return false; // Page 1 is default, not considered an active filter
      }
      return value !== undefined && value !== null && value !== "";
    });
  },
};
