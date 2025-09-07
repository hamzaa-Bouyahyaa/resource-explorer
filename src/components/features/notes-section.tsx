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
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200 group">
      {/* Note header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-semibold text-gray-900 truncate mb-2 group-hover:text-gray-800 transition-colors">
            {note.title}
          </h4>
          <div className="flex items-center text-sm text-gray-500 space-x-3">
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Created {formatDate(note.createdAt)}</span>
            </div>
            {note.updatedAt !== note.createdAt && (
              <div className="flex items-center space-x-1 text-blue-600">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Updated {formatDate(note.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Note actions */}
        <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(note)}
            className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
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
            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
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
      <div className="prose prose-sm max-w-none mt-4">
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-200">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        </div>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {note.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {tag}
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 backdrop-blur-sm">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Notes for {character.name}
            </h2>
          </div>
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            {notes.length === 0 ? (
              <span>
                No notes yet. Add your first note about this character.
              </span>
            ) : (
              <>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {notes.length} note{notes.length === 1 ? "" : "s"}
                </span>
                <span>•</span>
                <span>Keep track of your thoughts and observations</span>
              </>
            )}
          </p>
        </div>

        {!showForm && !editingNote && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5 mr-2"
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
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
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
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No notes yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Start documenting your thoughts, theories, and observations about{" "}
              <span className="font-semibold text-gray-700">
                {character.name}
              </span>
              . Your insights will help you remember important details!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Add Your First Note
            </button>
          </div>
        )
      )}
    </div>
  );
}
