import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { FilterKey, SortKey, ViewMode } from "../../types/shipment";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "at-risk", label: "At Risk" },
  { key: "critical", label: "Critical" },
  { key: "delayed", label: "Delayed" },
  { key: "delivered", label: "Delivered" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recently updated" },
  { key: "health-asc", label: "Health: low to high" },
  { key: "risk-desc", label: "AI risk: high to low" },
  { key: "eta", label: "ETA: soonest" },
];

interface ShipmentsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function ShipmentsToolbar({
  query,
  onQueryChange,
  activeFilter,
  onFilterChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  onRefresh,
  isRefreshing,
}: ShipmentsToolbarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
              isFocused ? "text-[#1E8F55]" : "text-[#98A093]"
            }`}
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search shipment ID, cargo or route..."
            className="w-full rounded-xl border border-[#E7E3D4] bg-white py-2.5 pl-10 pr-4 text-sm text-[#14231B] placeholder:text-[#98A093] outline-none transition-all duration-200 focus:border-[#1E8F55] focus:ring-4 focus:ring-[#1E8F55]/10"
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-[#1E8F55]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-[#E7E3D4] bg-white px-3 py-1.5 text-xs font-medium text-[#6B7568] sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E8F55] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1E8F55]" />
            </span>
            Live data
          </span>

          <div className="relative flex items-center">
            <SlidersHorizontal className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#98A093]" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className="cursor-pointer appearance-none rounded-xl border border-[#E7E3D4] bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-[#14231B] outline-none transition-colors hover:border-[#C9D2CB] focus:border-[#1E8F55]"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center rounded-xl border border-[#E7E3D4] bg-white p-1">
            {(["grid", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewChange(mode)}
                aria-label={`${mode} view`}
                className="relative rounded-lg px-2.5 py-1.5 text-[#6B7568] transition-colors"
              >
                {view === mode && (
                  <motion.span
                    layoutId="view-toggle"
                    className="absolute inset-0 rounded-lg bg-[#F3FAF5]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative flex">
                  {mode === "grid" ? (
                    <LayoutGrid className="h-3.5 w-3.5" />
                  ) : (
                    <List className="h-3.5 w-3.5" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            aria-label="Refresh"
            className="flex items-center justify-center rounded-xl border border-[#E7E3D4] bg-white p-2.5 text-[#6B7568] transition-colors hover:border-[#C9D2CB] hover:text-[#14231B]"
          >
            <motion.span
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive ? "text-white" : "text-[#6B7568] hover:text-[#14231B]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-[#123423]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span className="relative">{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
