/**
 * Sort dropdown component for ordering results
 */

import React, { useId } from "react";
import { SortConfig, SortOption, SortDirection } from "@/types";

interface SortDropdownProps {
  sortConfig: SortConfig;
  onSortChange: (key: SortOption, direction: SortDirection) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Sort dropdown component with direction toggle
 */
export function SortDropdown({
  sortConfig,
  onSortChange,
  className = "",
  disabled = false,
}: SortDropdownProps) {
  const selectId = useId();

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "id", label: "ID" },
    { value: "created", label: "Created Date" },
    { value: "status", label: "Status" },
    { value: "species", label: "Species" },
  ] as const;

  const handleSortKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = event.target.value as SortOption;
    onSortChange(newKey, sortConfig.direction);
  };

  const handleDirectionToggle = () => {
    const newDirection: SortDirection =
      sortConfig.direction === "asc" ? "desc" : "asc";
    onSortChange(sortConfig.key, newDirection);
  };

  const getSortDirectionLabel = (direction: SortDirection) => {
    return direction === "asc" ? "Ascending" : "Descending";
  };

  const getSortDirectionIcon = (direction: SortDirection) => {
    return direction === "asc" ? (
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 01-1.08 1.04L10.75 5.612v10.638A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className={`flex items-end space-x-2 ${className}`}>
      {/* Sort Key Dropdown */}
      <div className="flex-1">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort by
        </label>

        <div className="relative">
          <select
            id={selectId}
            value={sortConfig.key}
            onChange={handleSortKeyChange}
            disabled={disabled}
            className={`
              block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-colors duration-200 appearance-none
            `}
            aria-label="Sort by field"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort Direction Toggle Button */}
      <button
        type="button"
        onClick={handleDirectionToggle}
        disabled={disabled}
        className={`
          inline-flex items-center px-3 py-2 border border-gray-300 rounded-md
          text-sm font-medium text-gray-700 bg-white
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        title={`Sort ${getSortDirectionLabel(sortConfig.direction)}`}
        aria-label={`Toggle sort direction. Currently ${getSortDirectionLabel(
          sortConfig.direction
        )}`}
      >
        {getSortDirectionIcon(sortConfig.direction)}
        <span className="ml-1 hidden sm:inline">
          {sortConfig.direction === "asc" ? "A-Z" : "Z-A"}
        </span>
      </button>
    </div>
  );
}
