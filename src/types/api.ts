/**
 * TypeScript definitions for Rick & Morty API
 * Based on the official API documentation: https://rickandmortyapi.com/documentation
 */

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Query parameters for filtering and searching
 */
export interface CharacterFilters extends Record<string, unknown> {
  name?: string;
  status?: Character["status"];
  species?: string;
  type?: string;
  gender?: Character["gender"];
  page?: number;
}

export interface EpisodeFilters extends Record<string, unknown> {
  name?: string;
  episode?: string;
  page?: number;
}

export interface LocationFilters extends Record<string, unknown> {
  name?: string;
  type?: string;
  dimension?: string;
  page?: number;
}
