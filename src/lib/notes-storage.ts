import { CharacterNote, NoteFormData } from "@/types";

const STORAGE_KEY = "character_notes";

export class NotesRepository {
  /**
   * Get all notes from localStorage
   */
  static getNotes(): CharacterNote[] {
    try {
      if (typeof window === "undefined") {
        return [];
      }

      const storedNotes = localStorage.getItem(STORAGE_KEY);
      if (!storedNotes) {
        return [];
      }

      const parsedNotes = JSON.parse(storedNotes);
      return Array.isArray(parsedNotes) ? parsedNotes : [];
    } catch (error) {
      console.error("Failed to get notes from localStorage:", error);
      return [];
    }
  }

  /**
   * Save notes to localStorage
   */
  static saveNotes(notes: CharacterNote[]): void {
    try {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
      throw new Error("Failed to save notes");
    }
  }

  /**
   * Get notes for a specific character
   */
  static getNotesByCharacterId(characterId: number): CharacterNote[] {
    const allNotes = this.getNotes();
    return allNotes.filter((note) => note.characterId === characterId);
  }

  /**
   * Get a specific note by ID
   */
  static getNoteById(noteId: string): CharacterNote | undefined {
    const allNotes = this.getNotes();
    return allNotes.find((note) => note.id === noteId);
  }

  /**
   * Add a new note
   */
  static addNote(characterId: number, noteData: NoteFormData): CharacterNote {
    const allNotes = this.getNotes();
    const now = new Date().toISOString();

    const newNote: CharacterNote = {
      id: this.generateNoteId(),
      characterId,
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      tags: noteData.tags.map((tag: string) => tag.trim()).filter(Boolean),
      createdAt: now,
      updatedAt: now,
    };

    const updatedNotes = [newNote, ...allNotes];
    this.saveNotes(updatedNotes);

    return newNote;
  }

  /**
   * Update an existing note
   */
  static updateNote(noteId: string, noteData: NoteFormData): CharacterNote {
    const allNotes = this.getNotes();
    const noteIndex = allNotes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

    const existingNote = allNotes[noteIndex];
    const updatedNote: CharacterNote = {
      ...existingNote,
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      tags: noteData.tags.map((tag: string) => tag.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    allNotes[noteIndex] = updatedNote;
    this.saveNotes(allNotes);

    return updatedNote;
  }

  /**
   * Delete a note
   */
  static deleteNote(noteId: string): boolean {
    const allNotes = this.getNotes();
    const filteredNotes = allNotes.filter((note) => note.id !== noteId);

    if (filteredNotes.length === allNotes.length) {
      return false; // Note not found
    }

    this.saveNotes(filteredNotes);
    return true;
  }

  /**
   * Clear all notes
   */
  static clearNotes(): void {
    try {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear notes from localStorage:", error);
    }
  }

  /**
   * Generate a unique note ID
   */
  private static generateNoteId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate note data
   */
  static validateNoteData(noteData: NoteFormData): string[] {
    const errors: string[] = [];

    if (!noteData.title || noteData.title.trim().length === 0) {
      errors.push("Title is required");
    } else if (noteData.title.trim().length > 100) {
      errors.push("Title must be less than 100 characters");
    }

    if (!noteData.content || noteData.content.trim().length === 0) {
      errors.push("Content is required");
    } else if (noteData.content.trim().length > 2000) {
      errors.push("Content must be less than 2000 characters");
    }

    if (noteData.tags.length > 10) {
      errors.push("Maximum 10 tags allowed");
    }

    noteData.tags.forEach((tag: string, index: number) => {
      if (tag.length > 30) {
        errors.push(`Tag ${index + 1} must be less than 30 characters`);
      }
    });

    return errors;
  }
}

/**
 * Export singleton instance for convenience
 */
export const notesRepository = NotesRepository;
