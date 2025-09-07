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
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200 group-hover:-translate-y-1 backdrop-blur-sm">
        {/* Character Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={character.image}
            alt={`${character.name} portrait`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite button */}
          <CompactFavoriteButton character={character} />

          {/* Status indicator */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg border border-white/20">
              <div
                className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                  character.status
                )} shadow-sm`}
              />
              <span className="text-gray-700">
                {getStatusText(character.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Character Info */}
        <div className="p-5">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-3">
            {character.name}
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60" />
              <p className="text-sm text-gray-700 font-medium">
                {character.species}
              </p>
            </div>

            {character.type && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-60" />
                <p className="text-sm text-gray-700">{character.type}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-60" />
              <p className="text-sm text-gray-700">{character.gender}</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-gray-600 line-clamp-1">
                  <span className="font-medium">Origin:</span>{" "}
                  {character.origin.name}
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-sm text-gray-600 line-clamp-1">
                  <span className="font-medium">Location:</span>{" "}
                  {character.location.name}
                </p>
              </div>
            </div>
          </div>

          {/* Episode count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z"
                  />
                </svg>
                <p className="text-xs font-medium text-gray-500">
                  {character.episode.length} episode
                  {character.episode.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium text-blue-600">
                  View details
                </span>
                <svg
                  className="w-3 h-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
