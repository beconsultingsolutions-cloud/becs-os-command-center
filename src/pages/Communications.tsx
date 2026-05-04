import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Communications({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="communications" data={data}>
      <WorkTable description="Entity-specific drafts and follow-ups." items={data.communications} title="Communication queue" />
    </PageShell>
  );
}
