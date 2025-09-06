/**
 * Error display and handling components
 */

import React from "react";
import { ApiError } from "@/types";

interface ErrorDisplayProps {
  error: Error | ApiError | unknown;
  onRetry?: () => void;
  className?: string;
}

/**
 * Generic error display component with retry functionality
 */
export function ErrorDisplay({
  error,
  onRetry,
  className = "",
}: ErrorDisplayProps) {
  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "error" in err) {
      const apiError = err as ApiError;
      return (
        apiError.message || apiError.error || "An unexpected error occurred"
      );
    }

    if (err instanceof Error) {
      return err.message;
    }

    return "An unexpected error occurred";
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>

      <p className="text-gray-600 mb-4 max-w-md mx-auto">{errorMessage}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * Compact error message component for inline usage
 */
export function ErrorMessage({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center text-red-600 text-sm ${className}`}>
      <svg
        className="h-4 w-4 mr-2 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
