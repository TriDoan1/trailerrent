import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Car, Hammer, Home, ShieldCheck, Tent, TreePine } from "lucide-react";

const useCases = [
  { id: "moving", label: "Moving", icon: Home },
  { id: "vehicle-transport", label: "Vehicle Transport", icon: Car },
  { id: "landscaping", label: "Landscaping", icon: TreePine },
  { id: "construction", label: "Construction", icon: Hammer },
  { id: "camping", label: "Camping", icon: Tent },
];

const heroBlurDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 11'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='8' y1='0' x2='8' y2='11' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230F1B2D'/%3E%3Cstop offset='0.6' stop-color='%2321456A'/%3E%3Cstop offset='1' stop-color='%23F1D2A4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='11' fill='url(%23g)'/%3E%3Cpath d='M0 7L3 6.1L5.8 6.5L8.2 5.2L11.3 5.9L13.7 4.7L16 5.1V11H0V7Z' fill='%231E3A5F'/%3E%3Cpath d='M0 9.1C2.2 8.8 4.1 8.8 6.2 9.2C8.1 9.6 10.2 10.4 12.4 10.3C13.8 10.2 14.9 9.8 16 9.5V11H0V9.1Z' fill='%232E2B30'/%3E%3C/svg%3E";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,108,46,0.22),_transparent_32%),radial-gradient(circle_at_80%_25%,_rgba(255,255,255,0.08),_transparent_22%),linear-gradient(135deg,_rgba(15,27,45,0.96),_rgba(30,58,95,0.88))]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,_rgba(15,27,45,0),_rgba(15,27,45,0.86))]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm text-gray-200 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            Tow-ready rentals for Portland pickups and weekend jobs
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              What are you hauling this week?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-200 sm:text-xl">
              Match your project to the right trailer, lock dates in under a minute,
              and leave the lot with the paperwork and safety checks handled.
            </p>
          </div>

          <form
            action="/browse"
            className="mt-8 grid gap-3 rounded-3xl border border-white/12 bg-white/10 p-4 shadow-2xl shadow-navy-900/35 backdrop-blur-md sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="rounded-2xl border border-white/10 bg-white/95 p-3">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                <CalendarDays className="h-4 w-4 text-orange-500" />
                Pickup date
              </span>
              <input
                type="date"
                name="startDate"
                className="w-full bg-transparent text-sm font-medium text-navy-900 outline-none"
                aria-label="Pickup date"
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/95 p-3">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                Return date
              </span>
              <input
                type="date"
                name="endDate"
                className="w-full bg-transparent text-sm font-medium text-navy-900 outline-none"
                aria-label="Return date"
              />
            </label>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Browse availability
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              Same-day pickup options
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              Brake controller add-ons available
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              Insurance included at checkout
            </span>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <Link
                  key={uc.id}
                  href={`/browse?useCase=${uc.id}`}
                  className="group rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-orange-500/60 hover:bg-white/14"
                >
                  <Icon className="h-7 w-7 text-orange-500 transition group-hover:text-white" />
                  <span className="mt-4 block text-sm font-semibold text-white">
                    {uc.label}
                  </span>
                  <span className="mt-1 block text-xs text-gray-300">
                    Explore matches
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-orange-500/12 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/6 p-3 shadow-2xl shadow-navy-900/40 backdrop-blur-sm">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] border border-white/8">
              <Image
                src="/images/hero-trailer-road.svg"
                alt="Pickup truck towing an enclosed trailer down an open road at sunset"
                fill
                preload
                placeholder="blur"
                blurDataURL={heroBlurDataUrl}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,27,45,0.08),_rgba(15,27,45,0.26))]" />
              <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/88 px-4 py-3 text-sm text-navy-900 shadow-lg shadow-navy-900/10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                  Most booked
                </p>
                <p className="mt-1 text-base font-bold">6&apos; x 12&apos; enclosed cargo</p>
                <p className="mt-1 text-gray-600">Fits most apartment moves and furniture runs</p>
              </div>
              <div className="absolute bottom-4 right-4 max-w-[16rem] rounded-2xl border border-white/15 bg-navy-900/82 px-4 py-3 text-white shadow-lg shadow-navy-900/35">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Weekend special
                </p>
                <p className="mt-2 text-2xl font-bold">$75<span className="text-sm font-medium text-gray-300">/day</span></p>
                <p className="mt-1 text-sm text-gray-300">
                  Friday pickup available with walkthrough and tie-down kit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
