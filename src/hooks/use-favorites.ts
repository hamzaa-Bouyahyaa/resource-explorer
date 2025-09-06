/**
 * Custom hooks for favorites management
 * Provides convenient interfaces for favorites operations
 */

import { useMemo } from "react";
import { useFavorites as useFavoritesContext } from "@/contexts/favorites-context";
import { Character, FavoriteCharacter } from "@/types";
import { favoritesUtils } from "@/lib/favorites-storage";

/**
 * Main favorites hook
 * Re-exports context hook with additional utilities
 */
export function useFavorites() {
  return useFavoritesContext();
}

/**
 * Hook for character-specific favorite operations
 */
export function useCharacterFavorite(character: Character | null) {
  const { isFavorite, toggleFavorite, addFavorite, removeFavorite } =
    useFavorites();

  const isCharacterFavorited = useMemo(() => {
    return character ? isFavorite(character.id) : false;
  }, [character, isFavorite]);

  const handleToggleFavorite = () => {
    if (character) {
      toggleFavorite(character);
    }
  };

  const handleAddFavorite = () => {
    if (character && !isCharacterFavorited) {
      addFavorite(character);
    }
  };

  const handleRemoveFavorite = () => {
    if (character && isCharacterFavorited) {
      removeFavorite(character.id);
    }
  };

  return {
    isFavorited: isCharacterFavorited,
    toggleFavorite: handleToggleFavorite,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
  };
}

/**
 * Hook for favorites list management with sorting and filtering
 */
export function useFavoritesList() {
  const { favorites, count, isLoading, clearFavorites } = useFavorites();

  /**
   * Get sorted favorites
   */
  const getSortedFavorites = (
    sortBy: "name" | "addedAt" | "status" = "addedAt"
  ) => {
    return favoritesUtils.sortFavorites(favorites, sortBy);
  };

  /**
   * Get filtered favorites
   */
  const getFilteredFavorites = (
    query: string,
    sortBy: "name" | "addedAt" | "status" = "addedAt"
  ) => {
    const filtered = favoritesUtils.filterFavorites(favorites, query);
    return favoritesUtils.sortFavorites(filtered, sortBy);
  };

  /**
   * Get favorites grouped by status
   */
  const getFavoritesByStatus = () => {
    return favorites.reduce((groups, favorite) => {
      const status = favorite.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(favorite);
      return groups;
    }, {} as Record<string, FavoriteCharacter[]>);
  };

  /**
   * Get favorites statistics
   */
  const getStatistics = () => {
    const statusCounts = favorites.reduce((counts, favorite) => {
      counts[favorite.status] = (counts[favorite.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const speciesCounts = favorites.reduce((counts, favorite) => {
      counts[favorite.species] = (counts[favorite.species] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return {
      total: count,
      byStatus: statusCounts,
      bySpecies: speciesCounts,
      mostRecentlyAdded: favorites[0] || null,
      oldestAdded: favorites[favorites.length - 1] || null,
    };
  };

  /**
   * Check if favorites list is empty
   */
  const isEmpty = count === 0;

  /**
   * Check if favorites are available (loaded and not empty)
   */
  const hasData = !isLoading && count > 0;

  return {
    // Data
    favorites,
    count,
    isEmpty,
    hasData,
    isLoading,

    // Utilities
    getSortedFavorites,
    getFilteredFavorites,
    getFavoritesByStatus,
    getStatistics,
    clearFavorites,
  };
}

/**
 * Hook for bulk favorite operations
 */
export function useBulkFavorites() {
  const { addFavorite, removeFavorite, favorites, clearFavorites } =
    useFavorites();

  /**
   * Add multiple characters to favorites
   */
  const addMultipleFavorites = (characters: Character[]) => {
    characters.forEach((character) => {
      addFavorite(character);
    });
  };

  /**
   * Remove multiple characters from favorites
   */
  const removeMultipleFavorites = (characterIds: number[]) => {
    characterIds.forEach((id) => {
      removeFavorite(id);
    });
  };

  /**
   * Check if any of the provided characters are favorited
   */
  const hasAnyFavorited = (characterIds: number[]): boolean => {
    return characterIds.some((id) => favorites.some((fav) => fav.id === id));
  };

  /**
   * Check if all of the provided characters are favorited
   */
  const hasAllFavorited = (characterIds: number[]): boolean => {
    return characterIds.every((id) => favorites.some((fav) => fav.id === id));
  };

  /**
   * Get favorited character IDs from a list
   */
  const getFavoritedIds = (characterIds: number[]): number[] => {
    return characterIds.filter((id) => favorites.some((fav) => fav.id === id));
  };

  /**
   * Get non-favorited character IDs from a list
   */
  const getNonFavoritedIds = (characterIds: number[]): number[] => {
    return characterIds.filter((id) => !favorites.some((fav) => fav.id === id));
  };

  return {
    addMultipleFavorites,
    removeMultipleFavorites,
    hasAnyFavorited,
    hasAllFavorited,
    getFavoritedIds,
    getNonFavoritedIds,
    clearFavorites,
  };
}

/**
 * Hook for favorites persistence and synchronization
 */
export function useFavoritesPersistence() {
  const { favorites, count } = useFavorites();

  /**
   * Export favorites as JSON
   */
  const exportFavorites = () => {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      favorites,
      count,
    };

    return JSON.stringify(data, null, 2);
  };

  /**
   * Get favorites as CSV
   */
  const exportFavoritesAsCSV = () => {
    const headers = ["ID", "Name", "Status", "Species", "Added At"];
    const rows = favorites.map((fav) => [
      fav.id.toString(),
      `"${fav.name}"`,
      fav.status,
      `"${fav.species}"`,
      fav.addedAt,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  /**
   * Download favorites as file
   */
  const downloadFavorites = (format: "json" | "csv" = "json") => {
    const data = format === "json" ? exportFavorites() : exportFavoritesAsCSV();
    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rick-morty-favorites.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    exportFavorites,
    exportFavoritesAsCSV,
    downloadFavorites,
  };
}
