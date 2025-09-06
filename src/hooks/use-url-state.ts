/**
 * Custom hook for URL state management with debouncing
 * Implements the Observer pattern for URL state synchronization
 * Uses Command pattern for filter updates
 */

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CharacterFilters, SortConfig } from "@/types";
import { PAGINATION, SEARCH_DEBOUNCE_MS } from "@/constants";
import { useDebounce } from "./use-debounce";

/**
 * Filter update types for type safety
 */
type FilterKey = keyof Omit<CharacterFilters, "page">;
type FilterValue = string | null | undefined;

/**
 * Sort update payload
 */
interface SortUpdate {
  key?: SortConfig["key"];
  direction?: SortConfig["direction"];
}

/**
 * Hook for managing URL state with automatic synchronization
 */
export function useUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract current filters from URL
  const filters: CharacterFilters = useMemo(() => {
    const page = searchParams.get("page");
    const name = searchParams.get("q");
    const status = searchParams.get("status");
    const species = searchParams.get("species");
    const gender = searchParams.get("gender");
    const type = searchParams.get("type");

    return {
      page: page ? parseInt(page, 10) : PAGINATION.DEFAULT_PAGE,
      name: name || undefined,
      status: (status as CharacterFilters["status"]) || undefined,
      species: species || undefined,
      gender: (gender as CharacterFilters["gender"]) || undefined,
      type: type || undefined,
    };
  }, [searchParams]);

  // Extract sort configuration from URL
  const sortConfig: SortConfig = useMemo(() => {
    const sortBy = searchParams.get("sortBy") || "name";
    const sortDir = searchParams.get("sortDir") || "asc";

    return {
      key: sortBy as SortConfig["key"],
      direction: sortDir as SortConfig["direction"],
    };
  }, [searchParams]);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(
    filters.name || "",
    SEARCH_DEBOUNCE_MS
  );

  // Create debounced filters for API calls
  const debouncedFilters: CharacterFilters = useMemo(
    () => ({
      ...filters,
      name: debouncedSearchTerm || undefined,
    }),
    [filters, debouncedSearchTerm]
  );

  /**
   * Generic filter update function using Command pattern
   * Handles all filter updates with a single, optimized function
   */
  const updateFilter = useCallback(
    (key: FilterKey | "page", value: FilterValue | number) => {
      const updates: Record<string, string | number | null | undefined> = {};

      // Map filter keys to URL parameter names
      const keyMapping: Record<string, string> = {
        name: "q",
        status: "status",
        species: "species",
        gender: "gender",
        type: "type",
        page: "page",
      };

      const urlKey = keyMapping[key] || key;
      updates[urlKey] = value || null;

      const params = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(updates).forEach(([paramKey, paramValue]) => {
        if (
          paramValue === null ||
          paramValue === undefined ||
          paramValue === ""
        ) {
          params.delete(paramKey);
        } else {
          params.set(paramKey, String(paramValue));
        }
      });

      // Reset to first page when filters change (unless page is explicitly updated)
      if (key !== "page") {
        params.delete("page");
      }

      const newUrl = `/?${params.toString()}`;
      router.push(newUrl);
    },
    [router, searchParams]
  );

  /**
   * Update sort configuration
   */
  const updateSort = useCallback(
    (sortUpdate: SortUpdate) => {
      const params = new URLSearchParams(searchParams.toString());

      if (sortUpdate.key) {
        params.set("sortBy", sortUpdate.key);
      }

      if (sortUpdate.direction) {
        params.set("sortDir", sortUpdate.direction);
      }

      const newUrl = `/?${params.toString()}`;
      router.push(newUrl);
    },
    [router, searchParams]
  );

  /**
   * Clear all filters and reset to defaults
   */
  const clearFilters = useCallback(() => {
    router.push("/");
  }, [router]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.name ||
      filters.status ||
      filters.species ||
      filters.gender ||
      filters.type ||
      sortConfig.key !== "name" ||
      sortConfig.direction !== "asc"
    );
  }, [filters, sortConfig]);

  return {
    // Current state
    filters,
    debouncedFilters,
    sortConfig,
    hasActiveFilters,

    // Optimized update functions
    updateFilter,
    updateSort,
    clearFilters,

    // Raw search term (not debounced) for input display
    searchTerm: filters.name || "",
  };
}
