import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Tasks({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="tasks" data={data}>
      <WorkTable description="Operational tasks sorted by urgency." items={data.tasks} title="Task queue" />
    </PageShell>
  );
}
