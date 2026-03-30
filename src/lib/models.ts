import type { Model } from "@/types/model";
import modelsData from "../../data/models.json";

export const models: Model[] = modelsData as Model[];

export function getModelBySlug(slug: string): Model | undefined {
  return models.find((m) => m.id === slug);
}

export const TIER_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };

export function sortModels(
  list: Model[],
  sortBy: "tier" | "released" | "price" | "quality"
): Model[] {
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case "tier":
        return (TIER_ORDER[a.tier] ?? 4) - (TIER_ORDER[b.tier] ?? 4);
      case "released":
        // Compare release strings — sort newer first
        return b.released.localeCompare(a.released);
      case "price": {
        // "Self-host" and free models go to the end
        const priceA = parseFloat(a.costPerSecond) || 9999;
        const priceB = parseFloat(b.costPerSecond) || 9999;
        return priceA - priceB;
      }
      case "quality":
        return b.scores.quality - a.scores.quality;
      default:
        return 0;
    }
  });
}

export function filterModels(
  list: Model[],
  filter: string
): Model[] {
  switch (filter) {
    case "open":
      return list.filter((m) => m.sourceType === "Open Source");
    case "closed":
      return list.filter((m) => m.sourceType === "Closed Source");
    case "audio":
      return list.filter((m) => m.nativeAudio);
    case "1080p":
      return list.filter((m) => {
        const res = m.maxResolution.toLowerCase();
        return res.includes("1080") || res.includes("2k") || res.includes("2160") || res.includes("4k") || res.includes("1440");
      });
    default:
      return list;
  }
}
