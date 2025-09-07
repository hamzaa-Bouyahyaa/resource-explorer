import { useQuery } from "@tanstack/react-query";
import { CharacterRepository, apiUtils } from "@/lib";
import { CharacterFilters, ApiResponse, Character } from "@/types";
import { queryKeys } from "@/lib/query-client";

export function useCharacters(filters: CharacterFilters = {}) {
  return useQuery({
    queryKey: queryKeys.characters.list(filters),
    queryFn: async ({ signal }) => {
      try {
        return await CharacterRepository.getCharacters(filters, signal);
      } catch (error) {
        // Check if it's a 404 "no results" error when filters are applied
        if (
          apiUtils.hasActiveFilters(filters) &&
          apiUtils.isNoResultsError(error)
        ) {
          // Return empty results instead of throwing error
          return {
            info: {
              count: 0,
              pages: 0,
              next: null,
              prev: null,
            },
            results: [],
          } as ApiResponse<Character>;
        }

        // Re-throw other errors
        throw error;
      }
    },
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
