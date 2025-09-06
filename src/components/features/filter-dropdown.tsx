/**
 * Filter dropdown components for character filtering
 */

import React, { useId } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Generic filter dropdown component
 */
export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
  disabled = false,
}: FilterDropdownProps) {
  const selectId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md
            bg-white text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-colors duration-200 appearance-none
          `}
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          {options.map((option) => (
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
  );
}

/**
 * Status filter dropdown component
 */
interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function StatusFilter({
  value,
  onChange,
  className,
  disabled,
}: StatusFilterProps) {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "alive", label: "Alive" },
    { value: "dead", label: "Dead" },
    { value: "unknown", label: "Unknown" },
  ] as const;

  return (
    <FilterDropdown
      label="Status"
      value={value}
      options={statusOptions}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  );
}

/**
 * Gender filter dropdown component
 */
interface GenderFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function GenderFilter({
  value,
  onChange,
  className,
  disabled,
}: GenderFilterProps) {
  const genderOptions = [
    { value: "", label: "All Genders" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "genderless", label: "Genderless" },
    { value: "unknown", label: "Unknown" },
  ] as const;

  return (
    <FilterDropdown
      label="Gender"
      value={value}
      options={genderOptions}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  );
}

/**
 * Species filter input component (free text input)
 */
interface SpeciesFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function SpeciesFilter({
  value,
  onChange,
  className,
  disabled,
}: SpeciesFilterProps) {
  const inputId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Species
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="e.g., Human, Alien..."
          disabled={disabled}
          className={`
            block w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md
            placeholder-gray-500 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
          aria-label="Filter by species"
        />

        {/* Clear button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2 flex items-center hover:text-gray-700 transition-colors"
            aria-label="Clear species filter"
          >
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
          </button>
        )}
      </div>
    </div>
  );
}
