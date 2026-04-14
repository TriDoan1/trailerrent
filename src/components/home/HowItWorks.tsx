import { Search, CalendarCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Choose",
    description:
      "Browse our fleet and find the right trailer for your project. Check tow compatibility with your vehicle.",
  },
  {
    icon: CalendarCheck,
    title: "2. Book",
    description:
      "Pick your dates, add insurance and accessories, and reserve online. No deposit required.",
  },
  {
    icon: Truck,
    title: "3. Haul",
    description:
      "Pick up same day from our lot. We'll do a walkthrough, hook you up, and you're on your way.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Renting a trailer shouldn&apos;t be complicated. Three simple steps
            and you&apos;re on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
