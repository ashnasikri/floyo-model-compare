"use client";

import { useState } from "react";
import Link from "next/link";
import type { Model } from "@/types/model";
import SourceBadge from "@/components/SourceBadge";

// ── Types ────────────────────────────────────────────────────────────────────
// Extend this interface when building other spec pages (resolution, duration, etc.)
export interface RankedModel extends Model {
  displayValue: string;  // shown in the spec column, e.g. "Up to 50"
  numericValue: number;  // used for sorting
  specTier: {
    label: string;   // e.g. "48–60 fps"
    color: string;   // hex
    bgColor: string; // hex with low opacity
  };
}

interface Props {
  models: RankedModel[];
  specLabel: string; // column header, e.g. "FPS"
}

type SortKey = "spec" | "name" | "resolution";
type SortDir = "asc" | "desc";

function parseResolution(s: string): number {
  const l = s.toLowerCase();
  if (l.includes("4k") || l.includes("2160")) return 4;
  if (l.includes("2k") || l.includes("1440")) return 2.5;
  if (l.includes("1080")) return 2;
  if (l.includes("720")) return 1.5;
  if (l.includes("480")) return 1;
  return 0;
}

export default function SpecRankingTable({ models, specLabel }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("spec");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = [...models].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "spec") cmp = a.numericValue - b.numericValue;
    else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "resolution") cmp = parseResolution(a.maxResolution) - parseResolution(b.maxResolution);
    return sortDir === "desc" ? -cmp : cmp;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="opacity-30">↕</span>;
    return <span style={{ color: "#AF7FF4" }}>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
          <thead>
            <tr className="border-b border-border bg-surface">
              {(
                [
                  { key: "name" as SortKey, label: "Model" },
                  { key: "spec" as SortKey, label: specLabel },
                  { key: "resolution" as SortKey, label: "Resolution" },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort(key)}
                    className="font-mono text-[10px] text-muted uppercase tracking-widest hover:text-text-sub flex items-center gap-1 transition-colors"
                  >
                    {label} <SortIcon col={key} />
                  </button>
                </th>
              ))}
              {["Source", "Cost/sec", "On Floyo"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((model) => (
              <tr
                key={model.id}
                className="border-b border-border last:border-b-0 hover:bg-surface/60 transition-colors"
              >
                {/* Model name */}
                <td className="px-4 py-3">
                  <Link
                    href={`/models/${model.id}`}
                    className="font-sans text-sm text-text-main hover:text-violet transition-colors"
                  >
                    {model.name}
                  </Link>
                  <p className="font-mono text-[10px] text-muted mt-0.5">{model.maker}</p>
                </td>

                {/* Spec value pill */}
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ color: model.specTier.color, backgroundColor: model.specTier.bgColor }}
                  >
                    {model.displayValue}
                  </span>
                  <p
                    className="font-mono text-[9px] mt-0.5"
                    style={{ color: model.specTier.color, opacity: 0.7 }}
                  >
                    {model.specTier.label}
                  </p>
                </td>

                {/* Resolution */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-text-sub">{model.maxResolution}</span>
                </td>

                {/* Source badge */}
                <td className="px-4 py-3">
                  <SourceBadge sourceType={model.sourceType} />
                </td>

                {/* Cost */}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-text-sub">{model.costPerSecond}</span>
                </td>

                {/* On Floyo */}
                <td className="px-4 py-3">
                  {model.onFloyo ? (
                    <span className="font-mono text-[10px] font-bold text-open-green">Yes</span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
