"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCharacter } from "@/hooks";
import { Loading, ErrorDisplay } from "@/components/ui";
import { LabeledFavoriteButton } from "@/components/ui/favorite-button";
import { NotesSection } from "@/components/features";
import { apiUtils } from "@/lib";

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Parse character ID from URL params
  const characterId = params.id ? parseInt(params.id as string, 10) : 0;
  const isValidId = characterId > 0;

  // Fetch character data
  const {
    data: character,
    isLoading,
    isError,
    error,
    refetch,
  } = useCharacter(characterId, isValidId);

  // Handle invalid ID
  if (!isValidId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Character ID
          </h1>
          <p className="text-gray-600 mb-6">
            The character ID provided is not valid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            ← Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading variant="card" className="max-w-2xl mx-auto" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !character) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Characters
            </Link>
          </div>
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: typeof character.status) => {
    switch (status) {
      case "Alive":
        return "bg-green-100 text-green-800 border-green-200";
      case "Dead":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Character Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Character Image */}
            <div className="md:w-1/2">
              <div className="relative aspect-square">
                <Image
                  src={character.image}
                  alt={`${character.name} portrait`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Character Information */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {character.name}
                </h1>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    character.status
                  )}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      character.status === "Alive"
                        ? "bg-green-500"
                        : character.status === "Dead"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  />
                  {character.status}
                </span>
              </div>

              {/* Favorite Button */}
              <div className="mb-6">
                <LabeledFavoriteButton
                  character={character}
                  className="w-full sm:w-auto"
                />
              </div>

              {/* Character Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Species
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {character.species}
                  </p>
                </div>

                {character.type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {character.type}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Gender
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {character.gender}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Origin
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {character.origin.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Last Known Location
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {character.location.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Episodes
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    Appears in {character.episode.length} episode
                    {character.episode.length !== 1 ? "s" : ""}
                  </p>

                  {/* Episode List */}
                  <div className="mt-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {character.episode
                        .slice(0, 12)
                        .map((episodeUrl, index) => {
                          const episodeId =
                            apiUtils.extractIdFromUrl(episodeUrl);
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              Episode {episodeId}
                            </span>
                          );
                        })}
                      {character.episode.length > 12 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{character.episode.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(character.created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8">
          <NotesSection character={character} />
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Explore More Characters
          </Link>
        </div>
      </div>
    </div>
  );
}
