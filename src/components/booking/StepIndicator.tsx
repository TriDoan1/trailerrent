"use client";

interface StepIndicatorProps {
  currentStep: number;
  labels: string[];
}

export function StepIndicator({
  currentStep,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:flex md:items-start md:gap-3 md:overflow-x-auto">
        {labels.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isComplete = currentStep > step;

          return (
            <div
              key={label}
              className="flex min-w-0 items-center gap-3 md:flex-1"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                    isComplete
                      ? "border-orange-500 bg-orange-500 text-white"
                      : isActive
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-gray-300 bg-gray-50 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Step {step}
                  </p>
                  <p
                    className={`text-sm font-semibold md:truncate ${
                      isActive || isComplete ? "text-navy-900" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </div>

              {index < labels.length - 1 ? (
                <div
                  className={`hidden h-px flex-1 md:block ${
                    isComplete ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
