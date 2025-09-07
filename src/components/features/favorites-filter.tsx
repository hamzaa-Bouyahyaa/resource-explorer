/**
 * Favorites filter component for filtering characters by favorite status
 */

"use client";

import React from "react";
import { useFavorites } from "@/hooks";

interface FavoritesFilterProps {
  showFavoritesOnly: boolean;
  onToggle: (showFavoritesOnly: boolean) => void;
  className?: string;
}

/**
 * Toggle filter for showing only favorite characters
 */
export function FavoritesFilter({
  showFavoritesOnly,
  onToggle,
  className = "",
}: FavoritesFilterProps) {
  const { count } = useFavorites();

  const handleToggle = () => {
    onToggle(!showFavoritesOnly);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            showFavoritesOnly
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          }
        `}
        disabled={count === 0}
        title={
          count === 0
            ? "No favorites to filter"
            : showFavoritesOnly
            ? "Show all characters"
            : "Show only favorites"
        }
      >
        {/* Heart Icon */}
        <svg
          className="w-4 h-4"
          fill={showFavoritesOnly ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={showFavoritesOnly ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>

        <span>{showFavoritesOnly ? "Favorites Only" : "Show Favorites"}</span>

        {count > 0 && (
          <span
            className={`
              px-1.5 py-0.5 rounded-full text-xs font-bold
              ${
                showFavoritesOnly
                  ? "bg-red-200 text-red-800"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {count}
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * Compact favorites filter for mobile
 */
export function CompactFavoritesFilter({
  showFavoritesOnly,
  onToggle,
  className = "",
}: FavoritesFilterProps) {
  const { count } = useFavorites();

  return (
    <button
      onClick={() => onToggle(!showFavoritesOnly)}
      disabled={count === 0}
      className={`
        relative p-2 rounded-lg transition-all duration-200
        ${
          showFavoritesOnly
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
        ${className}
      `}
      title={
        count === 0
          ? "No favorites to filter"
          : showFavoritesOnly
          ? "Show all characters"
          : "Show only favorites"
      }
    >
      <svg
        className="w-5 h-5"
        fill={showFavoritesOnly ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={showFavoritesOnly ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
