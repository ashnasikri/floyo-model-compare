import type { Metadata } from "next";
import Link from "next/link";
import { models } from "@/lib/models";
import SpecRankingTable, { type RankedModel } from "@/components/SpecRankingTable";

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "FPS in AI Video Generation — Model Comparison and Guide | Floyo",
  description:
    "What does FPS mean in AI video? Compare frames per second across 24 video generation models. From 8fps to 60fps, find the right model for your use case.",
  openGraph: {
    title: "FPS in AI Video Generation — Model Comparison and Guide | Floyo",
    description:
      "What does FPS mean in AI video? Compare frames per second across 24 video generation models. From 8fps to 60fps, find the right model for your use case.",
    url: "https://compare.floyo.ai/specs/fps",
    type: "article",
  },
};

// ── Data helpers ──────────────────────────────────────────────────────────────
// When building other spec pages (resolution, duration, cost), copy this section
// and replace the parsing and tier logic below.

function parseFPS(fps: string): number {
  const nums = fps.match(/\d+/g)?.map(Number) ?? [];
  return nums.length ? Math.max(...nums) : 0;
}

function getFpsTier(maxFps: number): { label: string; color: string; bgColor: string } {
  if (maxFps >= 48) return { label: "48–60 fps", color: "#ffc15e", bgColor: "#ffc15e18" };
  if (maxFps >= 30) return { label: "30 fps",    color: "#60c4a0", bgColor: "#60c4a018" };
  if (maxFps >= 24) return { label: "24 fps",    color: "#AF7FF4", bgColor: "#AF7FF418" };
  return               { label: "Sub-24 fps", color: "#f07070", bgColor: "#f0707018" };
}

// ── Page config ───────────────────────────────────────────────────────────────
// Adapt these objects for each new spec page — the rendering JSX below is generic.

const FPS_TIER_CARDS = [
  {
    fps: "8 fps",
    label: "Slideshow",
    color: "#f07070",
    bg: "#f0707010",
    description:
      "Noticeable frame-to-frame jumps. Only useful for very stylized or experimental work.",
    models: "CogVideoX-5B",
  },
  {
    fps: "24 fps",
    label: "Cinema standard",
    color: "#AF7FF4",
    bg: "#AF7FF410",
    description:
      'The cinema standard. Films are shot at 24fps. Natural for narrative content, cinematic B-roll, and anything that should feel "filmy."',
    models:
      "Wan 2.1, Wan 2.2, Wan 2.6, HunyuanVideo, SkyReels V2, Seedance 2.0, Luma Ray 3, Pika 2.5, Grok Imagine, Adobe Firefly",
  },
  {
    fps: "30 fps",
    label: "Broadcast standard",
    color: "#60c4a0",
    bg: "#60c4a010",
    description:
      "Slightly smoother than 24fps. Broadcast and gaming standard. Used for social media, YouTube, and product demos — content that needs to feel present rather than cinematic.",
    models: "Mochi 1, Kling O1, Runway Gen-4.5, Veo 3.1, Sora 2, Hailuo 2.3",
  },
  {
    fps: "48–60 fps",
    label: "Hypersmooth",
    color: "#ffc15e",
    bg: "#ffc15e10",
    description:
      'Sports, VR, product spins, macro detail. Can look too smooth for narrative (the "soap opera effect"). Useful for specific production needs, not everything.',
    models: "LTX-2.3 (up to 50fps), LTX-2 (up to 50fps), Kling 3.0 (up to 60fps)",
  },
];

const RECOMMENDATIONS = [
  {
    question: "Making a short film or narrative content?",
    answer:
      "It's the standard for a reason — film looks like film at 24fps. The slight motion blur between frames is what makes cinema feel cinematic.",
    spec: "24 fps",
    modelNames: "Wan 2.2, SkyReels V2, Luma Ray 3",
    compareIds: ["wan-2-2", "skyreels-v2", "luma-ray-3"],
  },
  {
    question: "Making social media content or product demos?",
    answer:
      "Slightly smoother than cinema without looking hyperreal. Better for scroll-stopping content that needs to feel present and immediate.",
    spec: "30 fps",
    modelNames: "Runway Gen-4.5, Veo 3.1, Kling 3.0",
    compareIds: ["runway-gen-4-5", "veo-3-1", "kling-3-0"],
  },
  {
    question: "Making product spins, macro shots, or VR content?",
    answer:
      "Maximum smoothness for content where fluidity matters more than cinematic feel. Every frame counts when showing fine detail in motion.",
    spec: "48–60 fps",
    modelNames: "LTX-2.3, Kling 3.0",
    compareIds: ["ltx-2-3", "kling-3-0"],
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is FPS in AI video generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FPS (frames per second) is how many individual images an AI video model generates for each second of output. Higher FPS produces smoother motion. 24fps is the cinema standard, 30fps is used for broadcast and social media, and models like LTX-2.3 and Kling 3.0 reach 48–60fps for maximum smoothness.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI video model has the highest FPS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kling 3.0 supports up to 60fps, the highest of any current AI video model. LTX-2.3 and LTX-2 support up to 50fps. Most models — including Wan 2.2, HunyuanVideo, and Luma Ray 3 — generate at 24fps (cinema standard).",
      },
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FpsSpecPage() {
  // Build ranked models — pass as serializable props to the client table
  const rankedModels: RankedModel[] = models
    .map((m) => {
      const numericValue = parseFPS(m.fps);
      return {
        ...m,
        displayValue: m.fps,
        numericValue,
        specTier: getFpsTier(numericValue),
      };
    })
    .sort((a, b) => b.numericValue - a.numericValue);

  // Floyo workflows from high-FPS models only
  const highFpsWorkflows = models
    .filter((m) => parseFPS(m.fps) >= 48)
    .flatMap((m) =>
      m.workflows
        .filter((w) => w.status.toLowerCase().includes("live") && w.url.includes("floyo.ai"))
        .map((w) => ({ ...w, modelName: m.name }))
    );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="min-h-screen bg-bg">
        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <header className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs text-muted hover:text-text-sub transition-colors"
            >
              Models
            </Link>
            <span className="text-border text-xs">/</span>
            <span className="font-mono text-xs text-muted">Specs</span>
            <span className="text-border text-xs">/</span>
            <span className="font-mono text-xs text-text-sub">FPS</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section className="mb-16">
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-3">
              Spec Guide
            </p>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-main leading-tight mb-4">
              Frames per second in AI video generation
            </h1>
            <p className="font-sans text-base text-text-sub leading-relaxed max-w-2xl">
              What FPS means, how it changes your output, and which models give you the most
            </p>
          </section>

          {/* ── What is FPS ───────────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="what-is-fps">
            <h2
              id="what-is-fps"
              className="font-sans font-bold text-xl text-text-main mb-5"
            >
              What is FPS?
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                Frames per second is how many individual images the model generates for each
                second of video. More frames means smoother motion. Fewer frames means choppier
                output — sometimes stylistic, usually just a hardware limitation.
              </p>
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                The number matters because it determines whether your output looks cinematic,
                hyperreal, or like a flipbook. Most people have seen the difference without
                knowing the term: film looks different from a soap opera, and that&apos;s largely
                an FPS difference. Film is shot at 24fps. Soap operas and live sports are
                broadcast at 30fps or higher. Your brain reads the difference as &ldquo;prestige&rdquo;
                vs &ldquo;immediate&rdquo; even when it can&apos;t articulate why.
              </p>
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                In AI video generation, FPS is set by the model — you don&apos;t always get to
                choose. Some models lock you to 24fps. Others offer a range. A few push to
                50–60fps for specialized use cases. Knowing what each model supports before
                you start saves a lot of wasted generation time.
              </p>
            </div>
          </section>

          {/* ── FPS tier cards ────────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="fps-tiers">
            <h2
              id="fps-tiers"
              className="font-sans font-bold text-xl text-text-main mb-6"
            >
              How FPS changes what you see
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {FPS_TIER_CARDS.map((tier) => (
                <div
                  key={tier.fps}
                  className="rounded-xl p-5 border border-border"
                  style={{
                    backgroundColor: tier.bg,
                    borderLeftColor: tier.color,
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-baseline gap-2.5 mb-2">
                    <span
                      className="font-mono text-xl font-bold"
                      style={{ color: tier.color }}
                    >
                      {tier.fps}
                    </span>
                    <span className="font-sans text-xs font-semibold text-text-sub uppercase tracking-wide">
                      {tier.label}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-text-sub leading-relaxed mb-3">
                    {tier.description}
                  </p>
                  <p className="font-mono text-[10px] text-muted leading-relaxed">
                    {tier.models}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Ranking table ─────────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="models-ranked">
            <h2
              id="models-ranked"
              className="font-sans font-bold text-xl text-text-main mb-2"
            >
              All models ranked by FPS
            </h2>
            <p className="font-sans text-sm text-text-sub mb-6">
              {models.length} models, sorted highest to lowest. Click any model to view its full spec sheet.
            </p>
            <SpecRankingTable models={rankedModels} specLabel="FPS" />
          </section>

          {/* ── Recommendations ───────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="which-fps">
            <h2
              id="which-fps"
              className="font-sans font-bold text-xl text-text-main mb-6"
            >
              Which FPS should you pick?
            </h2>
            <div className="space-y-4">
              {RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.question}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <h3 className="font-sans font-semibold text-sm text-text-main mb-2">
                    {rec.question}
                  </h3>
                  <p className="font-sans text-sm text-text-sub leading-relaxed mb-4">
                    <span
                      className="font-mono text-xs font-bold px-1.5 py-0.5 rounded mr-1"
                      style={{
                        color: getFpsTier(rec.spec === "24 fps" ? 24 : rec.spec === "30 fps" ? 30 : 50).color,
                        backgroundColor: getFpsTier(rec.spec === "24 fps" ? 24 : rec.spec === "30 fps" ? 30 : 50).bgColor,
                      }}
                    >
                      {rec.spec}
                    </span>
                    {rec.answer}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="font-mono text-[10px] text-muted">{rec.modelNames}</p>
                    <Link
                      href={`/compare?ids=${rec.compareIds.join(",")}`}
                      className="font-sans text-xs font-semibold text-violet hover:text-violet-dim transition-colors shrink-0"
                    >
                      Compare these models →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Floyo workflows ───────────────────────────────────────── */}
          {highFpsWorkflows.length > 0 && (
            <section className="mb-16" aria-labelledby="floyo-workflows">
              <h2
                id="floyo-workflows"
                className="font-sans font-bold text-xl text-text-main mb-2"
              >
                Run high-FPS workflows on Floyo
              </h2>
              <p className="font-sans text-sm text-text-sub mb-6">
                Browser-based ComfyUI. No setup, no GPU required.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {highFpsWorkflows.map((wf, i) => (
                  <a
                    key={i}
                    href={wf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-border hover:border-violet/50 bg-surface p-4 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-violet/30 bg-violet/10 text-violet">
                        {wf.type}
                      </span>
                      <span className="font-mono text-[9px] text-muted">{wf.modelName}</span>
                      {wf.runs && (
                        <span className="font-mono text-[9px] text-muted ml-auto">
                          {wf.runs} runs
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-sm text-text-main group-hover:text-violet transition-colors leading-snug">
                      {wf.name}
                    </p>
                    {wf.description && (
                      <p className="font-sans text-[11px] text-muted mt-1.5 leading-relaxed line-clamp-2">
                        {wf.description}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ── CTA ───────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-violet/30 bg-violet/5 p-6 text-center">
            <p className="font-sans font-semibold text-text-main mb-1">
              Compare FPS alongside resolution, audio, cost, and more
            </p>
            <p className="font-sans text-sm text-text-sub mb-5">
              Select any models from the browse view to run a full side-by-side comparison.
            </p>
            <Link
              href="/"
              className="inline-block font-sans text-sm font-semibold px-6 py-3 rounded-xl bg-violet text-[#0d0b11] hover:bg-violet-dim transition-colors"
            >
              Explore all models →
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}
