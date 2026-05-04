import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Calendar({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="calendar" data={data}>
      <WorkTable description="Calendar-ready work items and deadline controls." items={[...data.projects, ...data.tasks].slice(0, 5)} title="Calendar controls" />
    </PageShell>
  );
}
