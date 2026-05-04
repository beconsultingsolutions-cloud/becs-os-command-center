import { TriggerList } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Triggers({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="triggers" data={data}>
      <TriggerList items={data.triggers} title="Trigger registry" />
    </PageShell>
  );
}
