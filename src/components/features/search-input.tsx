import React, { useId } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Debounced search input component
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search characters...",
  className = "",
  disabled = false,
}: SearchInputProps) {
  const inputId = useId();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Search Input */}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl
          placeholder-gray-400 text-gray-900 text-sm font-medium
          bg-white/50 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg
          group-hover:border-gray-300
        `}
        aria-label="Search characters"
      />

      {/* Clear Button */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-all duration-300 group"
          aria-label="Clear search"
        >
          <div className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Focus ring enhancement */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
