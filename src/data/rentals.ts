export interface RentalRecord {
  id: string;
  trailerId: string;
  status: "active" | "upcoming" | "completed";
  startDate: string;
  endDate: string;
  pickupAddress: string;
  pickupHours: string;
  gateCode: string;
  returnChecklist: string[];
}

const sharedPickup = {
  pickupAddress: "8240 SE Powell Blvd, Portland, OR 97206",
  pickupHours: "Mon-Fri 7am-6pm, Sat 8am-4pm, Sun 9am-2pm",
  gateCode: "2719#",
};

export const activeRentals: RentalRecord[] = [
  {
    id: "rent-1001",
    trailerId: "enclosed-6x12",
    status: "active",
    startDate: "2026-04-13",
    endDate: "2026-04-16",
    ...sharedPickup,
    returnChecklist: [
      "Sweep out the trailer interior before return.",
      "Refold the loading ramp and secure all latches.",
      "Take 4 return photos from each corner of the trailer.",
    ],
  },
  {
    id: "rent-1002",
    trailerId: "dump-6x10",
    status: "upcoming",
    startDate: "2026-04-18",
    endDate: "2026-04-20",
    ...sharedPickup,
    returnChecklist: [
      "Empty all debris and rinse the bed if hauling gravel or soil.",
      "Recharge the remote control and return it to the lockbox.",
      "Confirm the tarp, chains, and spare are back in place.",
    ],
  },
];

export const rentalHistory: RentalRecord[] = [
  {
    id: "rent-0978",
    trailerId: "utility-5x10",
    status: "completed",
    startDate: "2026-03-28",
    endDate: "2026-03-30",
    ...sharedPickup,
    returnChecklist: [
      "Return trailer with gate pinned upright.",
      "Remove personal straps and accessories.",
      "Park in the striped return lane.",
    ],
  },
  {
    id: "rent-0944",
    trailerId: "travel-compact",
    status: "completed",
    startDate: "2026-02-14",
    endDate: "2026-02-17",
    ...sharedPickup,
    returnChecklist: [
      "Empty gray water and freshwater tanks.",
      "Close awning and latch all interior cabinets.",
      "Return wheel chocks and leveling blocks to storage bin.",
    ],
  },
  {
    id: "rent-0917",
    trailerId: "flatbed-7x18",
    status: "completed",
    startDate: "2026-01-22",
    endDate: "2026-01-24",
    ...sharedPickup,
    returnChecklist: [
      "Bundle ramps and lock them into transport position.",
      "Check D-rings for any leftover hardware.",
      "Send return note if you used the wireless brake controller.",
    ],
  },
];
