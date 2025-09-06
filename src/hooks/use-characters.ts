/**
 * Custom hook for character data fetching with React Query
 */

import { useQuery } from "@tanstack/react-query";
import { CharacterRepository } from "@/lib";
import { CharacterFilters } from "@/types";
import { queryKeys } from "@/lib/query-client";

/**
 * Hook to fetch paginated characters with filters
 */
export function useCharacters(filters: CharacterFilters = {}) {
  return useQuery({
    queryKey: queryKeys.characters.list(filters),
    queryFn: ({ signal }) => CharacterRepository.getCharacters(filters, signal),
    // Keep previous data while fetching new data for better UX
    placeholderData: (previousData) => previousData,
    // Refetch when filters change
    refetchOnMount: true,
  });
}

/**
 * Hook to fetch a single character by ID
 */
export function useCharacter(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.characters.detail(id),
    queryFn: ({ signal }) => CharacterRepository.getCharacterById(id, signal),
    enabled: enabled && id > 0,
    // Character data doesn't change often, so we can cache it longer
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch multiple characters by IDs (for favorites)
 */
export function useCharactersByIds(ids: number[], enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.characters.list({ ids: ids.join(",") }),
    queryFn: ({ signal }) =>
      CharacterRepository.getCharactersByIds(ids, signal),
    enabled: enabled && ids.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
