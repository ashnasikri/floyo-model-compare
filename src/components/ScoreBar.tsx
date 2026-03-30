"use client";

interface ScoreBarProps {
  label: string;
  value: number; // 0-10
  max?: number;
  color?: string; // override color (used in compare view)
}

const SCORE_COLORS: Record<string, string> = {
  quality: "#AF7FF4",
  motion: "#7dd8b0",
  speed: "#60bfff",
  control: "#ffcc66",
  audio: "#ff88bb",
  value: "#ff9966",
};

export default function ScoreBar({ label, value, max = 10, color }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100);
  const barColor = color ?? SCORE_COLORS[label.toLowerCase()] ?? "#AF7FF4";

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-text-sub uppercase w-12 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="font-mono text-[10px] text-text-sub w-6 text-right">
        {value === 0 ? "-" : value}
      </span>
    </div>
  );
}
