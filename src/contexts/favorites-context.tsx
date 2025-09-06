/**
 * Favorites context implementing Observer pattern
 * Provides global state management for favorites functionality
 */

"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  Character,
  FavoriteCharacter,
  FavoritesState,
  FavoritesActions,
} from "@/types";
import { favoritesRepository } from "@/lib/favorites-storage";

/**
 * Favorites actions for reducer
 */
type FavoritesAction =
  | { type: "LOAD_FAVORITES"; payload: FavoriteCharacter[] }
  | { type: "ADD_FAVORITE"; payload: Character }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "CLEAR_FAVORITES" }
  | { type: "SET_LOADING"; payload: boolean };

/**
 * Extended state interface including loading state
 */
interface ExtendedFavoritesState extends FavoritesState {
  isLoading: boolean;
}

/**
 * Favorites reducer implementing state management logic
 */
function favoritesReducer(
  state: ExtendedFavoritesState,
  action: FavoritesAction
): ExtendedFavoritesState {
  switch (action.type) {
    case "LOAD_FAVORITES":
      return {
        ...state,
        favorites: action.payload,
        count: action.payload.length,
        isLoading: false,
      };

    case "ADD_FAVORITE": {
      const character = action.payload;
      const existingFavorite = state.favorites.find(
        (fav) => fav.id === character.id
      );

      if (existingFavorite) {
        return state; // Already favorited
      }

      const newFavorite: FavoriteCharacter = {
        id: character.id,
        name: character.name,
        image: character.image,
        status: character.status,
        species: character.species,
        addedAt: new Date().toISOString(),
      };

      const updatedFavorites = [newFavorite, ...state.favorites];

      // Persist to storage
      favoritesRepository.saveFavorites(updatedFavorites);

      return {
        ...state,
        favorites: updatedFavorites,
        count: updatedFavorites.length,
      };
    }

    case "REMOVE_FAVORITE": {
      const characterId = action.payload;
      const updatedFavorites = state.favorites.filter(
        (fav) => fav.id !== characterId
      );

      // Persist to storage
      favoritesRepository.saveFavorites(updatedFavorites);

      return {
        ...state,
        favorites: updatedFavorites,
        count: updatedFavorites.length,
      };
    }

    case "CLEAR_FAVORITES":
      // Clear from storage
      favoritesRepository.clearFavorites();

      return {
        ...state,
        favorites: [],
        count: 0,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Combined context type
 */
type FavoritesContextType = ExtendedFavoritesState & FavoritesActions;

/**
 * Favorites context
 */
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/**
 * Props for FavoritesProvider
 */
interface FavoritesProviderProps {
  children: React.ReactNode;
}

/**
 * Favorites provider component
 * Implements Observer pattern for state distribution
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    count: 0,
    isLoading: true,
  });

  // Load favorites from storage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Small delay to prevent hydration issues
        await new Promise((resolve) => setTimeout(resolve, 0));

        const favorites = favoritesRepository.getFavorites();
        dispatch({ type: "LOAD_FAVORITES", payload: favorites });
      } catch (error) {
        console.error("Failed to load favorites:", error);
        dispatch({ type: "LOAD_FAVORITES", payload: [] });
      }
    };

    loadFavorites();
  }, []);

  /**
   * Add a character to favorites
   */
  const addFavorite = (character: Character) => {
    dispatch({ type: "ADD_FAVORITE", payload: character });
  };

  /**
   * Remove a character from favorites
   */
  const removeFavorite = (characterId: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: characterId });
  };

  /**
   * Toggle favorite status of a character
   */
  const toggleFavorite = (character: Character) => {
    const isCurrentlyFavorited = state.favorites.some(
      (fav) => fav.id === character.id
    );

    if (isCurrentlyFavorited) {
      removeFavorite(character.id);
    } else {
      addFavorite(character);
    }
  };

  /**
   * Check if a character is favorited
   */
  const isFavorite = (characterId: number): boolean => {
    return state.favorites.some((fav) => fav.id === characterId);
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    dispatch({ type: "CLEAR_FAVORITES" });
  };

  /**
   * Get a specific favorite by ID
   */
  const getFavoriteById = (
    characterId: number
  ): FavoriteCharacter | undefined => {
    return state.favorites.find((fav) => fav.id === characterId);
  };

  const contextValue: FavoritesContextType = {
    // State
    favorites: state.favorites,
    count: state.count,
    isLoading: state.isLoading,

    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoriteById,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Custom hook to use favorites context
 * Throws error if used outside of provider
 */
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}

/**
 * HOC to provide favorites context to components
 */
export function withFavorites<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <FavoritesProvider>
      <Component {...props} />
    </FavoritesProvider>
  );

  WrappedComponent.displayName = `withFavorites(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
