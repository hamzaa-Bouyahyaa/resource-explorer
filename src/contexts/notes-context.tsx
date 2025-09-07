"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CharacterNote, NoteFormData, NotesState, NotesActions } from "@/types";
import { notesRepository } from "@/lib/notes-storage";

/**
 * Notes actions for reducer
 */
type NotesAction =
  | { type: "LOAD_NOTES"; payload: CharacterNote[] }
  | { type: "ADD_NOTE"; payload: CharacterNote }
  | { type: "UPDATE_NOTE"; payload: CharacterNote }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "CLEAR_NOTES" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

/**
 * Notes reducer implementing state management logic
 */
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "LOAD_NOTES":
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
        error: null,
      };

    case "ADD_NOTE": {
      const newNote = action.payload;
      return {
        ...state,
        notes: [newNote, ...state.notes],
        error: null,
      };
    }

    case "UPDATE_NOTE": {
      const updatedNote = action.payload;
      const updatedNotes = state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );

      return {
        ...state,
        notes: updatedNotes,
        error: null,
      };
    }

    case "DELETE_NOTE": {
      const noteId = action.payload;
      const filteredNotes = state.notes.filter((note) => note.id !== noteId);

      return {
        ...state,
        notes: filteredNotes,
        error: null,
      };
    }

    case "CLEAR_NOTES":
      return {
        ...state,
        notes: [],
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}

/**
 * Combined context type
 */
type NotesContextType = NotesState & NotesActions;

/**
 * Notes context
 */
const NotesContext = createContext<NotesContextType | undefined>(undefined);

/**
 * Props for NotesProvider
 */
interface NotesProviderProps {
  children: React.ReactNode;
}

/**
 * Notes provider component
 * Implements state management for notes functionality
 */
export function NotesProvider({ children }: NotesProviderProps) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    isLoading: true,
    error: null,
  });

  // Load notes from storage on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Small delay to prevent hydration issues
        await new Promise((resolve) => setTimeout(resolve, 0));

        const notes = notesRepository.getNotes();
        dispatch({ type: "LOAD_NOTES", payload: notes });
      } catch (error) {
        console.error("Failed to load notes:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load notes",
        });
      }
    };

    loadNotes();
  }, []);

  /**
   * Add a new note
   */
  const addNote = async (
    characterId: number,
    noteData: NoteFormData
  ): Promise<void> => {
    try {
      // Validate note data
      const validationErrors = notesRepository.validateNoteData(noteData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      const newNote = notesRepository.addNote(characterId, noteData);
      dispatch({ type: "ADD_NOTE", payload: newNote });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add note";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  /**
   * Update an existing note
   */
  const updateNote = async (
    noteId: string,
    noteData: NoteFormData
  ): Promise<void> => {
    try {
      // Validate note data
      const validationErrors = notesRepository.validateNoteData(noteData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      const updatedNote = notesRepository.updateNote(noteId, noteData);
      dispatch({ type: "UPDATE_NOTE", payload: updatedNote });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update note";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  /**
   * Delete a note
   */
  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      const success = notesRepository.deleteNote(noteId);
      if (success) {
        dispatch({ type: "DELETE_NOTE", payload: noteId });
      } else {
        throw new Error("Note not found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete note";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  /**
   * Get notes for a specific character
   */
  const getNotesByCharacterId = (characterId: number): CharacterNote[] => {
    return state.notes.filter((note) => note.characterId === characterId);
  };

  /**
   * Get a specific note by ID
   */
  const getNoteById = (noteId: string): CharacterNote | undefined => {
    return state.notes.find((note) => note.id === noteId);
  };

  /**
   * Clear all notes
   */
  const clearNotes = () => {
    notesRepository.clearNotes();
    dispatch({ type: "CLEAR_NOTES" });
  };

  const contextValue: NotesContextType = {
    // State
    notes: state.notes,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    addNote,
    updateNote,
    deleteNote,
    getNotesByCharacterId,
    getNoteById,
    clearNotes,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

/**
 * Custom hook to use notes context
 * Throws error if used outside of provider
 */
export function useNotes(): NotesContextType {
  const context = useContext(NotesContext);

  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }

  return context;
}

/**
 * HOC to provide notes context to components
 */
export function withNotes<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <NotesProvider>
      <Component {...props} />
    </NotesProvider>
  );

  WrappedComponent.displayName = `withNotes(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
