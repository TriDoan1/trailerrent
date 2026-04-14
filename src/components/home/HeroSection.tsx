import Link from "next/link";
import {
  Home,
  Car,
  TreePine,
  Hammer,
  Tent,
} from "lucide-react";

const useCases = [
  { id: "moving", label: "Moving", icon: Home },
  { id: "vehicle-transport", label: "Vehicle Transport", icon: Car },
  { id: "landscaping", label: "Landscaping", icon: TreePine },
  { id: "construction", label: "Construction", icon: Hammer },
  { id: "camping", label: "Camping", icon: Tent },
];

export function HeroSection() {
  return (
    <section className="relative bg-navy-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-700 to-navy-900 opacity-90" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            What Are You{" "}
            <span className="text-orange-500">Hauling?</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your project, find the perfect trailer, and pick it up today.
            No CDL required — just hook up and go.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <Link
                key={uc.id}
                href={`/browse?useCase=${uc.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 sm:p-6 hover:bg-orange-500 hover:border-orange-500 transition-all"
              >
                <Icon className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-white text-center">
                  {uc.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
