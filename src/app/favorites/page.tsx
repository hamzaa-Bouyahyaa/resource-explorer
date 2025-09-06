/**
 * Favorites page - displays user's favorite characters
 */

"use client";

import React, { useState, useMemo } from "react";
import { useFavoritesList, useFavoritesPersistence } from "@/hooks";
import { CharacterCard } from "@/components/features/character-card";
import { Loading, EmptyState } from "@/components/ui";
import { LabeledFavoriteButton } from "@/components/ui/favorite-button";
import { Character } from "@/types";

type SortOption = "name" | "addedAt" | "status";

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("addedAt");
  const [showStatistics, setShowStatistics] = useState(false);

  const {
    favorites,
    count,
    isEmpty,
    hasData,
    isLoading,
    getFilteredFavorites,
    getStatistics,
    clearFavorites,
  } = useFavoritesList();

  const { downloadFavorites } = useFavoritesPersistence();

  // Filter and sort favorites based on current settings
  const displayedFavorites = useMemo(() => {
    return getFilteredFavorites(searchQuery, sortBy);
  }, [getFilteredFavorites, searchQuery, sortBy]);

  const statistics = useMemo(() => {
    return getStatistics();
  }, [getStatistics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600">
              Characters you've marked as favorites will appear here
            </p>
          </div>

          {/* Empty state */}
          <EmptyState
            title="No favorites yet"
            description="Start exploring characters and add some to your favorites!"
            actionLabel="Browse Characters"
            actionHref="/"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Favorites
              </h1>
              <p className="text-gray-600">
                {count} favorite character{count !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showStatistics ? "Hide" : "Show"} Stats
              </button>
              <button
                onClick={() => downloadFavorites("json")}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => downloadFavorites("csv")}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={clearFavorites}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStatistics && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-600 font-medium">Total Favorites</p>
                <p className="text-2xl font-bold text-blue-900">
                  {statistics.total}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-600 font-medium">Alive Characters</p>
                <p className="text-2xl font-bold text-green-900">
                  {statistics.byStatus.Alive || 0}
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-600 font-medium">Dead Characters</p>
                <p className="text-2xl font-bold text-red-900">
                  {statistics.byStatus.Dead || 0}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 font-medium">Unknown Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.byStatus.unknown || 0}
                </p>
              </div>
            </div>

            {statistics.mostRecentlyAdded && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-600 font-medium mb-2">
                  Most Recently Added
                </p>
                <p className="text-purple-900 font-semibold">
                  {statistics.mostRecentlyAdded.name}
                </p>
                <p className="text-purple-700 text-sm">
                  Added{" "}
                  {new Date(
                    statistics.mostRecentlyAdded.addedAt
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search favorites
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="sm:w-48">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="addedAt">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {displayedFavorites.length} of {count} favorites
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {displayedFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedFavorites.map((favorite) => {
              // Convert FavoriteCharacter back to Character for the card
              const character: Character = {
                id: favorite.id,
                name: favorite.name,
                image: favorite.image,
                status: favorite.status,
                species: favorite.species,
                type: "", // Not stored in favorites
                gender: "unknown", // Not stored in favorites
                origin: { name: "Unknown", url: "" },
                location: { name: "Unknown", url: "" },
                episode: [],
                url: "",
                created: "",
              };

              return (
                <CharacterCard
                  key={favorite.id}
                  character={character}
                  className="transform hover:scale-105 transition-transform duration-200"
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No matching favorites"
            description={`No favorites found matching "${searchQuery}"`}
            actionLabel="Clear Search"
            onAction={() => setSearchQuery("")}
          />
        )}
      </div>
    </div>
  );
}
