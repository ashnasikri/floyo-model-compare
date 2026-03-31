import type { Metadata } from "next";
import Link from "next/link";
import { models } from "@/lib/models";
import SpecRankingTable, { type RankedModel } from "@/components/SpecRankingTable";

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Resolution in AI Video Generation — Model Comparison and Guide | Floyo",
  description:
    "What does resolution mean in AI video? Compare 480p to 4K across 24 video generation models. Find the right resolution for your use case.",
  openGraph: {
    title: "Resolution in AI Video Generation — Model Comparison and Guide | Floyo",
    description:
      "What does resolution mean in AI video? Compare 480p to 4K across 24 video generation models. Find the right resolution for your use case.",
    url: "https://compare.floyo.ai/specs/resolution",
    type: "article",
  },
};

// ── Data helpers ──────────────────────────────────────────────────────────────
function parseResolution(s: string): number {
  const l = s.toLowerCase();
  // Native 4K wins over upscaled — "upscaled 4K" is still 1080p source
  if (l.includes("native 4k") || l.includes("3840")) return 2160;
  if ((l.includes("4k") || l.includes("2160")) && !l.includes("upscaled")) return 2160;
  if (l.includes("1080")) return 1080;
  if (l.includes("720")) return 720;
  if (l.includes("480")) return 480;
  return 0;
}

function getResolutionTier(px: number): { label: string; color: string; bgColor: string } {
  if (px >= 2160) return { label: "4K",    color: "#ffc15e", bgColor: "#ffc15e18" };
  if (px >= 1080) return { label: "1080p", color: "#60c4a0", bgColor: "#60c4a018" };
  if (px >= 720)  return { label: "720p",  color: "#AF7FF4", bgColor: "#AF7FF418" };
  if (px >= 480)  return { label: "480p",  color: "#f07070", bgColor: "#f0707018" };
  return                  { label: "Varies", color: "#6b6480", bgColor: "#6b648018" };
}

// ── Page config ───────────────────────────────────────────────────────────────
const RESOLUTION_TIER_CARDS = [
  {
    res: "480p",
    label: "Entry level",
    color: "#f07070",
    bg: "#f0707010",
    description:
      "Soft, low detail. Fine for quick previews and experimental work. Most models have moved past this — it's a legacy baseline, not a target.",
    models: "Mochi 1",
  },
  {
    res: "720p",
    label: "HD — Open-source baseline",
    color: "#AF7FF4",
    bg: "#AF7FF410",
    description:
      "HD quality. Works well for social media, web, and most everyday use cases. Where the majority of open-source models sit — fast to generate, low VRAM.",
    models: "Wan 2.2, Wan 2.1, HunyuanVideo 1.5, SkyReels V2, CogVideoX-5B, Open-Sora 2.0, Grok Imagine",
  },
  {
    res: "1080p",
    label: "Full HD — Commercial standard",
    color: "#60c4a0",
    bg: "#60c4a010",
    description:
      "Full HD. The industry standard for YouTube, streaming, and commercial deliverables. Sharp enough for most professional work without the VRAM cost of 4K.",
    models: "Wan 2.6, Sora 2, Runway Gen-4.5, Veo 3.1, Seedance 2.0, Hailuo 2.3, Pika 2.5, Vidu 2.0, PixVerse 5.5",
  },
  {
    res: "4K",
    label: "Ultra HD — Maximum detail",
    color: "#ffc15e",
    bg: "#ffc15e10",
    description:
      "Four times the pixels of 1080p. For large-screen playback, demanding production, product close-ups, and anything that needs to hold up at scale. Costs more VRAM or cloud compute.",
    models: "LTX-2.3, LTX-2, Kling 3.0 (native), Kling O1, Luma Ray 3 (HDR), Adobe Firefly Video, Veo 3.1",
  },
];

const RECOMMENDATIONS = [
  {
    question: "Making content for social media or quick delivery?",
    answer:
      "Fast to generate, low hardware requirements, and more than sharp enough for any phone or laptop screen. The sweet spot for volume and iteration.",
    res: "720p",
    resValue: 720,
    modelNames: "Wan 2.2, SkyReels V2, HunyuanVideo 1.5",
    compareIds: ["wan-2-2", "skyreels-v2", "hunyuanvideo-1-5"],
  },
  {
    question: "Making YouTube, streaming, or commercial content?",
    answer:
      "The industry standard. Looks professional on any screen, accepted by every platform, and doesn't require specialized hardware to generate.",
    res: "1080p",
    resValue: 1080,
    modelNames: "Sora 2, Runway Gen-4.5, Seedance 2.0",
    compareIds: ["sora-2", "runway-gen-4-5", "seedance-2-0"],
  },
  {
    question: "Making content for large screens, print, or demanding production?",
    answer:
      "Maximum detail for content that needs to hold up at scale — digital signage, cinema output, high-end commercial, or anything you're cropping and reframing.",
    res: "4K",
    resValue: 2160,
    modelNames: "LTX-2.3, Kling 3.0, Adobe Firefly Video",
    compareIds: ["ltx-2-3", "kling-3-0", "adobe-firefly-video"],
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What resolution do AI video models generate at?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI video models range from 480p to native 4K. Most open-source models generate at 720p (HD). Commercial models like Sora 2, Runway Gen-4.5, and Veo 3.1 output at 1080p. The highest-resolution models — LTX-2.3, Kling 3.0, and Adobe Firefly Video — support true 4K output.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI video model has the highest resolution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kling 3.0 generates native 4K at 3840×2160. LTX-2.3 and LTX-2 also support 4K output at up to 50fps. Luma Ray 3 outputs 4K in HDR EXR format. Adobe Firefly Video and Kling O1 both support 4K as well.",
      },
    },
    {
      "@type": "Question",
      name: "Is 4K always better in AI video generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not always. 4K requires significantly more VRAM or cloud compute, and generation is slower. For social media, web content, or rapid iteration, 720p or 1080p is often the right choice. 4K is best when content will be displayed on large screens, heavily cropped, or used in professional production pipelines.",
      },
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResolutionSpecPage() {
  const rankedModels: RankedModel[] = models
    .map((m) => {
      const numericValue = parseResolution(m.maxResolution);
      return {
        ...m,
        displayValue: m.maxResolution,
        numericValue,
        specTier: getResolutionTier(numericValue),
      };
    })
    .sort((a, b) => b.numericValue - a.numericValue);

  // Floyo workflows from 4K models
  const fourKWorkflows = models
    .filter((m) => parseResolution(m.maxResolution) >= 2160)
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
            <Link href="/" className="font-mono text-xs text-muted hover:text-text-sub transition-colors">
              Models
            </Link>
            <span className="text-border text-xs">/</span>
            <span className="font-mono text-xs text-muted">Specs</span>
            <span className="text-border text-xs">/</span>
            <span className="font-mono text-xs text-text-sub">Resolution</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section className="mb-16">
            <p className="font-mono text-[10px] text-violet uppercase tracking-widest mb-3">
              Spec Guide
            </p>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-main leading-tight mb-4">
              Resolution in AI video generation
            </h1>
            <p className="font-sans text-base text-text-sub leading-relaxed max-w-2xl">
              From 480p to native 4K — what resolution means, when it matters, and which models give you the most pixels
            </p>
          </section>

          {/* ── What is Resolution ────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="what-is-resolution">
            <h2 id="what-is-resolution" className="font-sans font-bold text-xl text-text-main mb-5">
              What is resolution?
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                Resolution is the number of pixels in each frame — width × height. A 1080p video is
                1920×1080 pixels. A 4K video is 3840×2160. More pixels means more detail, sharper
                edges, and more room to crop or reframe in post.
              </p>
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                In AI video generation, resolution matters for two reasons: how sharp the output looks,
                and how much compute it takes to generate. Higher resolution isn&apos;t free — models
                generating at 4K need significantly more VRAM or cloud time than the same model at 720p.
                Some models offer a resolution range; others are fixed.
              </p>
              <p className="font-sans text-sm text-text-sub leading-relaxed">
                One thing to watch for: &ldquo;upscaled 4K&rdquo; is not the same as native 4K. Some
                models generate at 1080p and run a separate upscaling pass. The result can look good,
                but it won&apos;t hold up under close inspection the way true 4K does. The ranking below
                distinguishes these — upscaled models are listed at their native generation resolution.
              </p>
            </div>
          </section>

          {/* ── Resolution tier cards ─────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="resolution-tiers">
            <h2 id="resolution-tiers" className="font-sans font-bold text-xl text-text-main mb-6">
              How resolution changes what you see
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {RESOLUTION_TIER_CARDS.map((tier) => (
                <div
                  key={tier.res}
                  className="rounded-xl p-5 border border-border"
                  style={{
                    backgroundColor: tier.bg,
                    borderLeftColor: tier.color,
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-baseline gap-2.5 mb-2">
                    <span className="font-mono text-xl font-bold" style={{ color: tier.color }}>
                      {tier.res}
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
            <h2 id="models-ranked" className="font-sans font-bold text-xl text-text-main mb-2">
              All models ranked by resolution
            </h2>
            <p className="font-sans text-sm text-text-sub mb-6">
              {models.length} models, sorted highest to lowest. Click any model to view its full spec sheet.
            </p>
            <SpecRankingTable models={rankedModels} specLabel="Resolution" />
          </section>

          {/* ── Recommendations ───────────────────────────────────────── */}
          <section className="mb-16" aria-labelledby="which-resolution">
            <h2 id="which-resolution" className="font-sans font-bold text-xl text-text-main mb-6">
              Which resolution should you pick?
            </h2>
            <div className="space-y-4">
              {RECOMMENDATIONS.map((rec) => {
                const tier = getResolutionTier(rec.resValue);
                return (
                  <div key={rec.question} className="rounded-xl border border-border bg-surface p-5">
                    <h3 className="font-sans font-semibold text-sm text-text-main mb-2">
                      {rec.question}
                    </h3>
                    <p className="font-sans text-sm text-text-sub leading-relaxed mb-4">
                      <span
                        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded mr-1"
                        style={{ color: tier.color, backgroundColor: tier.bgColor }}
                      >
                        {rec.res}
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
                );
              })}
            </div>
          </section>

          {/* ── Floyo workflows ───────────────────────────────────────── */}
          {fourKWorkflows.length > 0 && (
            <section className="mb-16" aria-labelledby="floyo-workflows">
              <h2 id="floyo-workflows" className="font-sans font-bold text-xl text-text-main mb-2">
                Run 4K workflows on Floyo
              </h2>
              <p className="font-sans text-sm text-text-sub mb-6">
                Browser-based ComfyUI. No setup, no GPU required.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {fourKWorkflows.map((wf, i) => (
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
                        <span className="font-mono text-[9px] text-muted ml-auto">{wf.runs} runs</span>
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
              Compare resolution alongside FPS, audio, cost, and more
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
