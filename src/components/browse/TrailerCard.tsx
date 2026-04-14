import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Trailer } from "@/lib/types";

interface TrailerCardProps {
  trailer: Trailer;
}

const typeLabels: Record<string, string> = {
  enclosed: "Enclosed",
  utility: "Utility",
  flatbed: "Flatbed",
  dump: "Dump",
  "car-hauler": "Car Hauler",
  travel: "Travel",
};

export function TrailerCard({ trailer }: TrailerCardProps) {
  return (
    <Link
      href={`/trailers/${trailer.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <MapPin className="w-10 h-10 opacity-30" />
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="orange">{typeLabels[trailer.type] || trailer.type}</Badge>
        </div>
        {trailer.popular && (
          <div className="absolute top-3 right-3">
            <Badge variant="success">Popular</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-navy-900 group-hover:text-orange-500 transition-colors mb-1">
          {trailer.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {trailer.tagline}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span>
            {trailer.dimensions.lengthFt}&apos; x {trailer.dimensions.widthFt}&apos;
          </span>
          <span>&middot;</span>
          <span>{trailer.payloadCapacityLbs.toLocaleString()} lb payload</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-navy-900">
              ${trailer.dailyRate}
            </span>
            <span className="text-sm text-gray-400">/day</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-gray-900">{trailer.rating}</span>
            <span className="text-gray-400">({trailer.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
