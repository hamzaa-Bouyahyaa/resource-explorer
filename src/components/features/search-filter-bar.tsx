import React from "react";
import { SearchInput } from "./search-input";
import { StatusFilter, GenderFilter, SpeciesFilter } from "./filter-dropdown";
import { SortDropdown } from "./sort-dropdown";
import { FavoritesFilter } from "./favorites-filter";
import { SortConfig, SortOption, SortDirection } from "@/types";

interface SearchFilterBarProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;

  // Filters
  status: string;
  onStatusChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  species: string;
  onSpeciesChange: (value: string) => void;

  // Sort
  sortConfig: SortConfig;
  onSortChange: (key: SortOption, direction: SortDirection) => void;

  // Favorites filter
  showFavoritesOnly?: boolean;
  onFavoritesToggle?: (showFavoritesOnly: boolean) => void;

  // Clear filters
  hasActiveFilters: boolean;
  onClearFilters: () => void;

  // Loading state
  isLoading?: boolean;

  // Results info
  totalResults?: number;

  className?: string;
}

/**
 * Combined search and filter bar component
 */
export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  gender,
  onGenderChange,
  species,
  onSpeciesChange,
  sortConfig,
  onSortChange,
  showFavoritesOnly,
  onFavoritesToggle,
  hasActiveFilters,
  onClearFilters,
  isLoading = false,
  totalResults,
  className = "",
}: SearchFilterBarProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search characters by name..."
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {/* Filters and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatusFilter
          value={status}
          onChange={onStatusChange}
          disabled={isLoading}
        />

        <GenderFilter
          value={gender}
          onChange={onGenderChange}
          disabled={isLoading}
        />

        <SpeciesFilter
          value={species}
          onChange={onSpeciesChange}
          disabled={isLoading}
        />

        <SortDropdown
          sortConfig={sortConfig}
          onSortChange={onSortChange}
          disabled={isLoading}
        />
      </div>

      {/* Favorites Filter */}
      {onFavoritesToggle && (
        <div className="mb-4">
          <FavoritesFilter
            showFavoritesOnly={showFavoritesOnly || false}
            onToggle={onFavoritesToggle}
            className="w-fit"
          />
        </div>
      )}

      {/* Results Info and Clear Filters */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          {totalResults !== undefined && (
            <span>
              {isLoading
                ? "Loading..."
                : `${totalResults} character${
                    totalResults !== 1 ? "s" : ""
                  } found`}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              disabled={isLoading}
              className={`
                inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md
                text-sm font-medium text-gray-700 bg-white
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
              aria-label="Clear all filters"
            >
              <svg
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
