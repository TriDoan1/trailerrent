import type { Trailer, Accessory } from "./types";

const TAX_RATE = 0.08;

const INSURANCE_RATES: Record<string, number> = {
  none: 0,
  basic: 15,
  premium: 25,
};

export function calculateRental(
  trailer: Trailer,
  numDays: number
): number {
  if (numDays >= 7) {
    const weeks = Math.floor(numDays / 7);
    const remainingDays = numDays % 7;
    return weeks * trailer.weeklyRate + remainingDays * trailer.dailyRate;
  }
  return numDays * trailer.dailyRate;
}

export function calculateInsurance(
  tier: "none" | "basic" | "premium",
  numDays: number
): number {
  return INSURANCE_RATES[tier] * numDays;
}

export function calculateAccessories(
  accessories: Accessory[],
  numDays: number
): number {
  return accessories.reduce((sum, acc) => sum + acc.dailyRate * numDays, 0);
}

export function calculateTotal(
  trailer: Trailer,
  numDays: number,
  insuranceTier: "none" | "basic" | "premium",
  accessories: Accessory[]
): {
  rental: number;
  insurance: number;
  accessoriesTotal: number;
  subtotal: number;
  tax: number;
  total: number;
} {
  const rental = calculateRental(trailer, numDays);
  const insurance = calculateInsurance(insuranceTier, numDays);
  const accessoriesTotal = calculateAccessories(accessories, numDays);
  const subtotal = rental + insurance + accessoriesTotal;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { rental, insurance, accessoriesTotal, subtotal, tax, total };
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}
