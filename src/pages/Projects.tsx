import { WorkTable } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Projects({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="projects" data={data}>
      <WorkTable description="Execution workstreams and current blockers." items={data.projects} title="Active projects" />
    </PageShell>
  );
}
