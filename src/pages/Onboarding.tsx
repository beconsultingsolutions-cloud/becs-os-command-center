import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Onboarding({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="onboarding" data={data}>
      <WorkTable description="Setup workflows across all entities." items={data.onboarding} title="Onboarding workflows" />
    </PageShell>
  );
}
