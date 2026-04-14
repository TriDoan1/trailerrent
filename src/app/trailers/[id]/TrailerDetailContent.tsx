"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  CircleX,
  Dot,
  Shield,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TrailerCard } from "@/components/browse/TrailerCard";
import { getReviewsByTrailerId } from "@/data/reviews";
import { trailers } from "@/data/trailers";
import { vehicles } from "@/data/vehicles";
import { calculateTotal, daysBetween } from "@/lib/pricing";
import { findVehicle, getTowMatch, getTowMatchLabel } from "@/lib/tow-match";
import type { TowMatchResult, Trailer } from "@/lib/types";

type InsuranceTier = "none" | "basic" | "premium";

interface PricingAccessory {
  id: string;
  name: string;
  dailyRate: number;
  flatRate?: number;
  description: string;
}

const insuranceOptions: Array<{
  value: InsuranceTier;
  label: string;
  priceLabel: string;
}> = [
  { value: "none", label: "No coverage", priceLabel: "$0/day" },
  { value: "basic", label: "Basic", priceLabel: "$15/day" },
  { value: "premium", label: "Premium", priceLabel: "$25/day" },
];

const accessoryOptions: PricingAccessory[] = [
  {
    id: "tie-downs",
    name: "Tie-down kit",
    dailyRate: 8,
    description: "Extra straps and anchors for furniture, equipment, and pallets.",
  },
  {
    id: "ramps",
    name: "Portable loading ramps",
    dailyRate: 12,
    description: "Great for mowers, ATVs, and wheeled equipment.",
  },
  {
    id: "lock",
    name: "Coupler + hitch lock",
    dailyRate: 5,
    description: "Adds peace of mind for overnight stops and job sites.",
  },
  {
    id: "hitch-ball",
    name: "Correct hitch ball",
    dailyRate: 0,
    flatRate: 18,
    description: "One-time add-on when you need the right ball size for pickup.",
  },
];

const unavailableDatesByTrailer: Record<string, string[]> = {
  "enclosed-6x12": ["2026-04-16", "2026-04-17", "2026-04-24", "2026-04-25"],
  "enclosed-7x16": ["2026-04-19", "2026-04-20", "2026-04-21"],
  "utility-5x10": ["2026-04-18", "2026-04-26"],
  "utility-6x14": ["2026-04-22", "2026-04-23", "2026-04-29"],
  "flatbed-7x18": ["2026-04-20", "2026-04-27"],
  "dump-6x10": ["2026-04-17", "2026-04-18", "2026-04-19"],
  "car-hauler-7x18": ["2026-04-25", "2026-04-26"],
  "travel-compact": ["2026-04-18", "2026-04-19", "2026-04-30"],
  "utility-4x6": ["2026-04-15", "2026-04-22"],
  "enclosed-8x20": ["2026-04-28", "2026-04-29", "2026-04-30"],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildCalendarDays(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);
    return current;
  });
}

function getInitialDates() {
  const start = new Date("2026-04-18T12:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 3);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function renderStars(rating: number, size = "w-4 h-4") {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`${size} ${
        index < Math.round(rating)
          ? "fill-yellow-500 text-yellow-500"
          : "text-gray-300"
      }`}
    />
  ));
}

export function TrailerDetailContent({ trailer }: { trailer: Trailer }) {
  const initialDates = useMemo(() => getInitialDates(), []);
  const [activePhoto, setActivePhoto] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date("2026-04-01T12:00:00")
  );
  const [selectedYear, setSelectedYear] = useState<number | "">(
    vehicles[0]?.year ?? ""
  );
  const [selectedMake, setSelectedMake] = useState(vehicles[0]?.make ?? "");
  const [selectedModel, setSelectedModel] = useState(vehicles[0]?.model ?? "");
  const [towResult, setTowResult] = useState<TowMatchResult>("unknown");
  const [checkedVehicleLabel, setCheckedVehicleLabel] = useState("");
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);
  const [insuranceTier, setInsuranceTier] = useState<InsuranceTier>("basic");
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([
    "tie-downs",
  ]);

  const reviews = useMemo(() => getReviewsByTrailerId(trailer.id), [trailer.id]);
  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return trailer.rating;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews, trailer.rating]);

  const similarTrailers = useMemo(() => {
    const sameType = trailers.filter(
      (item) => item.id !== trailer.id && item.type === trailer.type
    );
    const fallback = trailers.filter(
      (item) => item.id !== trailer.id && !sameType.some((entry) => entry.id === item.id)
    );
    return [...sameType, ...fallback].slice(0, 3);
  }, [trailer.id, trailer.type]);

  const selectedAccessories = useMemo(
    () =>
      accessoryOptions.filter((accessory) =>
        selectedAccessoryIds.includes(accessory.id)
      ),
    [selectedAccessoryIds]
  );

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      return 1;
    }
    return daysBetween(startDate, endDate);
  }, [endDate, startDate]);

  const flatAccessoryTotal = useMemo(
    () =>
      selectedAccessories.reduce((sum, accessory) => sum + (accessory.flatRate ?? 0), 0),
    [selectedAccessories]
  );

  const pricing = useMemo(() => {
    const dailyAccessories = selectedAccessories.map((accessory) => ({
      id: accessory.id,
      name: accessory.name,
      dailyRate: accessory.dailyRate,
      description: accessory.description,
    }));
    const base = calculateTotal(
      trailer,
      rentalDays,
      insuranceTier,
      dailyAccessories
    );
    const accessoriesTotal = base.accessoriesTotal + flatAccessoryTotal;
    const subtotal = base.rental + base.insurance + accessoriesTotal;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return {
      ...base,
      accessoriesTotal,
      subtotal,
      tax,
      total,
    };
  }, [flatAccessoryTotal, insuranceTier, rentalDays, selectedAccessories, trailer]);

  const availableYears = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.year))).sort((a, b) => b - a),
    []
  );
  const availableMakes = useMemo(() => {
    if (!selectedYear) {
      return [];
    }
    return Array.from(
      new Set(
        vehicles
          .filter((vehicle) => vehicle.year === selectedYear)
          .map((vehicle) => vehicle.make)
      )
    ).sort();
  }, [selectedYear]);
  const availableModels = useMemo(() => {
    if (!selectedYear || !selectedMake) {
      return [];
    }
    return Array.from(
      new Set(
        vehicles
          .filter(
            (vehicle) =>
              vehicle.year === selectedYear && vehicle.make === selectedMake
          )
          .map((vehicle) => vehicle.model)
      )
    ).sort();
  }, [selectedMake, selectedYear]);

  const unavailableDates = unavailableDatesByTrailer[trailer.id] ?? [];
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  function handleTowCheck() {
    if (!selectedYear || !selectedMake || !selectedModel) {
      setTowResult("unknown");
      setCheckedVehicleLabel("Select year, make, and model first");
      return;
    }

    const vehicle = findVehicle(selectedYear, selectedMake, selectedModel);
    if (!vehicle) {
      setTowResult("unknown");
      setCheckedVehicleLabel(`${selectedYear} ${selectedMake} ${selectedModel}`);
      return;
    }

    setTowResult(getTowMatch(vehicle.maxTowCapacityLbs, trailer.grossWeightLbs));
    setCheckedVehicleLabel(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  }

  function handleUnlistedVehicle() {
    setTowResult("unknown");
    setCheckedVehicleLabel("Unlisted vehicle");
  }

  function toggleAccessory(accessoryId: string) {
    setSelectedAccessoryIds((current) =>
      current.includes(accessoryId)
        ? current.filter((item) => item !== accessoryId)
        : [...current, accessoryId]
    );
  }

  const towResultStyles: Record<TowMatchResult, string> = {
    green: "border-green-500 bg-green-500/10 text-green-500",
    yellow: "border-yellow-500 bg-yellow-500/10 text-yellow-500",
    red: "border-red-500 bg-red-500/10 text-red-500",
    unknown: "border-gray-300 bg-gray-100 text-gray-600",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-orange-500">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/browse" className="transition-colors hover:text-orange-500">
          Browse
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-600">{trailer.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-linear-to-br from-navy-900 via-navy-700 to-orange-500 p-6">
              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_top_left,white,transparent_45%),linear-gradient(135deg,transparent,rgba(255,255,255,0.3))]" />
              <div className="relative max-w-lg text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">
                  Gallery view {activePhoto + 1}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {trailer.name}
                </h1>
                <p className="mt-3 text-sm text-orange-100 sm:text-base">
                  {trailer.photos[activePhoto] ?? trailer.tagline}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {trailer.photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setActivePhoto(index)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  activePhoto === index
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-100 bg-white hover:border-orange-500"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Photo {index + 1}
                </p>
                <p className="mt-2 text-sm font-semibold text-navy-900">{photo}</p>
              </button>
            ))}
          </div>

          <Card className="rounded-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Overview
            </p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">
              {trailer.tagline}
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              {trailer.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {trailer.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-3xl border-orange-500/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                  Reserve this trailer
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {averageRating} average rating
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-navy-900">
                  {formatCurrency(trailer.dailyRate)}
                </p>
                <p className="text-sm text-gray-400">per day</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Weekly rate</span>
                <span className="font-semibold text-navy-900">
                  {formatCurrency(trailer.weeklyRate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Gross weight</span>
                <span className="font-semibold text-navy-900">
                  {trailer.grossWeightLbs.toLocaleString()} lbs
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Hitch</span>
                <span className="font-semibold text-navy-900">
                  {trailer.hitchType} • {trailer.hitchSize}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link href={`/booking?trailerId=${trailer.id}`}>
                <Button size="lg" className="w-full">
                  Book now
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg" className="w-full">
                  Compare other trailers
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="rounded-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Quick specs
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Dimensions
                </p>
                <p className="mt-2 text-lg font-bold text-navy-900">
                  {trailer.dimensions.lengthFt}&apos; x {trailer.dimensions.widthFt}
                  &apos; x {trailer.dimensions.heightFt}&apos;
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Payload
                </p>
                <p className="mt-2 text-lg font-bold text-navy-900">
                  {trailer.payloadCapacityLbs.toLocaleString()} lbs
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Empty weight
                </p>
                <p className="mt-2 text-lg font-bold text-navy-900">
                  {trailer.emptyWeightLbs.toLocaleString()} lbs
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Hitch size
                </p>
                <p className="mt-2 text-lg font-bold text-navy-900">
                  {trailer.hitchSize}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-2">
        <Card className="rounded-3xl">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Tow match</h2>
              <p className="text-sm text-gray-600">
                Check a known vehicle from the mock vehicle library.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-600">
              Year
              <select
                value={selectedYear}
                onChange={(event) => {
                  const nextYear = Number(event.target.value);
                  setSelectedYear(nextYear);
                  const nextMake =
                    vehicles.find((vehicle) => vehicle.year === nextYear)?.make ?? "";
                  setSelectedMake(nextMake);
                  const nextModel =
                    vehicles.find(
                      (vehicle) =>
                        vehicle.year === nextYear && vehicle.make === nextMake
                    )?.model ?? "";
                  setSelectedModel(nextModel);
                }}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-colors focus:border-orange-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-600">
              Make
              <select
                value={selectedMake}
                onChange={(event) => {
                  const nextMake = event.target.value;
                  setSelectedMake(nextMake);
                  const nextModel =
                    vehicles.find(
                      (vehicle) =>
                        vehicle.year === selectedYear && vehicle.make === nextMake
                    )?.model ?? "";
                  setSelectedModel(nextModel);
                }}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-colors focus:border-orange-500"
              >
                {availableMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-600">
              Model
              <select
                value={selectedModel}
                onChange={(event) => setSelectedModel(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-colors focus:border-orange-500"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleUnlistedVehicle}
            className="mt-4 text-sm font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-orange-500 hover:decoration-orange-500"
          >
            My vehicle isn&apos;t listed
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={handleTowCheck}>Check compatibility</Button>
            <p className="text-sm text-gray-400">
              Green: &gt; 120% of trailer gross weight. Yellow: within margin. Red:
              under capacity.
            </p>
          </div>

          <div
            className={`mt-6 rounded-2xl border p-4 ${towResultStyles[towResult]}`}
          >
            <div className="flex items-start gap-3">
              {towResult === "green" ? (
                <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
              ) : towResult === "yellow" ? (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : towResult === "red" ? (
                <CircleX className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <Truck className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="font-semibold">{getTowMatchLabel(towResult)}</p>
                <p className="mt-1 text-sm opacity-80">
                  {checkedVehicleLabel || "Use the selector to check your vehicle."}
                </p>
                <p className="mt-2 text-sm opacity-80">
                  Trailer gross weight: {trailer.grossWeightLbs.toLocaleString()} lbs
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Pricing calculator</h2>
              <p className="text-sm text-gray-600">
                Live totals with insurance, accessories, tax, and weekly discount.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-600">
              Pickup
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-colors focus:border-orange-500"
              />
            </label>
            <label className="text-sm font-medium text-gray-600">
              Return
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition-colors focus:border-orange-500"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600">Insurance</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {insuranceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInsuranceTier(option.value)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    insuranceTier === option.value
                      ? "border-orange-500 bg-orange-100"
                      : "border-gray-100 bg-white hover:border-orange-500"
                  }`}
                >
                  <p className="font-semibold text-navy-900">{option.label}</p>
                  <p className="mt-1 text-sm text-gray-400">{option.priceLabel}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600">Accessories</p>
            <div className="mt-3 grid gap-3">
              {accessoryOptions.map((accessory) => {
                const selected = selectedAccessoryIds.includes(accessory.id);

                return (
                  <button
                    key={accessory.id}
                    type="button"
                    onClick={() => toggleAccessory(accessory.id)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      selected
                        ? "border-orange-500 bg-orange-100"
                        : "border-gray-100 bg-white hover:border-orange-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy-900">{accessory.name}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {accessory.description}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-orange-500">
                        {accessory.flatRate
                          ? `${formatCurrency(accessory.flatRate)} flat`
                          : `${formatCurrency(accessory.dailyRate)}/day`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {formatLongDate(startDate)} to {formatLongDate(endDate)}
                </p>
                <p className="text-xl font-bold text-navy-900">
                  {rentalDays} rental day{rentalDays === 1 ? "" : "s"}
                </p>
              </div>
              {rentalDays >= 7 ? (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-500">
                  Weekly discount applied
                </span>
              ) : null}
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Base rental</span>
                <span className="font-semibold text-navy-900">
                  {formatCurrency(pricing.rental)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Insurance</span>
                <span className="font-semibold text-navy-900">
                  {formatCurrency(pricing.insurance)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accessories</span>
                <span className="font-semibold text-navy-900">
                  {formatCurrency(pricing.accessoriesTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-navy-900">
                  {formatCurrency(pricing.tax)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 text-base">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy-900">Total</span>
                  <span className="text-2xl font-bold text-navy-900">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-navy-900">
                  Availability calendar
                </h2>
                <p className="text-sm text-gray-600">
                  Gray days are unavailable. Green days are open to book.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="rounded-full border border-gray-200 p-2 text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-lg font-bold text-navy-900">
                {formatMonth(calendarMonth)}
              </p>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="rounded-full border border-gray-200 p-2 text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const dayKey = day.toISOString().slice(0, 10);
                const inMonth = day.getMonth() === calendarMonth.getMonth();
                const unavailable = unavailableDates.includes(dayKey);

                return (
                  <div
                    key={dayKey}
                    className={`rounded-2xl border px-2 py-3 text-center text-sm ${
                      !inMonth
                        ? "border-transparent bg-transparent text-gray-300"
                        : unavailable
                          ? "border-gray-200 bg-gray-100 text-gray-400"
                          : "border-green-500/20 bg-green-500/10 text-green-500"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-navy-900">
                Recommended accessories
              </h2>
              <p className="text-sm text-gray-600">
                Common add-ons for this trailer type.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {accessoryOptions.map((accessory) => (
              <div
                key={accessory.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-navy-900">{accessory.name}</p>
                  <p className="text-sm font-semibold text-orange-500">
                    {accessory.flatRate
                      ? `${formatCurrency(accessory.flatRate)} flat`
                      : `${formatCurrency(accessory.dailyRate)}/day`}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{accessory.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-3xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Reviews
              </p>
              <h2 className="mt-2 text-2xl font-bold text-navy-900">
                Customer feedback
              </h2>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                {renderStars(averageRating, "h-5 w-5")}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {averageRating} from {reviews.length} reviews
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {reviews.slice(0, 4).map((review) => (
              <div
                key={`${review.trailerId}-${review.visitorName}-${review.date}`}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy-900">{review.visitorName}</p>
                  <Dot className="h-4 w-4 text-gray-300" />
                  <p className="text-sm text-gray-400">{formatLongDate(review.date)}</p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <p className="mt-3 font-semibold text-navy-900">{review.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{review.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Similar trailers
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy-900">
            Keep comparing before you book
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {similarTrailers.map((item) => (
              <TrailerCard key={item.id} trailer={item} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
