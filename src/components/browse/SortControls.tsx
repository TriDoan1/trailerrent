"use client";

export type SortOption = "price-asc" | "price-desc" | "size" | "rating";

interface SortControlsProps {
  sort: SortOption;
  onChange: (sort: SortOption) => void;
  resultCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "size", label: "Size: Largest First" },
  { value: "rating", label: "Rating: Highest First" },
];

export function SortControls({ sort, onChange, resultCount }: SortControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        <span className="font-medium text-navy-900">{resultCount}</span>{" "}
        {resultCount === 1 ? "trailer" : "trailers"} found
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:inline">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
