export default function SourceBadge({
  sourceType,
}: {
  sourceType: "Open Source" | "Closed Source" | string;
}) {
  const isOpen = sourceType === "Open Source";
  return (
    <span
      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
        isOpen
          ? "bg-open-green/15 text-open-green border border-open-green/30"
          : "bg-closed-orange/15 text-closed-orange border border-closed-orange/30"
      }`}
    >
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
