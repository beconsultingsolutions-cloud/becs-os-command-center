import { PipelineTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function SalesPipeline({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="sales" data={data}>
      <PipelineTable items={data.pipeline} />
    </PageShell>
  );
}
