// src/components/dashboard/map/FilterPanel.tsx
import { Input } from "@/components/ui/input";
import { Search, CalendarRange } from "lucide-react";
import ReportFilter from "@/components/ReportFilter";
import { capitalizeLabel } from "./utils";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  dateFrom: string | null;
  dateTo: string | null;
  onDateFrom: (d: string | null) => void;
  onDateTo: (d: string | null) => void;
  subtypeFilter: string[];
  onSubtypeChange: (subs: string[]) => void;
  onTypeChange: (types: string[] | null) => void;
  onStatusChange: (statuses: string[] | null) => void;
  subscriptions: string[];
  total: number;
  mapped: number;
  unmapped: number;
};

const SUBTYPES = {
  damage: ["road", "bridge", "health_facility", "water_sanitation"],
  assistance: ["food_water", "medical_help", "shelter", "evacuation"],
  srhr: ["maternal_health", "contraceptive", "hiv", "gbv_support", "other"],
};

export function FilterPanel({
  query,
  onQueryChange,
  dateFrom,
  dateTo,
  onDateFrom,
  onDateTo,
  subtypeFilter,
  onSubtypeChange,
  onTypeChange,
  onStatusChange,
  subscriptions,
  total,
  mapped,
  unmapped,
}: Props) {
  return (
    <div className="space-y-6 overflow-y-auto h-[calc(100vh-12rem-4rem)] p-4">
      <ReportFilter onTypeChange={onTypeChange} onStatusChange={onStatusChange} />

      {subscriptions.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Subscribed to: {subscriptions.join(", ")}
        </p>
      )}

      <div>
        <label className="text-xs font-medium text-muted-foreground">Search</label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Description, location, ID..."
            className="pl-9 text-sm"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          Date Range
        </p>
        <div className="flex gap-2">
          <Input type="date" value={dateFrom ?? ""} onChange={(e) => onDateFrom(e.target.value || null)} />
          <span className="self-center">—</span>
          <Input type="date" value={dateTo ?? ""} onChange={(e) => onDateTo(e.target.value || null)} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Subtypes</p>
        {Object.entries(SUBTYPES).map(([group, options]) => (
          <div key={group} className="mb-4">
            <p className="font-medium capitalize mb-2">{group}</p>
            <div className="space-y-1">
              {options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={subtypeFilter.includes(opt)}
                    onChange={(e) =>
                      onSubtypeChange(
                        e.target.checked
                          ? [...subtypeFilter, opt]
                          : subtypeFilter.filter((x) => x !== opt)
                      )
                    }
                  />
                  {capitalizeLabel(opt)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4 text-sm">
        <p className="text-xs text-muted-foreground">Visible reports</p>
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-xs text-muted-foreground">
          Mapped: {mapped} | Unmapped: {unmapped}
        </p>
      </div>
    </div>
  );
}