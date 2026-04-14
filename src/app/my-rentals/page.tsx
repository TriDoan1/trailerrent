import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ClipboardCheck, Clock3, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { activeRentals, rentalHistory } from "@/data/rentals";
import { getTrailerById } from "@/data/trailers";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function MyRentalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-linear-to-br from-navy-900 via-navy-700 to-orange-500 px-6 py-8 text-white shadow-sm sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">
          My rentals
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Pickup details, return steps, and your next booking in one place.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-orange-100 sm:text-base">
          This dashboard uses mock renter data so the full post-booking experience
          is visible without sign-in.
        </p>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Active rentals
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">
              Current and upcoming reservations
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {activeRentals.map((rental) => {
            const trailer = getTrailerById(rental.trailerId);
            if (!trailer) {
              return null;
            }

            const statusLabel =
              rental.status === "upcoming" ? "Upcoming" : "Active now";

            return (
              <Card key={rental.id} className="rounded-3xl">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-gray-100">
                  <Image
                    src={trailer.photos[0]}
                    alt={`${trailer.name} staged for pickup`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 32vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,27,45,0.12),_rgba(15,27,45,0.34))]" />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-white/92 px-4 py-3 shadow-lg shadow-navy-900/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                      Pickup-ready trailer
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy-900">
                      {trailer.hitchSize} hitch • {trailer.payloadCapacityLbs.toLocaleString()} lb payload
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                      {statusLabel}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-navy-900">
                      {trailer.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{trailer.tagline}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Reservation
                    </p>
                    <p className="mt-1 font-semibold text-navy-900">{rental.id}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                      <CalendarDays className="h-4 w-4 text-orange-500" />
                      Rental dates
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {formatDate(rental.startDate)} to {formatDate(rental.endDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                      <Clock3 className="h-4 w-4 text-orange-500" />
                      Pickup hours
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{rental.pickupHours}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">Pickup address</p>
                      <p className="mt-1 text-sm text-gray-600">{rental.pickupAddress}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        Gate code: <span className="font-semibold text-navy-900">{rental.gateCode}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-orange-500" />
                    <p className="text-sm font-semibold text-navy-900">Return checklist</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {rental.returnChecklist.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Rental history
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy-900">
            Quick re-book from past jobs and weekend trips
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          {rentalHistory.map((rental) => {
            const trailer = getTrailerById(rental.trailerId);
            if (!trailer) {
              return null;
            }

            return (
              <Card
                key={rental.id}
                className="rounded-3xl lg:flex lg:items-center lg:justify-between"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-bold text-navy-900">{trailer.name}</p>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                      Completed
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {formatDate(rental.startDate)} to {formatDate(rental.endDate)} •{" "}
                    {trailer.tagline}
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <Link href={`/booking?trailerId=${trailer.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Re-book this trailer
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
