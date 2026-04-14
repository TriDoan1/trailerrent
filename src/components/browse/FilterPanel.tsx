"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Trailer } from "@/lib/types";

const trailerTypes: { value: Trailer["type"]; label: string }[] = [
  { value: "enclosed", label: "Enclosed" },
  { value: "utility", label: "Utility" },
  { value: "flatbed", label: "Flatbed" },
  { value: "dump", label: "Dump" },
  { value: "car-hauler", label: "Car Hauler" },
  { value: "travel", label: "Travel" },
];

const useCaseOptions = [
  { value: "moving", label: "Moving" },
  { value: "landscaping", label: "Landscaping" },
  { value: "construction", label: "Construction" },
  { value: "vehicle-transport", label: "Vehicle Transport" },
  { value: "camping", label: "Camping" },
];

export interface Filters {
  useCase: string[];
  type: Trailer["type"][];
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy-900 mb-3">{label}</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  mobileOpen,
  onMobileToggle,
}: FilterPanelProps) {
  const activeCount = filters.useCase.length + filters.type.length;

  function toggleUseCase(value: string) {
    const next = filters.useCase.includes(value)
      ? filters.useCase.filter((v) => v !== value)
      : [...filters.useCase, value];
    onChange({ ...filters, useCase: next });
  }

  function toggleType(value: string) {
    const next = filters.type.includes(value as Trailer["type"])
      ? filters.type.filter((v) => v !== value)
      : [...filters.type, value as Trailer["type"]];
    onChange({ ...filters, type: next });
  }

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy-900">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.useCase.map((uc) => (
            <Badge key={uc} variant="orange">
              {useCaseOptions.find((o) => o.value === uc)?.label}
              <button
                onClick={() => toggleUseCase(uc)}
                className="ml-1 cursor-pointer"
                aria-label={`Remove ${uc} filter`}
              >
                <X className="w-3 h-3 inline" />
              </button>
            </Badge>
          ))}
          {filters.type.map((t) => (
            <Badge key={t} variant="orange">
              {trailerTypes.find((o) => o.value === t)?.label}
              <button
                onClick={() => toggleType(t)}
                className="ml-1 cursor-pointer"
                aria-label={`Remove ${t} filter`}
              >
                <X className="w-3 h-3 inline" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <CheckboxGroup
        label="Use Case"
        options={useCaseOptions}
        selected={filters.useCase}
        onToggle={toggleUseCase}
      />

      <CheckboxGroup
        label="Trailer Type"
        options={trailerTypes}
        selected={filters.type}
        onToggle={toggleType}
      />
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onMobileToggle}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-lg border border-gray-100 p-5">
          {filterContent}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileToggle} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-900">Filters</h2>
              <button
                onClick={onMobileToggle}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-6">
              <Button className="w-full" onClick={onMobileToggle}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
