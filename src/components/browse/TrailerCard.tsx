import Image from "next/image";
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
        <Image
          src={trailer.photos[0]}
          alt={trailer.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-900/70 via-navy-900/15 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="orange">{typeLabels[trailer.type] || trailer.type}</Badge>
        </div>
        {trailer.popular && (
          <div className="absolute top-3 right-3">
            <Badge variant="success">Popular</Badge>
          </div>
        )}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">
              Ready to reserve
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-white/90">
              {trailer.tagline}
            </p>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-orange-100/80" />
        </div>
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
