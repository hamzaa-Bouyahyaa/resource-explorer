import React from "react";
import { Character } from "@/types";
import { CharacterCard } from "./character-card";
import { Loading, NoResultsFound } from "@/components/ui";

interface CharacterGridProps {
  characters: Character[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  searchTerm?: string;
  onClearFilters?: () => void;
  className?: string;
}

export function CharacterGrid({
  characters,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  searchTerm,
  onClearFilters,
  className = "",
}: CharacterGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Loading key={index} variant="card" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load characters
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the character data.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (characters.length === 0) {
    return (
      <div className={className}>
        <NoResultsFound
          searchTerm={searchTerm}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  // Success state with data
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
