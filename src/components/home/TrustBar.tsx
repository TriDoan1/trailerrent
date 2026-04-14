import { Calendar, Users, Star, Shield } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: "15+ Years",
    label: "Serving trailer renters across the Portland metro",
  },
  {
    icon: Users,
    value: "10,000+ Rentals",
    label: "Moves, dump runs, and job-site hauls completed",
  },
  {
    icon: Star,
    value: "4.9★ Rating",
    label: "Verified reviews from repeat customers",
  },
  {
    icon: Shield,
    value: "Insurance Included",
    label: "Checkout coverage and pickup walkthrough included",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-6 text-center"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold text-navy-900 sm:text-2xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-gray-600">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
