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
    <div className={`relative group ${className}`}>
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-gray-700 mb-2"
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
            block w-full pl-4 pr-10 py-3 text-sm border border-gray-200 rounded-xl
            bg-white/50 backdrop-blur-sm text-gray-900 font-medium
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-all duration-300 appearance-none shadow-sm hover:shadow-md focus:shadow-lg
            group-hover:border-gray-300
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"
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

        {/* Focus ring enhancement */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
    <div className={`relative group ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-gray-700 mb-2"
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
            block w-full pl-4 pr-10 py-3 text-sm border border-gray-200 rounded-xl
            placeholder-gray-400 text-gray-900 font-medium
            bg-white/50 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg
            group-hover:border-gray-300
          `}
          aria-label="Filter by species"
        />

        {/* Clear button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-all duration-300 group"
            aria-label="Clear species filter"
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
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
