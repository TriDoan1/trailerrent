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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Simple process
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Renting a trailer shouldn&apos;t be complicated. Three simple steps
            and you&apos;re on the road.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-3xl border border-gray-100 bg-gray-50 px-6 py-8 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <Icon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+88px)] top-16 hidden h-px w-[calc(100%-176px)] bg-gray-300 md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
