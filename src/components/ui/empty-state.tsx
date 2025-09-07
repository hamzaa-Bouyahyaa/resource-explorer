import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="mb-6 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-50" />
        </div>
        <div className="relative">{icon || defaultIcon}</div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

      <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
        {description}
      </p>

      {action && <div>{action}</div>}

      {/* Built-in action button */}
      {actionLabel && (actionHref || onAction) && (
        <div>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * No results found component for search/filter results
 */
export function NoResultsFound({
  searchTerm,
  onClearFilters,
}: {
  searchTerm?: string;
  onClearFilters?: () => void;
}) {
  const title = searchTerm
    ? `No results found for "${searchTerm}"`
    : "No results found";

  const description = searchTerm
    ? "Try adjusting your search terms or filters to find what you're looking for."
    : "Try adjusting your filters to see more results.";

  const searchIcon = (
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const action = onClearFilters ? (
    <button
      onClick={onClearFilters}
      className="inline-flex items-center px-6 py-3 border border-gray-200 text-sm font-semibold rounded-2xl text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Clear filters
    </button>
  ) : undefined;

  return (
    <EmptyState
      title={title}
      description={description}
      icon={searchIcon}
      action={action}
    />
  );
}
