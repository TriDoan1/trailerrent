import { Suspense } from "react";
import { BrowseContent } from "./BrowseContent";

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Browse Trailers
            </h1>
            <p className="text-gray-600 mt-1">Loading trailers...</p>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
