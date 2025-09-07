import React from "react";

interface LoadingProps {
  className?: string;
  variant?: "default" | "card" | "list";
}

export function Loading({ className = "", variant = "default" }: LoadingProps) {
  const baseClasses =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-2xl";

  if (variant === "card") {
    return (
      <div className={`space-y-5 p-1 ${className}`}>
        {/* Image skeleton */}
        <div className={`${baseClasses} h-64 w-full relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 px-1">
          {/* Title */}
          <div className={`${baseClasses} h-6 w-4/5`} />

          {/* Info items */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className={`${baseClasses} h-4 w-2/3`} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className={`${baseClasses} h-4 w-1/2`} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className={`${baseClasses} h-4 w-3/5`} />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100">
            <div className={`${baseClasses} h-3 w-1/3`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 bg-white rounded-2xl shadow-sm"
          >
            <div
              className={`${baseClasses} h-16 w-16 rounded-2xl flex-shrink-0`}
            />
            <div className="space-y-3 flex-1">
              <div className={`${baseClasses} h-5 w-3/4`} />
              <div className={`${baseClasses} h-4 w-1/2`} />
              <div className={`${baseClasses} h-3 w-2/3`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200" />
        {/* Inner spinning part */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 border-r-blue-500 absolute top-0 left-0" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200" />
        {/* Inner spinning part */}
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-transparent border-t-blue-600 border-r-blue-500 absolute top-0 left-0" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
