/**
 * React Query configuration and setup
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Create a new QueryClient instance with optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Keep data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus only if data is stale
      refetchOnWindowFocus: "always",
      // Don't refetch on reconnect unless data is stale
      refetchOnReconnect: "always",
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

/**
 * Query keys factory for consistent key management
 */
export const queryKeys = {
  characters: {
    all: ["characters"] as const,
    lists: () => [...queryKeys.characters.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.characters.lists(), { filters }] as const,
    details: () => [...queryKeys.characters.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.characters.details(), id] as const,
  },
  episodes: {
    all: ["episodes"] as const,
    lists: () => [...queryKeys.episodes.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.episodes.lists(), { filters }] as const,
    details: () => [...queryKeys.episodes.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.episodes.details(), id] as const,
  },
  locations: {
    all: ["locations"] as const,
    lists: () => [...queryKeys.locations.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.locations.lists(), { filters }] as const,
    details: () => [...queryKeys.locations.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.locations.details(), id] as const,
  },
} as const;
