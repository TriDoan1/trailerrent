export interface Trailer {
  id: string;
  name: string;
  type: "enclosed" | "utility" | "flatbed" | "dump" | "car-hauler" | "travel";
  tagline: string;
  description: string;
  photos: string[];
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
  };
  payloadCapacityLbs: number;
  grossWeightLbs: number;
  emptyWeightLbs: number;
  hitchType: "bumper-pull" | "gooseneck" | "fifth-wheel";
  hitchSize: string;
  features: string[];
  dailyRate: number;
  weeklyRate: number;
  availableDates: string[];
  rating: number;
  reviewCount: number;
  popular: boolean;
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  maxTowCapacityLbs: number;
  gvwr?: number;
}

export interface Review {
visitorName: string;
  trailerId: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Booking {
  id: string;
  trailerId: string;
  startDate: string;
  endDate: string;
  insuranceTier: "none" | "basic" | "premium";
  accessories: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
    driversLicense: string;
    vehicle: string;
  };
  subtotal: number;
  tax: number;
  total: number;
}

export interface UseCase {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedTypes: Trailer["type"][];
  minPayloadLbs?: number;
}

export interface Accessory {
  id: string;
  name: string;
  dailyRate: number;
  description: string;
}

export type TowMatchResult = "green" | "yellow" | "red" | "unknown";
