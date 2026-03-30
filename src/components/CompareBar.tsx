"use client";

import Link from "next/link";
import type { Model } from "@/types/model";

interface CompareBarProps {
  selected: Model[];
  onRemove: (id: string) => void;
  onClear: () => void;
  browseState?: string; // filter/sort params to pass through to compare page
}

export default function CompareBar({
  selected,
  onRemove,
  onClear,
  browseState,
}: CompareBarProps) {
  if (selected.length < 2) return null;

  const idsParam = `ids=${selected.map((m) => m.id).join(",")}`;
  const compareUrl = `/compare?${idsParam}${browseState ? `&${browseState}` : ""}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-violet/30 bg-[#0d0b11]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="font-mono text-xs text-text-sub hidden sm:block shrink-0">
          Compare:
        </span>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {selected.map((model) => (
            <div
              key={model.id}
              className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5 shrink-0"
            >
              <span className="font-sans text-xs text-text-main whitespace-nowrap">
                {model.name}
              </span>
              <button
                onClick={() => onRemove(model.id)}
                className="text-muted hover:text-text-main transition-colors ml-0.5"
                aria-label={`Remove ${model.name} from compare`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="font-mono text-xs text-muted hover:text-text-sub transition-colors"
          >
            Clear
          </button>
          <Link
            href={compareUrl}
            className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors"
          >
            Compare {selected.length} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
