"use client";

import Link from "next/link";
import type { Model } from "@/types/model";
import TierBadge from "./TierBadge";
import SourceBadge from "./SourceBadge";

interface ModelCardProps {
  model: Model;
  selected: boolean;
  onToggleCompare: (id: string) => void;
  compareDisabled: boolean; // true when 3 selected and this one is not
}

export default function ModelCard({
  model,
  selected,
  onToggleCompare,
  compareDisabled,
}: ModelCardProps) {
  return (
    <div
      className={`relative flex flex-col bg-surface rounded-xl border transition-all duration-150 ${
        selected
          ? "border-violet shadow-[0_0_0_1px_#AF7FF4]"
          : "border-border hover:border-violet/40"
      }`}
    >
      {/* On Floyo ribbon */}
      {model.onFloyo && (
        <div className="absolute top-3 right-3 z-10">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet/20 text-violet border border-violet/40">
            On Floyo
          </span>
        </div>
      )}

      {/* Checkbox for compare */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleCompare(model.id);
          }}
          disabled={compareDisabled}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            selected
              ? "bg-violet border-violet"
              : compareDisabled
              ? "border-border opacity-30 cursor-not-allowed"
              : "border-muted hover:border-violet bg-surface-2"
          }`}
          title={selected ? "Remove from compare" : "Add to compare"}
        >
          {selected && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.5 5L4 7.5L8.5 2.5"
                stroke="#0d0b11"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Card content — clickable to detail */}
      <Link href={`/models/${model.id}`} className="flex flex-col flex-1 p-4 pt-10">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <TierBadge tier={model.tier} />
            <SourceBadge sourceType={model.sourceType} />
          </div>
          <h2 className="font-sans font-semibold text-base text-text-main leading-tight">
            {model.name}
          </h2>
          <p className="font-mono text-[11px] text-text-sub mt-0.5">
            {model.maker}
          </p>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {model.maxResolution && (
            <SpecChip>{model.maxResolution}</SpecChip>
          )}
          {model.maxDuration && (
            <SpecChip>{model.maxDuration}</SpecChip>
          )}
          {model.fps && <SpecChip>{model.fps} fps</SpecChip>}
          {model.nativeAudio && (
            <SpecChip highlight>Audio</SpecChip>
          )}
          {model.comfyUISupport && (
            <SpecChip>ComfyUI</SpecChip>
          )}
          {model.costPerSecond && (
            <SpecChip>{model.costPerSecond === "Self-host" ? "Self-host" : `$${model.costPerSecond}/s`}</SpecChip>
          )}
        </div>


      </Link>
    </div>
  );
}

function SpecChip({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
        highlight
          ? "bg-open-green/15 text-open-green border border-open-green/30"
          : "bg-surface-2 text-text-sub border border-border"
      }`}
    >
      {children}
    </span>
  );
}
