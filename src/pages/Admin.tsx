import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Admin({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="admin" data={data}>
      <WorkTable description="Records, files, contracts, and review items." items={data.adminRecords} title="Admin records" />
    </PageShell>
  );
}
