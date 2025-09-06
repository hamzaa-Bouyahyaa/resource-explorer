"use client";

import React, { useMemo } from "react";
import { useCharacters, useUrlState } from "@/hooks";
import {
  CharacterGrid,
  SearchFilterBar,
  Pagination,
} from "@/components/features";
import { sortCharacters } from "@/lib";
import { PAGINATION } from "@/constants";

export default function Home() {
  const {
    debouncedFilters,
    sortConfig,
    hasActiveFilters,
    searchTerm,
    updateFilter,
    updateSort,
    clearFilters,
  } = useUrlState();

  // Fetch characters data using debounced filters
  const { data, isLoading, isError, error, refetch } =
    useCharacters(debouncedFilters);

  // Apply client-side sorting to the fetched characters
  const sortedCharacters = useMemo(() => {
    if (!data?.results) return [];
    return sortCharacters(data.results, sortConfig);
  }, [data?.results, sortConfig]);

  // Extract pagination and result info
  const currentPage = debouncedFilters.page || PAGINATION.DEFAULT_PAGE;
  const totalPages = data?.info.pages || 0;
  const totalItems = data?.info.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resource Explorer
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Explore characters from the Rick and Morty universe
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(value) => updateFilter("name", value)}
            status={debouncedFilters.status || ""}
            onStatusChange={(value) => updateFilter("status", value)}
            gender={debouncedFilters.gender || ""}
            onGenderChange={(value) => updateFilter("gender", value)}
            species={debouncedFilters.species || ""}
            onSpeciesChange={(value) => updateFilter("species", value)}
            sortConfig={sortConfig}
            onSortChange={(key, direction) => updateSort({ key, direction })}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            isLoading={isLoading}
            totalResults={totalItems}
          />
        </div>

        {/* Character Grid */}
        <div className="mb-8">
          <CharacterGrid
            characters={sortedCharacters}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            searchTerm={searchTerm}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Pagination */}
        {!isLoading && !isError && sortedCharacters.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
              onPageChange={(page) => updateFilter("page", page)}
              showInfo={true}
            />
          </div>
        )}
      </main>
    </div>
  );
}
