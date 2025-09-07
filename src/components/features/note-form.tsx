"use client";

import React, { useState, useEffect } from "react";
import { NoteFormData, NoteFormErrors, CharacterNote } from "@/types";
import {
  FormField,
  TextInput,
  Textarea,
  TagInput,
  FormButton,
} from "@/components/ui/form-field";

interface NoteFormProps {
  initialData?: CharacterNote;
  onSubmit: (data: NoteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

/**
 * Validation utility functions
 */
const validateForm = (data: NoteFormData): NoteFormErrors => {
  const errors: NoteFormErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.trim().length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  // Content validation
  if (!data.content.trim()) {
    errors.content = "Content is required";
  } else if (data.content.trim().length > 2000) {
    errors.content = "Content must be less than 2000 characters";
  }

  // Tags validation
  if (data.tags.length > 10) {
    errors.tags = "Maximum 10 tags allowed";
  }

  data.tags.forEach((tag: string, index: number) => {
    if (tag.length > 30) {
      errors.tags = `Tag ${index + 1} must be less than 30 characters`;
    }
  });

  return errors;
};

/**
 * Note form component
 */
export function NoteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Note",
}: NoteFormProps) {
  // Form state
  const [formData, setFormData] = useState<NoteFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState<NoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes for unsaved changes warning
  useEffect(() => {
    const hasFormChanges =
      formData.title !== (initialData?.title || "") ||
      formData.content !== (initialData?.content || "") ||
      JSON.stringify(formData.tags) !== JSON.stringify(initialData?.tags || []);

    setHasChanges(hasFormChanges);
  }, [formData, initialData]);

  /**
   * Handle form field changes
   */
  const handleInputChange = (
    field: keyof NoteFormData,
    value: string | string[]
  ) => {
    setFormData((prev: NoteFormData) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev: NoteFormErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
      // Form will be closed by parent component
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Failed to save note",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel with unsaved changes warning
   */
  const handleCancel = () => {
    if (hasChanges) {
      const shouldCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!shouldCancel) {
        return;
      }
    }
    onCancel();
  };

  /**
   * Character count display utility
   */
  const getCharacterCount = (text: string, limit: number) => {
    const count = text.length;
    const remaining = limit - count;
    const isOverLimit = remaining < 0;

    return (
      <span
        className={`text-xs ${isOverLimit ? "text-red-500" : "text-gray-500"}`}
      >
        {count}/{limit}
        {remaining < 20 && remaining >= 0 && (
          <span className="ml-1 text-amber-500">({remaining} remaining)</span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 backdrop-blur-sm">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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
                d={
                  initialData
                    ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    : "M12 4v16m8-8H4"
                }
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Edit Note" : "Add New Note"}
          </h2>
        </div>
        <p className="text-gray-500 leading-relaxed">
          {initialData
            ? "Update your note with new information and insights"
            : "Capture your thoughts, theories, and observations about this character"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General error message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-700 font-medium">
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* Title field */}
        <FormField label="Title" error={errors.title} required>
          <div className="space-y-1">
            <TextInput
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter note title..."
              error={errors.title}
              disabled={isLoading || isSubmitting}
              maxLength={100}
              autoFocus
            />
            <div className="flex justify-end">
              {getCharacterCount(formData.title, 100)}
            </div>
          </div>
        </FormField>

        {/* Content field */}
        <FormField label="Content" error={errors.content} required>
          <div className="space-y-1">
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your note content here..."
              error={errors.content}
              disabled={isLoading || isSubmitting}
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">
                Use this space to add detailed information, observations, or
                thoughts about this character.
              </p>
              {getCharacterCount(formData.content, 2000)}
            </div>
          </div>
        </FormField>

        {/* Tags field */}
        <FormField label="Tags" error={errors.tags} className="space-y-2">
          <TagInput
            value={formData.tags}
            onChange={(tags) => handleInputChange("tags", tags)}
            placeholder="Add tags to categorize this note..."
            maxTags={10}
            error={errors.tags}
            disabled={isLoading || isSubmitting}
          />
          <p className="text-xs text-gray-500">
            Tags help organize and find your notes. Examples: personality,
            relationships, theories, episodes
          </p>
        </FormField>

        {/* Form actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
          <FormButton
            type="submit"
            loading={isSubmitting}
            disabled={isLoading}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {submitLabel}
              </div>
            )}
          </FormButton>

          <FormButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-8 py-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium rounded-xl shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </FormButton>
        </div>

        {/* Save indicator */}
        {hasChanges && !isSubmitting && (
          <div className="flex items-center justify-center mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center text-sm text-amber-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">You have unsaved changes</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
