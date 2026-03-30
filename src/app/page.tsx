import { models } from "@/lib/models";
import BrowseClient from "@/components/BrowseClient";

export default function HomePage({
  searchParams,
}: {
  searchParams: { filter?: string; sort?: string };
}) {
  return (
    <BrowseClient
      models={models}
      initialFilter={searchParams.filter ?? "all"}
      initialSort={searchParams.sort ?? "tier"}
    />
  );
}
