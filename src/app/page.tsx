"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCharacters } from "@/hooks";
import { CharacterGrid } from "@/components/features/character-grid";
import { Pagination } from "@/components/features/pagination";
import { CharacterFilters } from "@/types";
import { PAGINATION } from "@/constants";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract filters from URL search params
  const filters: CharacterFilters = useMemo(() => {
    const page = searchParams.get("page");
    const name = searchParams.get("q");
    const status = searchParams.get("status");
    const species = searchParams.get("species");
    const gender = searchParams.get("gender");
    const type = searchParams.get("type");

    return {
      page: page ? parseInt(page, 10) : PAGINATION.DEFAULT_PAGE,
      name: name || undefined,
      status: (status as CharacterFilters["status"]) || undefined,
      species: species || undefined,
      gender: (gender as CharacterFilters["gender"]) || undefined,
      type: type || undefined,
    };
  }, [searchParams]);

  // Fetch characters data
  const { data, isLoading, isError, error, refetch } = useCharacters(filters);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    router.push("/");
  };

  const currentPage = filters.page || PAGINATION.DEFAULT_PAGE;
  const totalPages = data?.info.pages || 0;
  const totalItems = data?.info.count || 0;
  const characters = data?.results || [];
  const searchTerm = filters.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resource Explorer
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Explore characters from the Rick and Morty universe
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Character Grid */}
        <div className="mb-8">
          <CharacterGrid
            characters={characters}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            searchTerm={searchTerm}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Pagination */}
        {!isLoading && !isError && characters.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              showInfo={true}
            />
          </div>
        )}
      </main>
    </div>
  );
}
