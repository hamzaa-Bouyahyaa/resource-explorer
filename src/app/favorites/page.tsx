"use client";

import React, { useState, useMemo } from "react";
import { useFavoritesList, useFavoritesPersistence } from "@/hooks";
import { CharacterCard } from "@/components/features/character-card";
import { LoadingSpinner, EmptyState } from "@/components/ui";
import { Character } from "@/types";

type SortOption = "name" | "addedAt" | "status";

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("addedAt");
  const [showStatistics, setShowStatistics] = useState(false);

  const {
    count,
    isEmpty,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="w-16 h-16 mb-4" />
          <p className="text-gray-600 font-medium">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-800 bg-clip-text text-transparent">
                My Favorites
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Characters you&apos;ve marked as favorites will appear here
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-800 bg-clip-text text-transparent">
                  My Favorites
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                {count} favorite character{count !== 1 ? "s" : ""} in your
                collection
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {showStatistics ? "Hide" : "Show"} Stats
              </button>
              <button
                onClick={() => downloadFavorites("json")}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Export JSON
              </button>
              <button
                onClick={() => downloadFavorites("csv")}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Export CSV
              </button>
              <button
                onClick={clearFavorites}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStatistics && (
          <div className="mb-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Collection Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <p className="text-blue-700 font-semibold mb-2">
                  Total Favorites
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {statistics.total}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <p className="text-green-700 font-semibold mb-2">
                  Alive Characters
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {statistics.byStatus.Alive || 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                <p className="text-red-700 font-semibold mb-2">
                  Dead Characters
                </p>
                <p className="text-3xl font-bold text-red-900">
                  {statistics.byStatus.Dead || 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <p className="text-gray-700 font-semibold mb-2">
                  Unknown Status
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics.byStatus.unknown || 0}
                </p>
              </div>
            </div>

            {statistics.mostRecentlyAdded && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                <p className="text-purple-700 font-semibold mb-3">
                  Most Recently Added
                </p>
                <p className="text-purple-900 font-bold text-lg">
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
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 group">
              <label htmlFor="search" className="sr-only">
                Search favorites
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl placeholder-gray-400 text-gray-900 font-medium bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="sm:w-56 group">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white transition-all duration-300 appearance-none shadow-sm hover:shadow-md focus:shadow-lg"
                >
                  <option value="addedAt">Recently Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="status">Status</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
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
