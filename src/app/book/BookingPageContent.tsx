"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Shield,
  Truck,
} from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { trailers } from "@/data/trailers";
import { vehicles } from "@/data/vehicles";
import { calculateTotal, daysBetween } from "@/lib/pricing";
import type { Accessory, Trailer } from "@/lib/types";

const stepLabels = ["Dates & add-ons", "Your info", "Review & pay"];

const accessoryOptions: Accessory[] = [
  {
    id: "ratchet-straps",
    name: "4-pack ratchet straps",
    dailyRate: 8,
    description: "Heavy-duty straps rated for equipment, vehicles, and pallets.",
  },
  {
    id: "hitch-lock",
    name: "Hitch + coupler lock kit",
    dailyRate: 5,
    description: "Extra security for overnight parking and jobsite stops.",
  },
  {
    id: "moving-blankets",
    name: "Moving blanket bundle",
    dailyRate: 6,
    description: "Protect furniture, appliances, and finished surfaces in transit.",
  },
  {
    id: "brake-controller",
    name: "Wireless brake controller",
    dailyRate: 12,
    description: "Recommended for larger trailers and first-time renters.",
  },
];

const insuranceOptions = [
  {
    value: "none" as const,
    label: "Self-covered",
    priceLabel: "$0/day",
    description: "Use your own auto policy and decline optional protection.",
  },
  {
    value: "basic" as const,
    label: "Basic protection",
    priceLabel: "$15/day",
    description: "Adds roadside assistance and reduced-deductible trailer coverage.",
  },
  {
    value: "premium" as const,
    label: "Premium protection",
    priceLabel: "$25/day",
    description: "Best for long trips or expensive cargo with higher coverage limits.",
  },
];

const pickupDetails = {
  address: "8240 SE Powell Blvd, Portland, OR 97206",
  hours: "Mon-Fri 7am-6pm, Sat 8am-4pm, Sun 9am-2pm",
  gateCode: "2719#",
  checklist: [
    "Bring a valid driver license and proof of towing insurance.",
    "Arrive with the correct hitch size and working 7-pin or 4-pin connector.",
    "Plan 15 minutes for safety walk-through, strap check, and brake-light test.",
  ],
};

interface BookingFormState {
  startDate: string;
  endDate: string;
  insuranceTier: "none" | "basic" | "premium";
  accessoryIds: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
    driversLicense: string;
    vehicle: string;
  };
}

type ContactErrors = Partial<Record<keyof BookingFormState["contact"], string>>;

function getDefaultDates() {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function buildReferenceNumber(trailer: Trailer) {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `TR-${stamp}-${trailer.id.slice(0, 4).toUpperCase()}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function BookingPageContent() {
  const searchParams = useSearchParams();
  const trailerId = searchParams.get("trailerId");
  const trailer = useMemo(
    () => trailers.find((item) => item.id === trailerId) ?? trailers[0],
    [trailerId]
  );

  return (
    <BookingFlow
      key={trailer.id}
      trailer={trailer}
      requestedTrailerId={trailerId}
    />
  );
}

function BookingFlow({
  trailer,
  requestedTrailerId,
}: {
  trailer: Trailer;
  requestedTrailerId: string | null;
}) {
  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [stepOneError, setStepOneError] = useState("");
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [termsError, setTermsError] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [formState, setFormState] = useState<BookingFormState>({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
    insuranceTier: "basic",
    accessoryIds: ["ratchet-straps"],
    contact: {
      name: "",
      phone: "",
      email: "",
      driversLicense: "",
      vehicle: vehicles[0]
        ? `${vehicles[0].year} ${vehicles[0].make} ${vehicles[0].model}`
        : "",
    },
  });

  const selectedAccessories = useMemo(
    () =>
      accessoryOptions.filter((accessory) =>
        formState.accessoryIds.includes(accessory.id)
      ),
    [formState.accessoryIds]
  );

  const rentalDays = useMemo(() => {
    if (!formState.startDate || !formState.endDate) {
      return 1;
    }
    return daysBetween(formState.startDate, formState.endDate);
  }, [formState.endDate, formState.startDate]);

  const pricing = useMemo(
    () =>
      calculateTotal(
        trailer,
        rentalDays,
        formState.insuranceTier,
        selectedAccessories
      ),
    [formState.insuranceTier, rentalDays, selectedAccessories, trailer]
  );

  function updateContactField(
    field: keyof BookingFormState["contact"],
    value: string
  ) {
    setFormState((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }));

    setContactErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleAccessory(accessoryId: string) {
    setFormState((current) => ({
      ...current,
      accessoryIds: current.accessoryIds.includes(accessoryId)
        ? current.accessoryIds.filter((id) => id !== accessoryId)
        : [...current.accessoryIds, accessoryId],
    }));
  }

  function validateStepOne() {
    if (!formState.startDate || !formState.endDate) {
      setStepOneError("Select both pickup and return dates to continue.");
      return false;
    }

    if (new Date(formState.endDate) <= new Date(formState.startDate)) {
      setStepOneError("Return date must be after pickup date.");
      return false;
    }

    setStepOneError("");
    return true;
  }

  function validateStepTwo() {
    const nextErrors: ContactErrors = {};
    const { contact } = formState;

    if (!contact.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!contact.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(contact.phone.trim())) {
      nextErrors.phone = "Use a valid US phone number.";
    }

    if (!contact.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      nextErrors.email = "Use a valid email address.";
    }

    if (!contact.driversLicense.trim()) {
      nextErrors.driversLicense = "Driver license number is required.";
    }

    if (!contact.vehicle.trim()) {
      nextErrors.vehicle = "Tow vehicle information is required.";
    }

    setContactErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goToNextStep() {
    if (step === 1 && !validateStepOne()) {
      return;
    }

    if (step === 2 && !validateStepTwo()) {
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  function handleConfirmBooking() {
    if (!acceptedTerms) {
      setTermsError("You must accept the rental terms before confirming.");
      return;
    }

    setTermsError("");
    setConfirmationNumber(buildReferenceNumber(trailer));
  }

  if (confirmationNumber) {
    return (
      <div className="mx-auto max-w-5xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-[2rem] border border-orange-100 p-0 shadow-lg">
          <div className="bg-gradient-to-r from-navy-900 via-navy-700 to-navy-900 px-5 py-10 text-white sm:px-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-10 w-10 text-orange-500" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-100">
                  Booking confirmed
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">
                  {trailer.name} is reserved.
                </h1>
                <p className="mt-3 max-w-2xl text-gray-300">
                  Confirmation {confirmationNumber}. A pickup email and text
                  message will be sent to {formState.contact.email}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-3xl bg-gray-50">
              <h2 className="text-xl font-bold text-navy-900">
                Pickup instructions
              </h2>
              <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-navy-900">Location</p>
                  <p>{pickupDetails.address}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Pickup window</p>
                  <p>{pickupDetails.hours}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Gate code</p>
                  <p>{pickupDetails.gateCode}</p>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Return checklist</p>
                  <ul className="mt-2 space-y-2">
                    {pickupDetails.checklist.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl">
              <h2 className="text-xl font-bold text-navy-900">Reservation</h2>
              <div className="mt-5 space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <span>Trailer</span>
                  <span className="text-right font-semibold text-navy-900">
                    {trailer.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <span>Dates</span>
                  <span className="text-right font-semibold text-navy-900">
                    {formatDate(formState.startDate)} to{" "}
                    {formatDate(formState.endDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <span>Driver</span>
                  <span className="text-right font-semibold text-navy-900">
                    {formState.contact.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <span>Total charged</span>
                  <span className="text-right text-lg font-bold text-navy-900">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Browse more trailers
                </Link>
                <Link
                  href={`/book?trailerId=${trailer.id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Book another rental
                </Link>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-700 to-navy-900 px-5 py-10 text-white shadow-lg sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-100">
              Three-step booking
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              Reserve your trailer in under five minutes.
            </h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Lock in dates, choose protection, and finish checkout before you
              arrive at the yard.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-orange-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <CalendarDays className="h-4 w-4" />
                No deposit required
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Shield className="h-4 w-4" />
                Protection options included
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Truck className="h-4 w-4" />
                Pickup in Portland
              </span>
            </div>
          </div>

          <StepIndicator currentStep={step} labels={stepLabels} />

          {step === 1 ? (
            <Card className="rounded-[2rem]">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    Dates and add-ons
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Confirm your rental window and optional equipment.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Pickup date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                />
                <Input
                  label="Return date"
                  type="date"
                  min={formState.startDate || new Date().toISOString().slice(0, 10)}
                  value={formState.endDate}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>

              {stepOneError ? (
                <p className="mt-4 text-sm font-medium text-red-500">
                  {stepOneError}
                </p>
              ) : null}

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Protection
                </h3>
                <div className="mt-4 grid gap-4">
                  {insuranceOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                        formState.insuranceTier === option.value
                          ? "border-orange-500 bg-orange-100/60"
                          : "border-gray-200 bg-white hover:border-navy-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="insuranceTier"
                              checked={formState.insuranceTier === option.value}
                              onChange={() =>
                                setFormState((current) => ({
                                  ...current,
                                  insuranceTier: option.value,
                                }))
                              }
                              className="h-4 w-4 accent-orange-500"
                            />
                            <p className="font-semibold text-navy-900">
                              {option.label}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                          {option.priceLabel}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Accessories
                </h3>
                <div className="mt-4 grid gap-4">
                  {accessoryOptions.map((accessory) => {
                    const checked = formState.accessoryIds.includes(accessory.id);

                    return (
                      <label
                        key={accessory.id}
                        className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                          checked
                            ? "border-navy-500 bg-navy-900/4"
                            : "border-gray-200 bg-white hover:border-navy-500"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAccessory(accessory.id)}
                            className="mt-1 h-4 w-4 rounded accent-orange-500"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-navy-900">
                                {accessory.name}
                              </p>
                              <span className="text-sm font-semibold text-orange-600">
                                {formatCurrency(accessory.dailyRate)}/day
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {accessory.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="rounded-[2rem]">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    Driver and tow vehicle
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    We use this information for pickup verification and tow fit.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={formState.contact.name}
                  onChange={(event) => updateContactField("name", event.target.value)}
                  error={contactErrors.name}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="503-555-0112"
                  value={formState.contact.phone}
                  onChange={(event) => updateContactField("phone", event.target.value)}
                  error={contactErrors.phone}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={formState.contact.email}
                  onChange={(event) => updateContactField("email", event.target.value)}
                  error={contactErrors.email}
                />
                <Input
                  label="Driver license number"
                  placeholder="OR D1234567"
                  value={formState.contact.driversLicense}
                  onChange={(event) =>
                    updateContactField("driversLicense", event.target.value)
                  }
                  error={contactErrors.driversLicense}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Tow vehicle"
                    list="tow-vehicle-options"
                    placeholder="2022 Ford F-150 XLT"
                    value={formState.contact.vehicle}
                    onChange={(event) =>
                      updateContactField("vehicle", event.target.value)
                    }
                    error={contactErrors.vehicle}
                  />
                  <datalist id="tow-vehicle-options">
                    {vehicles.slice(0, 20).map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={`${vehicle.year} ${vehicle.make} ${vehicle.model}${
                          vehicle.trim ? ` ${vehicle.trim}` : ""
                        }`}
                      />
                    ))}
                  </datalist>
                </div>
              </div>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="rounded-[2rem]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    Review and confirm
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Double-check the order before we reserve your pickup slot.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 rounded-3xl bg-gray-50 p-6 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <span>Trailer</span>
                  <span className="text-right font-semibold text-navy-900">
                    {trailer.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <span>Rental window</span>
                  <span className="text-right font-semibold text-navy-900">
                    {formatDate(formState.startDate)} to{" "}
                    {formatDate(formState.endDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <span>Insurance</span>
                  <span className="text-right font-semibold capitalize text-navy-900">
                    {formState.insuranceTier}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <span>Add-ons</span>
                  <span className="text-right font-semibold text-navy-900">
                    {selectedAccessories.length > 0
                      ? selectedAccessories.map((item) => item.name).join(", ")
                      : "None selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Primary driver</span>
                  <span className="text-right font-semibold text-navy-900">
                    {formState.contact.name}
                  </span>
                </div>
              </div>

              <label className="mt-6 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setAcceptedTerms(event.target.checked);
                    if (event.target.checked) {
                      setTermsError("");
                    }
                  }}
                  className="mt-1 h-4 w-4 accent-orange-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the rental terms, understand that late returns are
                  billed daily, and confirm my vehicle is rated for the selected
                  trailer.
                </span>
              </label>

              {termsError ? (
                <p className="mt-3 text-sm font-medium text-red-500">
                  {termsError}
                </p>
              ) : null}
            </Card>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={goToNextStep} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleConfirmBooking} className="gap-2">
                Confirm booking
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <Card className="sticky top-24 rounded-[2rem] bg-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              Selected trailer
            </p>
            <h2 className="mt-3 text-2xl font-bold text-navy-900">
              {trailer.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{trailer.tagline}</p>

            <div className="mt-6 grid gap-3 rounded-3xl bg-gray-50 p-4 text-sm text-gray-600 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-navy-900">Size</p>
                <p>
                  {trailer.dimensions.lengthFt}&apos; x{" "}
                  {trailer.dimensions.widthFt}&apos;
                </p>
              </div>
              <div>
                <p className="font-semibold text-navy-900">Payload</p>
                <p>{trailer.payloadCapacityLbs.toLocaleString()} lbs</p>
              </div>
              <div>
                <p className="font-semibold text-navy-900">Hitch</p>
                <p>{trailer.hitchSize}</p>
              </div>
              <div>
                <p className="font-semibold text-navy-900">Daily rate</p>
                <p>{formatCurrency(trailer.dailyRate)}</p>
              </div>
            </div>

            {requestedTrailerId && trailer.id === requestedTrailerId ? null : (
              <p className="mt-4 rounded-2xl bg-orange-100 px-4 py-3 text-sm text-orange-600">
                No matching trailer was found in the URL. Showing the next
                available favorite instead.
              </p>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Rental ({rentalDays} {rentalDays === 1 ? "day" : "days"})
                </span>
                <span>{formatCurrency(pricing.rental)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Insurance</span>
                <span>{formatCurrency(pricing.insurance)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Add-ons</span>
                <span>{formatCurrency(pricing.accessoriesTotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(pricing.subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(pricing.tax)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy-900 px-4 py-4 text-white">
                <span className="text-sm font-medium text-gray-300">Total</span>
                <span className="text-xl font-bold">
                  {formatCurrency(pricing.total)}
                </span>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Pickup snapshot
              </p>
              <p className="mt-3 text-sm font-semibold text-navy-900">
                {pickupDetails.address}
              </p>
              <p className="mt-2 text-sm text-gray-600">{pickupDetails.hours}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
