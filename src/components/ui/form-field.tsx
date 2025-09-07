/**
 * Reusable form field components with validation support
 * Provides consistent styling and error handling across forms
 */

import React, { forwardRef } from "react";

/**
 * Base form field wrapper component
 */
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Text input component
 */
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className = "", ...props }, ref) => {
    const baseClasses =
      "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    const normalClasses =
      "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    const errorClasses =
      "border-red-300 focus:border-red-500 focus:ring-red-500";

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${
          error ? errorClasses : normalClasses
        } ${className}`}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";

/**
 * Textarea component
 */
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    const baseClasses =
      "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors resize-vertical";
    const normalClasses =
      "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    const errorClasses =
      "border-red-300 focus:border-red-500 focus:ring-red-500";

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${
          error ? errorClasses : normalClasses
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * Tag input component for managing arrays of strings
 */
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  error,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (
      tag &&
      !value.includes(tag) &&
      value.length < maxTags &&
      tag.length <= 30
    ) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const baseClasses =
    "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const normalClasses =
    "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  const errorClasses = "border-red-300 focus:border-red-500 focus:ring-red-500";

  return (
    <div className="space-y-2">
      {/* Tags display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                disabled={disabled}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none disabled:opacity-50"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={addTag}
          placeholder={
            value.length >= maxTags
              ? `Maximum ${maxTags} tags reached`
              : placeholder
          }
          disabled={disabled || value.length >= maxTags}
          className={`${baseClasses} ${
            error ? errorClasses : normalClasses
          } disabled:bg-gray-50 disabled:text-gray-500`}
        />
        {value.length < maxTags && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-xs text-gray-400">
              {value.length}/{maxTags}
            </span>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Press Enter or comma to add tags. Maximum {maxTags} tags, 30 characters
        each.
      </p>
    </div>
  );
}

/**
 * Form button component
 */
interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function FormButton({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: FormButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:hover:bg-blue-600",
    secondary:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    danger:
      "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:hover:bg-red-600",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
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
      )}
      {children}
    </button>
  );
}
