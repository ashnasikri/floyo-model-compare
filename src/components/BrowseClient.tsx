"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Model } from "@/types/model";
import ModelCard from "./ModelCard";
import CompareBar from "./CompareBar";
import { filterModels, sortModels } from "@/lib/models";

const FILTERS = [
  { id: "all", label: "All Models" },
  { id: "open", label: "Open Source" },
  { id: "closed", label: "Closed Source" },
  { id: "audio", label: "Audio-Native" },
  { id: "1080p", label: "1080p+" },
] as const;

const SORTS = [
  { id: "tier", label: "Tier" },
  { id: "released", label: "Latest" },
  { id: "price", label: "Price" },
  { id: "quality", label: "Quality" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];
type SortId = (typeof SORTS)[number]["id"];

interface Props {
  models: Model[];
  initialFilter: string;
  initialSort: string;
}

export default function BrowseClient({ models, initialFilter, initialSort }: Props) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterId>(
    (FILTERS.find((f) => f.id === initialFilter)?.id ?? "all") as FilterId
  );
  const [activeSort, setActiveSort] = useState<SortId>(
    (SORTS.find((s) => s.id === initialSort)?.id ?? "tier") as SortId
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  function updateFilter(f: FilterId) {
    setActiveFilter(f);
    const params = new URLSearchParams();
    if (f !== "all") params.set("filter", f);
    if (activeSort !== "tier") params.set("sort", activeSort);
    router.replace(params.toString() ? `/?${params}` : "/", { scroll: false });
  }

  function updateSort(s: SortId) {
    setActiveSort(s);
    const params = new URLSearchParams();
    if (activeFilter !== "all") params.set("filter", activeFilter);
    if (s !== "tier") params.set("sort", s);
    router.replace(params.toString() ? `/?${params}` : "/", { scroll: false });
  }

  const displayed = useMemo(() => {
    const filtered = filterModels(models, activeFilter);
    return sortModels(filtered, activeSort);
  }, [models, activeFilter, activeSort]);

  const selectedModels = useMemo(
    () => models.filter((m) => compareIds.includes(m.id)),
    [models, compareIds]
  );

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const browseState = `${activeFilter !== "all" ? `filter=${activeFilter}&` : ""}${activeSort !== "tier" ? `sort=${activeSort}` : ""}`.replace(/&$/, "");

  return (
    <>
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-violet tracking-widest uppercase">
              floyo.ai
            </span>
            <h1 className="font-sans font-bold text-xl text-text-main leading-tight">
              AI Video Model Compare
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[10px] text-muted">Spec guides:</span>
              <Link
                href="/specs/fps"
                className="font-mono text-[10px] text-muted hover:text-violet transition-colors"
              >
                FPS
              </Link>
              <span className="text-border text-[10px]">·</span>
              <span className="font-mono text-[10px] text-muted/40">Resolution</span>
              <span className="text-border text-[10px]">·</span>
              <span className="font-mono text-[10px] text-muted/40">Duration</span>
            </div>
          </div>
          <a
            href="https://floyo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors"
          >
            Run on Floyo
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters + Sort row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => updateFilter(f.id)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === f.id
                    ? "bg-violet text-[#0d0b11] border-violet font-bold"
                    : "border-border text-text-sub hover:border-violet/50 hover:text-text-main"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs text-muted">Sort:</span>
            <div className="flex items-center gap-1">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateSort(s.id)}
                  className={`font-mono text-xs px-2.5 py-1.5 rounded border transition-colors ${
                    activeSort === s.id
                      ? "bg-surface-2 border-violet/50 text-text-main"
                      : "border-border text-muted hover:text-text-sub"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="font-mono text-xs text-muted mb-4">
          {displayed.length} model{displayed.length !== 1 ? "s" : ""}
          {activeFilter !== "all" && (
            <span>
              {" "}&middot;{" "}
              <button
                onClick={() => updateFilter("all")}
                className="text-violet hover:underline"
              >
                Clear filter
              </button>
            </span>
          )}
        </p>

        {/* Model grid */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {displayed.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              selected={compareIds.includes(model.id)}
              onToggleCompare={toggleCompare}
              compareDisabled={compareIds.length >= 3 && !compareIds.includes(model.id)}
            />
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-20 text-muted font-mono text-sm">
            No models match this filter.
          </div>
        )}
      </main>

      <CompareBar
        selected={selectedModels}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
        browseState={browseState}
      />

      {compareIds.length >= 2 && <div className="h-20" />}
    </>
  );
}
