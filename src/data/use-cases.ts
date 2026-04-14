import type { UseCase } from "@/lib/types";

export const useCases: UseCase[] = [
  {
    id: "moving",
    name: "Moving",
    icon: "Home",
    description:
      "Apartment or house moves — protect your furniture and belongings from weather and road debris.",
    recommendedTypes: ["enclosed", "utility"],
    minPayloadLbs: 2000,
  },
  {
    id: "landscaping",
    name: "Landscaping",
    icon: "TreePine",
    description:
      "Haul mulch, soil, gravel, branches, and yard waste. Dump trailers make unloading a breeze.",
    recommendedTypes: ["dump", "utility"],
  },
  {
    id: "construction",
    name: "Construction",
    icon: "Hammer",
    description:
      "Move equipment, building materials, and debris to and from the job site.",
    recommendedTypes: ["flatbed", "dump", "utility"],
    minPayloadLbs: 3000,
  },
  {
    id: "vehicle-transport",
    name: "Vehicle Transport",
    icon: "Car",
    description:
      "Transport cars, trucks, ATVs, and motorcycles safely for track days, purchases, or relocation.",
    recommendedTypes: ["car-hauler", "flatbed", "enclosed"],
  },
  {
    id: "camping",
    name: "Camping & Road Trips",
    icon: "Tent",
    description:
      "Hit the road with a compact travel trailer — sleeping, cooking, and adventure included.",
    recommendedTypes: ["travel"],
  },
];
