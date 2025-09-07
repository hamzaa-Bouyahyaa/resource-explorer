export const API_BASE_URL = "https://rickandmortyapi.com/api";

export const API_ENDPOINTS = {
  CHARACTERS: "/character",
  EPISODES: "/episode",
  LOCATIONS: "/location",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20, // Rick & Morty API returns 20 items per page by default
} as const;

/**
 * Debounce timing for search input
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  FAVORITES: "resource-explorer-favorites",
  THEME: "resource-explorer-theme",
} as const;

/**
 * Character filter options
 */
export const CHARACTER_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "alive", label: "Alive" },
  { value: "dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
] as const;

export const CHARACTER_GENDER_OPTIONS = [
  { value: "", label: "All Genders" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "genderless", label: "Genderless" },
  { value: "unknown", label: "Unknown" },
] as const;

/**
 * Sort options
 */
export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "id", label: "ID" },
  { value: "created", label: "Created Date" },
  { value: "status", label: "Status" },
  { value: "species", label: "Species" },
] as const;
