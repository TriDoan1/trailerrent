"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trailers } from "@/data/trailers";
import { useCases } from "@/data/use-cases";
import { FilterPanel, type Filters } from "@/components/browse/FilterPanel";
import { SortControls, type SortOption } from "@/components/browse/SortControls";
import { TrailerGrid } from "@/components/browse/TrailerGrid";
import type { Trailer } from "@/lib/types";

function getInitialFilters(searchParams: URLSearchParams): Filters {
  const useCase = searchParams.get("useCase");
  const type = searchParams.get("type");

  return {
    useCase: useCase ? useCase.split(",") : [],
    type: type ? (type.split(",") as Trailer["type"][]) : [],
  };
}

function filterTrailers(all: Trailer[], filters: Filters): Trailer[] {
  let result = all;

  if (filters.useCase.length > 0) {
    const recommendedTypes = new Set(
      filters.useCase.flatMap((ucId) => {
        const uc = useCases.find((u) => u.id === ucId);
        return uc ? uc.recommendedTypes : [];
      })
    );
    result = result.filter((t) => recommendedTypes.has(t.type));
  }

  if (filters.type.length > 0) {
    result = result.filter((t) => filters.type.includes(t.type));
  }

  return result;
}

function sortTrailers(list: Trailer[], sort: SortOption): Trailer[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.dailyRate - b.dailyRate);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.dailyRate - a.dailyRate);
      break;
    case "size":
      sorted.sort(
        (a, b) =>
          b.dimensions.lengthFt * b.dimensions.widthFt -
          a.dimensions.lengthFt * a.dimensions.widthFt
      );
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }
  return sorted;
}

export function BrowseContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() =>
    getInitialFilters(searchParams)
  );
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setFilters(getInitialFilters(searchParams));
  }, [searchParams]);

  const filtered = useMemo(() => filterTrailers(trailers, filters), [filters]);
  const sorted = useMemo(() => sortTrailers(filtered, sort), [filtered, sort]);

  function resetFilters() {
    setFilters({ useCase: [], type: [] });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
          Browse Trailers
        </h1>
        <p className="text-gray-600 mt-1">
          Find the right trailer for your project.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 lg:hidden">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          mobileOpen={mobileFilterOpen}
          onMobileToggle={() => setMobileFilterOpen(!mobileFilterOpen)}
        />
        <SortControls sort={sort} onChange={setSort} resultCount={sorted.length} />
      </div>

      <div className="flex gap-8">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          mobileOpen={mobileFilterOpen}
          onMobileToggle={() => setMobileFilterOpen(!mobileFilterOpen)}
        />

        <div className="flex-1 min-w-0">
          <div className="hidden lg:block mb-6">
            <SortControls sort={sort} onChange={setSort} resultCount={sorted.length} />
          </div>
          <TrailerGrid trailers={sorted} onReset={resetFilters} />
        </div>
      </div>
    </div>
  );
}
