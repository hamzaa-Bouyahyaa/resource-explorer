import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Character } from "@/types";
import { CompactFavoriteButton } from "@/components/ui/favorite-button";

interface CharacterCardProps {
  character: Character;
  className?: string;
}

export function CharacterCard({
  character,
  className = "",
}: CharacterCardProps) {
  const getStatusColor = (status: Character["status"]) => {
    switch (status) {
      case "Alive":
        return "bg-green-500";
      case "Dead":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Character["status"]) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Link
      href={`/characters/${character.id}`}
      className={`block group ${className}`}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 group-hover:border-blue-300">
        {/* Character Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={character.image}
            alt={`${character.name} portrait`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Favorite button */}
          <CompactFavoriteButton character={character} />

          {/* Status indicator */}
          <div className="absolute top-2 left-2">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  character.status
                )}`}
              />
              <span className="text-gray-700">
                {getStatusText(character.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Character Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {character.name}
          </h3>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Species:</span> {character.species}
            </p>

            {character.type && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span> {character.type}
              </p>
            )}

            <p className="text-sm text-gray-600">
              <span className="font-medium">Gender:</span> {character.gender}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Origin:</span>{" "}
              <span className="line-clamp-1">{character.origin.name}</span>
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span>{" "}
              <span className="line-clamp-1">{character.location.name}</span>
            </p>
          </div>

          {/* Episode count */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Appears in {character.episode.length} episode
              {character.episode.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
