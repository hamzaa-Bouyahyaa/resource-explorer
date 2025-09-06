/**
 * Central export file for all TypeScript types
 */

export type {
  Character,
  Episode,
  Location,
  ApiResponse,
  ApiError,
  CharacterFilters,
  EpisodeFilters,
  LocationFilters,
} from "./api";

/**
 * Application-specific types
 */
export interface FavoriteItem {
  id: number;
  type: "character" | "episode" | "location";
  addedAt: string;
}

export interface SearchParams {
  q?: string;
  status?: string;
  species?: string;
  gender?: string;
  type?: string;
  page?: string;
  sort?: string;
}

export type SortOption = "name" | "id" | "created" | "status" | "species";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortOption;
  direction: SortDirection;
}
