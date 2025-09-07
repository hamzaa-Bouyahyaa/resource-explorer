"use client";

import React, { useMemo, Suspense } from "react";
import { useCharacters, useFilterState, useFavorites } from "@/hooks";
import {
  CharacterGrid,
  SearchFilterBar,
  Pagination,
} from "@/components/features";
import { Loading } from "@/components/ui";
import { sortCharacters } from "@/lib";
import { PAGINATION } from "@/constants";
import { FavoriteCharacter } from "@/types";

function HomeContent() {
  const { favorites } = useFavorites();

  // Get filter state and actions with consolidated interface
  const {
    filterState,
    filterActions,
    debouncedFilters,
    sortConfig,
    searchTerm,
    showFavoritesOnly,
    updateFilter,
    clearFilters,
  } = useFilterState();

  // Fetch characters data using debounced filters
  const { data, isLoading, isError, error, refetch } =
    useCharacters(debouncedFilters);

  // Update filter state with actual data
  const updatedFilterState = useMemo(
    () => ({
      ...filterState,
      isLoading,
      totalResults: showFavoritesOnly
        ? 0 // Will be calculated from processedCharacters
        : data?.info.count || 0,
    }),
    [filterState, isLoading, showFavoritesOnly, data?.info.count]
  );

  // Apply client-side sorting and favorites filtering to the fetched characters
  const processedCharacters = useMemo(() => {
    if (!data?.results) return [];

    let characters = [...data.results];

    // Apply favorites filter if enabled
    if (showFavoritesOnly) {
      const favoriteIds = new Set(
        favorites.map((fav: FavoriteCharacter) => fav.id)
      );
      characters = characters.filter((character) =>
        favoriteIds.has(character.id)
      );
    }

    // Apply sorting
    return sortCharacters(characters, sortConfig);
  }, [data?.results, sortConfig, showFavoritesOnly, favorites]);

  // Extract pagination and result info
  const currentPage = debouncedFilters.page || PAGINATION.DEFAULT_PAGE;
  const totalPages = data?.info.pages || 0;
  const totalItems = showFavoritesOnly
    ? processedCharacters.length
    : data?.info.count || 0;

  // Final filter state with correct totalResults
  const finalFilterState = useMemo(
    () => ({
      ...updatedFilterState,
      totalResults: totalItems,
    }),
    [updatedFilterState, totalItems]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8 sm:mb-12">
          <SearchFilterBar
            filterState={finalFilterState}
            filterActions={filterActions}
          />
        </div>

        {/* Character Grid */}
        <div className="mb-8 sm:mb-12">
          <CharacterGrid
            characters={processedCharacters}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            searchTerm={searchTerm}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          processedCharacters.length > 0 &&
          !showFavoritesOnly && (
            <div className="mt-8 sm:mt-12">
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <Loading className="w-16 h-16 mb-4" />
            <p className="text-gray-600 font-medium">Loading characters...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
