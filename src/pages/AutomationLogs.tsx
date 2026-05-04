import { TriggerList } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function AutomationLogs({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="automation" data={data}>
      <TriggerList items={data.automationRuns} title="Automation runs" />
    </PageShell>
  );
}
