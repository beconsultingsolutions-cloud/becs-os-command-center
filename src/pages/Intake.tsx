import { IntakeEventsTable } from "../components/DataTables";
import { IntakeForm } from "../components/IntakeForm";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Intake({ data, onSubmitted }: { data: CommandCenterData; onSubmitted: () => void }) {
  return (
    <PageShell route="intake" data={data}>
      <div className="intake-grid">
        <IntakeForm onSubmitted={onSubmitted} />
        <IntakeEventsTable items={data.intakeEvents.slice(0, 10)} />
      </div>
    </PageShell>
  );
}
