import { Suspense } from "react";
import { BookingPageContent } from "./BookingPageContent";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-navy-900">
              Loading your booking
            </h1>
            <p className="mt-2 text-gray-600">
              Pulling trailer details and pricing options.
            </p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
