const TIER_STYLES: Record<string, string> = {
  S: "bg-violet/20 text-violet border border-violet/40",
  A: "bg-open-green/15 text-open-green border border-open-green/30",
  B: "bg-closed-orange/15 text-closed-orange border border-closed-orange/30",
  C: "bg-muted/20 text-muted border border-muted/30",
};

export default function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${TIER_STYLES[tier] ?? TIER_STYLES.C}`}
    >
      {tier}
    </span>
  );
}
