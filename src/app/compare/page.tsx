import { models } from "@/lib/models";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";
import SourceBadge from "@/components/SourceBadge";
import type { Model } from "@/types/model";

// Per-model accent colors
const MODEL_COLORS = ["#AF7FF4", "#60c4a0", "#ffc15e"] as const;

// ── Spec winner helpers ────────────────────────────────────────────────────
function parseResolution(s: string): number {
  const l = s.toLowerCase();
  if (l.includes("4k") || l.includes("2160")) return 4;
  if (l.includes("2k") || l.includes("1440")) return 2.5;
  if (l.includes("1080")) return 2;
  if (l.includes("720")) return 1.5;
  if (l.includes("480")) return 1;
  return 0;
}
function parseDuration(s: string): number {
  const nums = s.match(/\d+\.?\d*/g)?.map(Number) ?? [];
  if (!nums.length) return 0;
  const max = Math.max(...nums);
  return s.toLowerCase().includes("min") ? max * 60 : max;
}
function parseFPS(s: string): number {
  const nums = s.match(/\d+/g)?.map(Number) ?? [];
  return nums.length ? Math.max(...nums) : 0;
}
function higherWins(getValue: (m: Model) => number) {
  return (ms: Model[]): string | null => {
    const vals = ms.map((m) => ({ id: m.id, val: getValue(m) }));
    const max = Math.max(...vals.map((v) => v.val));
    if (max === 0) return null;
    const winners = vals.filter((v) => v.val === max);
    return winners.length === 1 ? winners[0].id : null;
  };
}
function boolWins(getValue: (m: Model) => boolean) {
  return (ms: Model[]): string | null => {
    const yeses = ms.filter((m) => getValue(m));
    return yeses.length === 1 ? yeses[0].id : null;
  };
}
// ──────────────────────────────────────────────────────────────────────────

const SPEC_ROWS: { label: string; render: (m: Model) => React.ReactNode; highlight?: (m: Model) => boolean; getWinner?: (models: Model[]) => string | null }[] = [
  { label: "Maker", render: (m) => m.maker },
  { label: "Source Type", render: (m) => m.sourceType, highlight: (m) => m.sourceType === "Open Source" },
  { label: "License", render: (m) => m.license },
  { label: "Architecture", render: (m) => m.architecture },
  { label: "Parameters", render: (m) => m.parameters },
  { label: "Max Resolution", render: (m) => m.maxResolution, getWinner: higherWins((m) => parseResolution(m.maxResolution)) },
  { label: "Max Duration", render: (m) => m.maxDuration, getWinner: higherWins((m) => parseDuration(m.maxDuration)) },
  { label: "FPS", render: (m) => m.fps, getWinner: higherWins((m) => parseFPS(m.fps)) },
  { label: "Native Audio", render: (m) => (m.nativeAudio ? "Yes" : "No"), highlight: (m) => m.nativeAudio, getWinner: boolWins((m) => m.nativeAudio) },
  { label: "ComfyUI Support", render: (m) => (m.comfyUISupport ? "Yes" : "No"), highlight: (m) => m.comfyUISupport, getWinner: boolWins((m) => m.comfyUISupport) },
  { label: "Fine-tunable", render: (m) => (m.finetuneable ? "Yes" : "No"), highlight: (m) => m.finetuneable, getWinner: boolWins((m) => m.finetuneable) },
  { label: "Min VRAM", render: (m) => m.minVRAM },
  { label: "Cost / Second", render: (m) => m.costPerSecond },
  { label: "Inputs", render: (m) => m.inputsSupported },
  { label: "On Floyo", render: (m) => (m.onFloyo ? "Yes" : "No"), highlight: (m) => m.onFloyo },
];

export default function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string; filter?: string; sort?: string };
}) {
  const ids = searchParams.ids?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const selected = ids
    .map((id) => models.find((m) => m.id === id))
    .filter(Boolean) as Model[];

  // Build back-to-browse URL
  const backParams = new URLSearchParams();
  if (searchParams.filter && searchParams.filter !== "all") backParams.set("filter", searchParams.filter);
  if (searchParams.sort && searchParams.sort !== "tier") backParams.set("sort", searchParams.sort);
  const backHref = backParams.toString() ? `/?${backParams}` : "/";

  if (selected.length < 2) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-text-sub">Select at least 2 models to compare.</p>
        <Link href="/" className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors">
          Browse models
        </Link>
      </div>
    );
  }

  // Collect all live Floyo workflows across selected models
  const allWorkflows = selected.flatMap((m, i) =>
    m.workflows
      .filter((w) => w.status.toLowerCase().includes("live") && w.url.includes("floyo.ai"))
      .map((w) => ({ ...w, modelName: m.name, color: MODEL_COLORS[i] }))
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href={backHref}
            className="font-mono text-xs text-muted hover:text-text-sub transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 2.5L4 7L8.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Browse
          </Link>
          <span className="text-border">/</span>
          <span className="font-mono text-xs text-text-sub">Compare</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Model header cards */}
        <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
          {selected.map((model, i) => (
            <div
              key={model.id}
              className="rounded-xl border p-5"
              style={{ borderColor: MODEL_COLORS[i], backgroundColor: `${MODEL_COLORS[i]}0d` }}
            >
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <TierBadge tier={model.tier} />
                <SourceBadge sourceType={model.sourceType} />
              </div>
              <Link href={`/models/${model.id}`}>
                <h2
                  className="font-sans font-bold text-xl leading-tight mb-0.5 hover:underline"
                  style={{ color: MODEL_COLORS[i] }}
                >
                  {model.name}
                </h2>
              </Link>
              <p className="font-mono text-[11px] text-text-sub mb-3">{model.maker}</p>
              {model.verdict && (
                <p className="font-sans text-xs text-text-sub leading-relaxed">{model.verdict}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick verdict cards */}
        <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
          {selected.map((model, i) => {
            const items = model.bestFor
              .filter((s) => !/self.?host|local\b/i.test(s))
              .slice(0, 3);
            const verdict = items.length
              ? items.length === 1
                ? items[0]
                : `${items.slice(0, -1).join(", ")}, or ${items[items.length - 1]}`
              : model.verdict ?? "";
            return (
              <div
                key={model.id}
                className="rounded-xl bg-surface p-4 border border-border"
                style={{ borderLeft: `3px solid ${MODEL_COLORS[i]}` }}
              >
                <p
                  className="font-mono text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: MODEL_COLORS[i] }}
                >
                  Pick {model.name} if…
                </p>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  {verdict.length ? `You want ${verdict.charAt(0).toLowerCase()}${verdict.slice(1)}.` : "—"}
                </p>
              </div>
            );
          })}
        </div>


        {/* Specs table */}
        <SectionHeader>Specifications</SectionHeader>
        <div className="rounded-xl border border-border overflow-hidden mb-10">
          {SPEC_ROWS.map((row) => {
            const winnerId = row.getWinner?.(selected) ?? null;
            return (
              <div
                key={row.label}
                className="grid border-b border-border last:border-b-0"
                style={{ gridTemplateColumns: `140px repeat(${selected.length}, 1fr)` }}
              >
                <div className="px-4 py-2.5 flex items-center bg-surface">
                  <span className="font-mono text-[11px] text-text-sub">{row.label}</span>
                </div>
                {selected.map((m, i) => {
                  const isWinner = winnerId === m.id;
                  const isHighlighted = !isWinner && (row.highlight?.(m) ?? false);
                  return (
                    <div key={m.id} className="px-4 py-2.5 bg-bg border-l border-border flex items-center">
                      {isWinner ? (
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: MODEL_COLORS[i],
                            backgroundColor: `${MODEL_COLORS[i]}14`,
                          }}
                        >
                          {String(row.render(m))}
                        </span>
                      ) : (
                        <span
                          className="font-mono text-xs"
                          style={isHighlighted ? { color: MODEL_COLORS[i], fontWeight: 600 } : { color: "#a89fc0" }}
                        >
                          {String(row.render(m))}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Strengths & Trade-offs */}
        <SectionHeader>Strengths &amp; Trade-offs</SectionHeader>
        <div
          className="grid gap-4 mb-10"
          style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}
        >
          {selected.map((model, i) => (
            <div
              key={model.id}
              className="rounded-xl border border-border bg-surface p-4 space-y-4"
            >
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: MODEL_COLORS[i] }}>
                {model.name}
              </p>

              {model.strengths.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-open-green uppercase tracking-wider mb-2">Strengths</p>
                  <ul className="space-y-1.5">
                    {model.strengths.slice(0, 5).map((s, j) => (
                      <li key={j} className="font-sans text-[11px] text-text-sub leading-snug">
                        <span className="text-open-green mr-1">+</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {model.weaknesses.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-closed-orange uppercase tracking-wider mb-2">Trade-offs</p>
                  <ul className="space-y-1.5">
                    {model.weaknesses.slice(0, 5).map((s, j) => (
                      <li key={j} className="font-sans text-[11px] text-text-sub leading-snug">
                        <span className="text-closed-orange mr-1">-</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {model.bestFor.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-violet uppercase tracking-wider mb-2">Best For</p>
                  <ul className="space-y-1.5">
                    {model.bestFor.slice(0, 4).map((s, j) => (
                      <li key={j} className="font-sans text-[11px] text-text-sub leading-snug">
                        <span className="text-violet mr-1">&#8594;</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-violet/30 bg-violet/5 p-6 text-center">
          <h2 className="font-sans font-bold text-lg text-text-main mb-1">
            Run these models on Floyo
          </h2>
          <p className="font-sans text-sm text-text-sub mb-5">
            Browser-based ComfyUI. No setup, no GPU required.
          </p>

          {allWorkflows.length > 0 ? (
            <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {allWorkflows.map((wf, i) => (
                <a
                  key={i}
                  href={wf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-border hover:border-violet/50 bg-surface p-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                      style={{ color: wf.color, borderColor: `${wf.color}40`, backgroundColor: `${wf.color}15` }}
                    >
                      {wf.type}
                    </span>
                    <span className="font-mono text-[9px] text-muted">{wf.modelName}</span>
                  </div>
                  <p className="font-sans text-xs text-text-main group-hover:text-violet transition-colors leading-snug">
                    {wf.name}
                  </p>
                  {wf.runs && (
                    <p className="font-mono text-[10px] text-muted mt-0.5">{wf.runs} runs</p>
                  )}
                </a>
              ))}
            </div>
          ) : null}

          <a
            href="https://floyo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans text-sm font-semibold px-6 py-3 rounded-xl bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors"
          >
            Open Floyo &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] text-muted uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}
