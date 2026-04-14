"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFeaturedTrailers } from "@/data/trailers";
import { TrailerCard } from "@/components/browse/TrailerCard";

export function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedTrailers();

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Featured fleet
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Featured Trailers
            </h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              Four proven rentals customers book first for moves, equipment, and
              short-notice projects.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0"
        >
          {featured.map((trailer) => (
            <div
              key={trailer.id}
              className="min-w-[280px] shrink-0 snap-start sm:min-w-[300px]"
            >
              <TrailerCard trailer={trailer} />
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-500 sm:hidden">
          Swipe to compare popular rentals.
        </p>
      </div>
    </section>
  );
}
