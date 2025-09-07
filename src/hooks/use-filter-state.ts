/**
 * Custom hook for managing filter state and actions
 * Provides a clean interface for SearchFilterBar component
 */

import { useMemo } from "react";
import { FilterState, FilterActions } from "@/types";
import { useUrlState } from "@/hooks";

interface UseFilterStateProps {
  isLoading?: boolean;
  totalResults?: number;
}

/**
 * Hook that consolidates filter state and actions for SearchFilterBar
 * Reduces prop drilling and improves component maintainability
 */
export function useFilterState({
  isLoading = false,
  totalResults,
}: UseFilterStateProps = {}) {
  const {
    debouncedFilters,
    sortConfig,
    hasActiveFilters,
    searchTerm,
    showFavoritesOnly,
    updateFilter,
    updateSort,
    toggleFavoritesFilter,
    clearFilters,
  } = useUrlState();

  // Memoize filter state to prevent unnecessary re-renders
  const filterState: FilterState = useMemo(
    () => ({
      searchTerm,
      status: debouncedFilters.status || "",
      gender: debouncedFilters.gender || "",
      species: debouncedFilters.species || "",
      sortConfig,
      showFavoritesOnly,
      hasActiveFilters,
      isLoading,
      totalResults,
    }),
    [
      searchTerm,
      debouncedFilters.status,
      debouncedFilters.gender,
      debouncedFilters.species,
      sortConfig,
      showFavoritesOnly,
      hasActiveFilters,
      isLoading,
      totalResults,
    ]
  );

  // Memoize filter actions to prevent unnecessary re-renders
  const filterActions: FilterActions = useMemo(
    () => ({
      onSearchChange: (value: string) => updateFilter("name", value),
      onStatusChange: (value: string) => updateFilter("status", value),
      onGenderChange: (value: string) => updateFilter("gender", value),
      onSpeciesChange: (value: string) => updateFilter("species", value),
      onSortChange: (key, direction) => updateSort({ key, direction }),
      onFavoritesToggle: toggleFavoritesFilter,
      onClearFilters: clearFilters,
    }),
    [updateFilter, updateSort, toggleFavoritesFilter, clearFilters]
  );

  return {
    filterState,
    filterActions,
    // Also return individual pieces for flexibility
    debouncedFilters,
    sortConfig,
    hasActiveFilters,
    searchTerm,
    showFavoritesOnly,
    updateFilter,
    updateSort,
    toggleFavoritesFilter,
    clearFilters,
  };
}
