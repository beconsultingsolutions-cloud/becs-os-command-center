import type { IntakeEvent, PipelineItem, TriggerItem, WorkItem } from "../lib/types";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from "./ui";

export function PipelineTable({ items }: { items: PipelineItem[] }) {
  return (
    <Card data-testid="table-sales-pipeline">
      <CardHeader>
        <CardTitle>Priority pipeline</CardTitle>
        <CardDescription>Revenue conversations needing operating attention.</CardDescription>
      </CardHeader>
      <CardContent className="table-wrap">
        {items.length === 0 ? (
          <EmptyState title="No sales records yet" description="New sales events will appear here after intake creates pipeline records." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Entity</th>
                <th>Stage</th>
                <th>Next action</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} data-testid={`row-pipeline-${item.id}`}>
                  <td>{item.name}</td>
                  <td>{item.entity}</td>
                  <td><Badge value={item.stage} /></td>
                  <td>{item.nextAction}</td>
                  <td>{item.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function WorkTable({ title, description, items }: { title: string; description: string; items: WorkItem[] }) {
  return (
    <Card data-testid={`table-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="table-wrap">
        {items.length === 0 ? (
          <EmptyState title={`No ${title.toLowerCase()} yet`} description="Records will appear here once the backend creates live operating objects." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Entity</th>
                <th>Workflow</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} data-testid={`row-work-${item.id}`}>
                  <td>{item.title}</td>
                  <td>{item.entity}</td>
                  <td>{item.workflow}</td>
                  <td><Badge value={item.status} /></td>
                  <td className="capitalize">{item.priority}</td>
                  <td>{item.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function TriggerList({ title, items }: { title: string; items: TriggerItem[] }) {
  return (
    <Card data-testid={`table-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Rule decisions stay visible and auditable.</CardDescription>
      </CardHeader>
      <CardContent className="trigger-list">
        {items.length === 0 ? (
          <EmptyState title="No automation records yet" description="Trigger activity will appear here after live events are processed." />
        ) : (
          items.map((item) => (
            <div className="trigger-row" data-testid={`row-trigger-${item.id}`} key={item.id}>
              <div className="trigger-row__top">
                <div>
                  <p>{item.trigger}</p>
                  <span>{item.summary}</span>
                </div>
                <Badge value={item.status} />
              </div>
              <div className="trigger-row__meta">
                <span>{item.action}</span>
                <span>{item.entity}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function IntakeEventsTable({ items }: { items: IntakeEvent[] }) {
  return (
    <Card data-testid="table-recent-intake-events">
      <CardHeader>
        <CardTitle>Recent intake events</CardTitle>
        <CardDescription>Recent intake events awaiting classification or processing.</CardDescription>
      </CardHeader>
      <CardContent className="table-wrap">
        {items.length === 0 ? (
          <EmptyState title="No intake events yet" description="Submit an intake event to see it appear here once the backend records it." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Summary</th>
                <th>Status</th>
                <th>Workflow</th>
                <th>Entity</th>
                <th>Action</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const classification = item.classification;
                return (
                  <tr key={item.id} data-testid={`row-intake-${item.id}`}>
                    <td>{item.request_summary || item.title || "Untitled intake event"}</td>
                    <td><Badge value={item.status} /></td>
                    <td>{classification?.workflow_category || item.workflow || "-"}</td>
                    <td>{classification?.suggested_entity_slug || item.suggested_entity || item.entity || "-"}</td>
                    <td>{classification?.required_action || (item.workflow ? "Review intake event" : "-")}</td>
                    <td>{formatConfidence(classification?.confidence)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function formatConfidence(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? `${(numeric > 1 ? numeric : numeric * 100).toFixed(0)}%` : String(value);
}
