/**
 * Favorites storage service implementing Repository pattern
 * Handles localStorage operations with error handling and type safety
 */

import { FavoriteCharacter, Character } from "@/types";

/**
 * Storage strategy interface for different storage implementations
 * Implements Strategy pattern for storage operations
 */
interface StorageStrategy {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * LocalStorage implementation of storage strategy
 */
class LocalStorageStrategy implements StorageStrategy {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Failed to write to localStorage:", error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  }
}

/**
 * In-memory storage strategy for fallback or testing
 */
class MemoryStorageStrategy implements StorageStrategy {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

/**
 * Favorites repository implementing Repository pattern
 * Provides abstraction over favorites storage operations
 */
export class FavoritesRepository {
  private static readonly STORAGE_KEY = "rick-morty-favorites";
  private static readonly VERSION = "1.0";
  private storage: StorageStrategy;

  constructor(storage?: StorageStrategy) {
    // Use provided storage or detect available storage
    this.storage = storage || this.getAvailableStorage();
  }

  /**
   * Detect and return available storage strategy
   */
  private getAvailableStorage(): StorageStrategy {
    try {
      // Test localStorage availability
      const testKey = "__test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return new LocalStorageStrategy();
    } catch {
      // Fall back to memory storage
      return new MemoryStorageStrategy();
    }
  }

  /**
   * Get all favorite characters
   */
  getFavorites(): FavoriteCharacter[] {
    try {
      const data = this.storage.getItem(FavoritesRepository.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Validate data structure and version
      if (!this.isValidFavoritesData(parsed)) {
        console.warn("Invalid favorites data structure, resetting...");
        this.clearFavorites();
        return [];
      }

      return parsed.favorites || [];
    } catch (error) {
      console.warn("Failed to parse favorites data:", error);
      return [];
    }
  }

  /**
   * Save favorites to storage
   */
  saveFavorites(favorites: FavoriteCharacter[]): void {
    try {
      const data = {
        version: FavoritesRepository.VERSION,
        favorites,
        lastUpdated: new Date().toISOString(),
      };

      this.storage.setItem(
        FavoritesRepository.STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn("Failed to save favorites:", error);
    }
  }

  /**
   * Add a character to favorites
   */
  addFavorite(character: Character): FavoriteCharacter[] {
    const favorites = this.getFavorites();
    const existingIndex = favorites.findIndex((fav) => fav.id === character.id);

    if (existingIndex === -1) {
      const newFavorite: FavoriteCharacter = {
        id: character.id,
        name: character.name,
        image: character.image,
        status: character.status,
        species: character.species,
        addedAt: new Date().toISOString(),
      };

      const updatedFavorites = [newFavorite, ...favorites];
      this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    }

    return favorites;
  }

  /**
   * Remove a character from favorites
   */
  removeFavorite(characterId: number): FavoriteCharacter[] {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.id !== characterId);

    this.saveFavorites(updatedFavorites);
    return updatedFavorites;
  }

  /**
   * Check if a character is favorited
   */
  isFavorite(characterId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.id === characterId);
  }

  /**
   * Get a specific favorite by ID
   */
  getFavoriteById(characterId: number): FavoriteCharacter | undefined {
    const favorites = this.getFavorites();
    return favorites.find((fav) => fav.id === characterId);
  }

  /**
   * Clear all favorites
   */
  clearFavorites(): void {
    this.storage.removeItem(FavoritesRepository.STORAGE_KEY);
  }

  /**
   * Get favorites count
   */
  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  /**
   * Validate favorites data structure
   */
  private isValidFavoritesData(data: unknown): data is {
    version: string;
    favorites: FavoriteCharacter[];
    lastUpdated: string;
  } {
    if (!data || typeof data !== "object") return false;

    const obj = data as Record<string, unknown>;
    return (
      typeof obj.version === "string" &&
      Array.isArray(obj.favorites) &&
      typeof obj.lastUpdated === "string"
    );
  }
}

/**
 * Singleton instance of favorites repository
 */
export const favoritesRepository = new FavoritesRepository();

/**
 * Utility functions for favorites operations
 */
export const favoritesUtils = {
  /**
   * Convert Character to FavoriteCharacter
   */
  characterToFavorite: (character: Character): FavoriteCharacter => ({
    id: character.id,
    name: character.name,
    image: character.image,
    status: character.status,
    species: character.species,
    addedAt: new Date().toISOString(),
  }),

  /**
   * Sort favorites by different criteria
   */
  sortFavorites: (
    favorites: FavoriteCharacter[],
    sortBy: "name" | "addedAt" | "status" = "addedAt"
  ): FavoriteCharacter[] => {
    return [...favorites].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "addedAt":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });
  },

  /**
   * Filter favorites by criteria
   */
  filterFavorites: (
    favorites: FavoriteCharacter[],
    query: string
  ): FavoriteCharacter[] => {
    if (!query.trim()) return favorites;

    const searchTerm = query.toLowerCase();
    return favorites.filter(
      (favorite) =>
        favorite.name.toLowerCase().includes(searchTerm) ||
        favorite.species.toLowerCase().includes(searchTerm) ||
        favorite.status.toLowerCase().includes(searchTerm)
    );
  },
};
