import { models, getModelBySlug } from "@/lib/models";
import { notFound } from "next/navigation";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";
import SourceBadge from "@/components/SourceBadge";
import ScoreBar from "@/components/ScoreBar";
import type { Model } from "@/types/model";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.id }));
}

const SCORE_KEYS = [
  { key: "quality" as const, label: "Quality" },
  { key: "motion" as const, label: "Motion" },
  { key: "speed" as const, label: "Speed" },
  { key: "control" as const, label: "Control" },
  { key: "audio" as const, label: "Audio" },
  { key: "value" as const, label: "Value" },
];

const TYPE_COLORS: Record<string, string> = {
  T2V: "#AF7FF4",
  I2V: "#60c4a0",
  V2V: "#ffc15e",
  A2V: "#60bfff",
  "Audio/Foley": "#ff88bb",
  Character: "#ff9966",
  Preprocessing: "#a89fc0",
};

export default function ModelDetailPage({ params }: { params: { slug: string } }) {
  const model = getModelBySlug(params.slug);
  if (!model) notFound();

  const liveWorkflows = model.workflows.filter((w) =>
    w.status.toLowerCase().includes("live")
  );

  // Related models: same tier first, then same source, exclude self, take 3
  const related = models
    .filter((m) => m.id !== model.id)
    .sort((a, b) => {
      const aTierMatch = a.tier === model.tier ? 0 : 1;
      const bTierMatch = b.tier === model.tier ? 0 : 1;
      if (aTierMatch !== bTierMatch) return aTierMatch - bTierMatch;
      const aSourceMatch = a.sourceType === model.sourceType ? 0 : 1;
      const bSourceMatch = b.sourceType === model.sourceType ? 0 : 1;
      return aSourceMatch - bSourceMatch;
    })
    .slice(0, 3);

  const specs = [
    { label: "Max Resolution", value: model.maxResolution },
    { label: "Max Duration", value: model.maxDuration },
    { label: "FPS", value: model.fps },
    { label: "Native Audio", value: model.nativeAudio ? "Yes" : "No", highlight: model.nativeAudio },
    { label: "ComfyUI Support", value: model.comfyUISupport ? "Yes" : "No", highlight: model.comfyUISupport },
    { label: "Fine-tunable", value: model.finetuneable ? "Yes" : "No", highlight: model.finetuneable },
    { label: "Min VRAM", value: model.minVRAM },
    { label: "Cost / Second", value: model.costPerSecond },
    { label: "Architecture", value: model.architecture },
    { label: "Parameters", value: model.parameters },
    { label: "Inputs", value: model.inputsSupported },
    { label: "License", value: model.license },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav / breadcrumb */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 font-mono text-xs">
            <Link href="/" className="text-muted hover:text-text-sub transition-colors">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="text-text-sub">{model.name}</span>
          </nav>
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

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <TierBadge tier={model.tier} />
            <SourceBadge sourceType={model.sourceType} />
            {model.onFloyo && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet/20 text-violet border border-violet/40">
                On Floyo
              </span>
            )}
          </div>
          <h1 className="font-sans font-bold text-4xl text-text-main mb-2 leading-tight">
            {model.name}
          </h1>
          <p className="font-mono text-sm text-muted mb-4">
            by {model.maker}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{model.released}
          </p>
          {model.verdict && (
            <p className="font-sans text-base text-text-sub leading-relaxed max-w-2xl">
              {model.verdict}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: specs + strengths */}
          <div className="lg:col-span-2 space-y-8">

            {/* Specs grid */}
            <section>
              <SectionLabel>Specifications</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-surface rounded-lg border border-border p-3"
                  >
                    <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">
                      {spec.label}
                    </p>
                    <p
                      className="font-mono text-xs"
                      style={spec.highlight ? { color: "#7dd8b0", fontWeight: 600 } : { color: "#e8e3f0" }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Strengths / Weaknesses / Best For */}
            <section>
              <SectionLabel>Strengths &amp; Trade-offs</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ListBlock title="Strengths" items={model.strengths} prefix="+" prefixColor="#7dd8b0" titleColor="text-open-green" />
                <ListBlock title="Weaknesses" items={model.weaknesses} prefix="-" prefixColor="#ffaa5c" titleColor="text-closed-orange" />
                <ListBlock title="Best For" items={model.bestFor} prefix="&#8594;" prefixColor="#AF7FF4" titleColor="text-violet" />
              </div>
            </section>

          </div>

          {/* Right: scores + workflows CTA */}
          <div className="space-y-6">

            {/* Scores */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <SectionLabel>Scores</SectionLabel>
              <div className="flex flex-col gap-3">
                {SCORE_KEYS.map(({ key, label }) => (
                  <ScoreBar key={key} label={label} value={model.scores[key]} />
                ))}
              </div>
            </div>

            {/* Run on Floyo CTA */}
            {model.onFloyo && (
              <a
                href="https://floyo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center font-sans text-sm font-semibold px-4 py-3 rounded-xl bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors"
              >
                Run on Floyo &rarr;
              </a>
            )}
          </div>
        </div>

        {/* Workflows on Floyo */}
        <section className="mt-12">
          <SectionLabel>Workflows on Floyo</SectionLabel>

          {liveWorkflows.length > 0 ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {liveWorkflows.map((wf, i) => {
                const typeColor = TYPE_COLORS[wf.type] ?? "#a89fc0";
                return (
                  <a
                    key={i}
                    href={wf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-border hover:border-violet/50 bg-surface p-4 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                        style={{ color: typeColor, borderColor: `${typeColor}40`, backgroundColor: `${typeColor}15` }}
                      >
                        {wf.type}
                      </span>
                      {wf.runs && (
                        <span className="font-mono text-[10px] text-muted">{wf.runs} runs</span>
                      )}
                    </div>
                    <p className="font-sans text-sm font-semibold text-text-main group-hover:text-violet transition-colors mb-1 leading-snug">
                      {wf.name}
                    </p>
                    <p className="font-sans text-xs text-text-sub leading-relaxed line-clamp-3 mb-3">
                      {wf.description}
                    </p>
                    <span className="font-mono text-[11px] text-violet group-hover:underline">
                      Open Workflow &rarr;
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="font-sans text-sm text-text-sub mb-1">Coming soon to Floyo</p>
              <p className="font-sans text-xs text-muted mb-4">
                We are working on bringing {model.name} workflows to the platform.
              </p>
              <a
                href="https://floyo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans text-xs font-semibold px-4 py-2 rounded-lg border border-violet/40 text-violet hover:bg-violet/10 transition-colors"
              >
                Get notified &rarr;
              </a>
            </div>
          )}
        </section>

        {/* Compare with other models */}
        <section className="mt-12">
          <SectionLabel>Compare with other models</SectionLabel>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {related.map((m) => (
              <RelatedCard key={m.id} model={m} currentId={model.id} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-3">{children}</p>
  );
}

function ListBlock({
  title,
  items,
  prefix,
  prefixColor,
  titleColor,
}: {
  title: string;
  items: string[];
  prefix: string;
  prefixColor: string;
  titleColor: string;
}) {
  if (!items.length) return null;
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <p className={`font-mono text-[10px] uppercase tracking-wider mb-2 font-bold ${titleColor}`}>
        {title}
      </p>
      <ul className="space-y-2">
        {items.slice(0, 6).map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span
              className="font-mono text-xs shrink-0 mt-0.5"
              style={{ color: prefixColor }}
              aria-hidden="true"
            >
              {prefix}
            </span>
            <span className="font-sans text-[11px] text-text-sub leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedCard({ model, currentId }: { model: Model; currentId: string }) {
  const compareUrl = `/compare?ids=${currentId},${model.id}`;
  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <TierBadge tier={model.tier} />
          <SourceBadge sourceType={model.sourceType} />
        </div>
        <Link
          href={`/models/${model.id}`}
          className="font-sans font-semibold text-sm text-text-main hover:text-violet transition-colors"
        >
          {model.name}
        </Link>
        <p className="font-mono text-[10px] text-muted mt-0.5">{model.maker}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {["quality", "motion", "speed"].map((key) => (
          <ScoreBar
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={model.scores[key as keyof typeof model.scores]}
          />
        ))}
      </div>
      <Link
        href={compareUrl}
        className="font-mono text-[11px] text-violet hover:underline text-center border border-violet/30 rounded-lg py-1.5 hover:bg-violet/5 transition-colors"
      >
        Compare &rarr;
      </Link>
    </div>
  );
}
