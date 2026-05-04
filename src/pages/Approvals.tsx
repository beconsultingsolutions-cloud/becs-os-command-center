import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Approvals({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="approvals" data={data}>
      <WorkTable description="Actions waiting for your review." items={data.approvals} title="Approval gate" />
    </PageShell>
  );
}
