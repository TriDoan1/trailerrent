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
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Featured Trailers
            </h2>
            <p className="text-gray-600 mt-1">
              Our most popular rentals, ready for pickup today.
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
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featured.map((trailer) => (
            <div
              key={trailer.id}
              className="min-w-[280px] sm:min-w-[300px] snap-start flex-shrink-0"
            >
              <TrailerCard trailer={trailer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
