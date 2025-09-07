export type {
  Character,
  Episode,
  Location,
  ApiResponse,
  ApiError,
  CharacterFilters,
  EpisodeFilters,
  LocationFilters,
  FavoriteCharacter,
  FavoritesState,
  FavoritesActions,
  CharacterNote,
  NoteFormData,
  NoteFormErrors,
  NotesState,
  NotesActions,
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

/**
 * Consolidated filter state interface
 */
export interface FilterState {
  searchTerm: string;
  status: string;
  gender: string;
  species: string;
  sortConfig: SortConfig;
  showFavoritesOnly?: boolean;
  hasActiveFilters: boolean;
  isLoading?: boolean;
  totalResults?: number;
}

/**
 * Filter action handlers interface
 */
export interface FilterActions {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSpeciesChange: (value: string) => void;
  onSortChange: (key: SortOption, direction: SortDirection) => void;
  onFavoritesToggle?: (showFavoritesOnly: boolean) => void;
  onClearFilters: () => void;
}
