import type { Vehicle, TowMatchResult } from "./types";
import { vehicles } from "@/data/vehicles";

export function findVehicle(
  year: number,
  make: string,
  model: string
): Vehicle | undefined {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  return vehicles.find(
    (v) =>
      v.year === year &&
      v.make.toLowerCase() === makeLower &&
      v.model.toLowerCase() === modelLower
  );
}

export function getTowMatch(
  vehicleCapacityLbs: number,
  trailerGrossWeightLbs: number
): TowMatchResult {
  if (vehicleCapacityLbs >= trailerGrossWeightLbs * 1.2) {
    return "green";
  }
  if (vehicleCapacityLbs >= trailerGrossWeightLbs) {
    return "yellow";
  }
  return "red";
}

export function getTowMatchLabel(result: TowMatchResult): string {
  switch (result) {
    case "green":
      return "Safe to tow";
    case "yellow":
      return "At capacity — check your vehicle manual";
    case "red":
      return "Not recommended";
    case "unknown":
      return "Vehicle not found — check your owner's manual for tow rating";
  }
}
