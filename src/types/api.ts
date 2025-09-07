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

/**
 * Favorites-related types
 */
export interface FavoriteCharacter {
  id: number;
  name: string;
  image: string;
  status: Character["status"];
  species: string;
  addedAt: string;
}

export interface FavoritesState {
  favorites: FavoriteCharacter[];
  count: number;
}

export interface FavoritesActions {
  addFavorite: (character: Character) => void;
  removeFavorite: (characterId: number) => void;
  toggleFavorite: (character: Character) => void;
  isFavorite: (characterId: number) => boolean;
  clearFavorites: () => void;
  getFavoriteById: (characterId: number) => FavoriteCharacter | undefined;
}

/**
 * Character note types
 */
export interface CharacterNote {
  id: string;
  characterId: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface NoteFormErrors {
  title?: string;
  content?: string;
  tags?: string;
  general?: string;
}

export interface NotesState {
  notes: CharacterNote[];
  isLoading: boolean;
  error: string | null;
}

export interface NotesActions {
  addNote: (characterId: number, noteData: NoteFormData) => Promise<void>;
  updateNote: (noteId: string, noteData: NoteFormData) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  getNotesByCharacterId: (characterId: number) => CharacterNote[];
  getNoteById: (noteId: string) => CharacterNote | undefined;
  clearNotes: () => void;
}
