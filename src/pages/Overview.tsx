import { Activity } from "lucide-react";
import { EntityGrid } from "../components/EntityGrid";
import { MetricCard } from "../components/MetricCard";
import { PipelineTable, TriggerList } from "../components/DataTables";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Overview({ data }: { data: CommandCenterData }) {
  return (
    <PageShell route="overview" data={data}>
      <section className="metric-grid" aria-label="Key metrics">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section aria-label="Entity health">
        <div className="section-title">
          <Activity className="icon icon--muted" aria-hidden="true" />
          <h2>Entity health</h2>
        </div>
        <EntityGrid entities={data.entities} />
      </section>
      <div className="overview-grid">
        <PipelineTable items={data.pipeline} />
        <TriggerList title="Latest automation" items={data.automationRuns} />
      </div>
    </PageShell>
  );
}
