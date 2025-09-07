"use client";

import React from "react";
import { FormButton } from "./form-field";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  isLoading?: boolean;
  maxWidth?: "sm" | "md" | "lg";
}

/**
 * Reusable confirmation modal component
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
  maxWidth = "sm",
}: ConfirmationModalProps) {
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`bg-white rounded-2xl p-8 w-full ${maxWidthClasses[maxWidth]} transform transition-all duration-300 ease-out shadow-2xl border border-gray-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 id="modal-title" className="text-xl font-bold text-gray-900">
              {title}
            </h3>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg p-2 hover:bg-gray-50 disabled:opacity-50 transition-all"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <p
          id="modal-description"
          className="text-sm text-gray-600 mb-6 leading-relaxed"
        >
          {message}
        </p>

        {/* Modal actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <FormButton
            onClick={onConfirm}
            variant={confirmVariant}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 sm:flex-none order-2 sm:order-1"
          >
            {isLoading ? "Processing..." : confirmLabel}
          </FormButton>

          <FormButton
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            className="flex-1 sm:flex-none order-1 sm:order-2"
          >
            {cancelLabel}
          </FormButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing confirmation modal state
 */
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const setLoading = (loading: boolean) => setIsLoading(loading);

  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    setLoading,
  };
}

/**
 * Specialized delete confirmation modal
 */
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmLabel={isLoading ? "Deleting..." : "Delete"}
      cancelLabel="Cancel"
      confirmVariant="danger"
      isLoading={isLoading}
      maxWidth="sm"
    />
  );
}
