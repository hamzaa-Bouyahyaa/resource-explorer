"use client";

import React, { useState } from "react";
import { Character, CharacterNote, NoteFormData } from "@/types";
import { useNotes } from "@/contexts/notes-context";
import { DeleteConfirmationModal, useConfirmationModal } from "@/components/ui";
import { NoteForm } from "./note-form";

interface NotesSectionProps {
  character: Character;
}

interface NoteItemProps {
  note: CharacterNote;
  onEdit: (note: CharacterNote) => void;
  onDelete: (noteId: string) => Promise<void>;
}

function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  const deleteModal = useConfirmationModal();

  const handleDelete = async () => {
    deleteModal.setLoading(true);
    try {
      await onDelete(note.id);
      deleteModal.closeModal();
    } catch {
      // Error handling is done in the parent component
      deleteModal.setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Note header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900 truncate">
            {note.title}
          </h4>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>Created {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span className="ml-2">
                • Updated {formatDate(note.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Note actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:text-blue-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Edit note"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={deleteModal.openModal}
            disabled={deleteModal.isLoading}
            className="text-red-600 hover:text-red-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            title="Delete note"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Note content */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {note.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        itemName={note.title}
        itemType="Note"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}

/**
 * Main notes section component
 */
export function NotesSection({ character }: NotesSectionProps) {
  const {
    getNotesByCharacterId,
    addNote,
    updateNote,
    deleteNote,
    isLoading,
    error,
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<CharacterNote | null>(null);

  const notes = getNotesByCharacterId(character.id);

  /**
   * Handle adding a new note
   */
  const handleAddNote = async (noteData: NoteFormData) => {
    await addNote(character.id, noteData);
    setShowForm(false);
  };

  /**
   * Handle updating an existing note
   */
  const handleUpdateNote = async (noteData: NoteFormData) => {
    if (!editingNote) return;
    await updateNote(editingNote.id, noteData);
    setEditingNote(null);
  };

  /**
   * Handle deleting a note
   */
  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  /**
   * Handle editing a note
   */
  const handleEditNote = (note: CharacterNote) => {
    setEditingNote(note);
    setShowForm(false);
  };

  /**
   * Handle canceling form
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Notes for {character.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {notes.length === 0
              ? "No notes yet. Add your first note about this character."
              : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {!showForm && !editingNote && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Note
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Add note form */}
      {showForm && (
        <div className="mb-6">
          <NoteForm
            onSubmit={handleAddNote}
            onCancel={handleCancelForm}
            isLoading={isLoading}
            submitLabel="Add Note"
          />
        </div>
      )}

      {/* Edit note form */}
      {editingNote && (
        <div className="mb-6">
          <NoteForm
            initialData={editingNote}
            onSubmit={handleUpdateNote}
            onCancel={handleCancelForm}
            isLoading={isLoading}
            submitLabel="Update Note"
          />
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes
            .sort(
              (a: CharacterNote, b: CharacterNote) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map((note: CharacterNote) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
        </div>
      ) : (
        !showForm &&
        !editingNote && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start documenting your thoughts and observations about{" "}
              {character.name}.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Add Your First Note
            </button>
          </div>
        )
      )}
    </div>
  );
}
