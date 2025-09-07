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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <SearchFilterBar
            filterState={finalFilterState}
            filterActions={filterActions}
          />
        </div>

        {/* Character Grid */}
        <div className="mb-8">
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading className="w-12 h-12" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
