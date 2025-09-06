"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useCharacters, useUrlState, useFavorites } from "@/hooks";
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const {
    debouncedFilters,
    sortConfig,
    hasActiveFilters,
    searchTerm,
    updateFilter,
    updateSort,
    clearFilters,
  } = useUrlState();

  const { favorites } = useFavorites();

  // Fetch characters data using debounced filters
  const { data, isLoading, isError, error, refetch } =
    useCharacters(debouncedFilters);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={setShowFavoritesOnly}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            isLoading={isLoading}
            totalResults={totalItems}
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
