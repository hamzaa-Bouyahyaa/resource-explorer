import React from "react";
import { useCharacterFavorite } from "@/hooks";
import { Character } from "@/types";

interface FavoriteButtonProps {
  character: Character;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "outline" | "ghost";
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
}

/**
 * Favorite button component
 */
export function FavoriteButton({
  character,
  size = "md",
  variant = "filled",
  className = "",
  showLabel = false,
  disabled = false,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useCharacterFavorite(character);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation when used in links
    event.stopPropagation();

    if (!disabled) {
      toggleFavorite();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses =
      "transition-all duration-200 flex items-center justify-center rounded-full";

    if (disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed bg-gray-100 text-gray-400`;
    }

    if (isFavorited) {
      switch (variant) {
        case "filled":
          return `${baseClasses} bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg`;
        case "outline":
          return `${baseClasses} bg-white border-2 border-red-500 text-red-500 hover:bg-red-50`;
        case "ghost":
          return `${baseClasses} bg-transparent text-red-500 hover:bg-red-50`;
      }
    } else {
      switch (variant) {
        case "filled":
          return `${baseClasses} bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-red-500`;
        case "outline":
          return `${baseClasses} bg-white border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500`;
        case "ghost":
          return `${baseClasses} bg-transparent text-gray-600 hover:text-red-500 hover:bg-gray-50`;
      }
    }
  };

  // Heart icon SVG
  const HeartIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className={`${
        size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"
      }`}
      fill={isFavorited ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={isFavorited ? 0 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon />
      {showLabel && (
        <span className="ml-1 font-medium">
          {isFavorited ? "Favorited" : "Favorite"}
        </span>
      )}
    </button>
  );
}

/**
 * Compact favorite button for use in cards
 */
export function CompactFavoriteButton({
  character,
  className = "",
}: Pick<FavoriteButtonProps, "character" | "className">) {
  return (
    <FavoriteButton
      character={character}
      size="sm"
      variant="filled"
      className={`absolute top-2 right-2 shadow-lg ${className}`}
    />
  );
}

/**
 * Favorite button with label for detailed views
 */
export function LabeledFavoriteButton({
  character,
  className = "",
}: Pick<FavoriteButtonProps, "character" | "className">) {
  return (
    <FavoriteButton
      character={character}
      size="md"
      variant="outline"
      showLabel={true}
      className={`px-4 py-2 ${className}`}
    />
  );
}
