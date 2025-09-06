/**
 * Loading component with skeleton placeholders
 */

import React from "react";

interface LoadingProps {
  className?: string;
  variant?: "default" | "card" | "list";
}

/**
 * Reusable loading skeleton component
 */
export function Loading({ className = "", variant = "default" }: LoadingProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  if (variant === "card") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className={`${baseClasses} h-48 w-full`} />
        <div className="space-y-2">
          <div className={`${baseClasses} h-4 w-3/4`} />
          <div className={`${baseClasses} h-4 w-1/2`} />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`${baseClasses} h-12 w-12 rounded-full`} />
            <div className="space-y-2 flex-1">
              <div className={`${baseClasses} h-4 w-3/4`} />
              <div className={`${baseClasses} h-4 w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="flex items-center justify-center h-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
