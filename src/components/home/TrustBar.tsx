import { Calendar, Users, Star, Shield } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years in Business",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Rentals Completed",
  },
  {
    icon: Star,
    value: "4.9\u2605",
    label: "Average Rating",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Insurance Available",
  },
];

export function TrustBar() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <Icon className="w-8 h-8 text-orange-500 mb-2" />
                <span className="text-2xl sm:text-3xl font-bold text-navy-900">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-600 mt-1">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
