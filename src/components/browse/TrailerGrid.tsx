import { Search } from "lucide-react";
import { TrailerCard } from "./TrailerCard";
import { Button } from "@/components/ui/Button";
import type { Trailer } from "@/lib/types";

interface TrailerGridProps {
  trailers: Trailer[];
  onReset: () => void;
}

export function TrailerGrid({ trailers, onReset }: TrailerGridProps) {
  if (trailers.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-navy-900 mb-2">
          No trailers match your filters
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting or removing some filters to see more results.
        </p>
        <Button variant="outline" onClick={onReset}>
          Reset All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {trailers.map((trailer) => (
        <TrailerCard key={trailer.id} trailer={trailer} />
      ))}
    </div>
  );
}
