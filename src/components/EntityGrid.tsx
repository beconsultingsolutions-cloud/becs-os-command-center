import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { EntityHealth } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";

export function EntityGrid({ entities }: { entities: EntityHealth[] }) {
  return (
    <div className="entity-grid" data-testid="grid-entities">
      {entities.map((entity) => (
        <Card key={entity.entity} data-testid={`card-entity-${entity.entity.toLowerCase().replaceAll(" ", "-")}`}>
          <CardHeader className="entity-card__header">
            <div>
              <CardTitle className="entity-card__title">{entity.entity}</CardTitle>
              <p className="card__description">{entity.tone}</p>
            </div>
            {entity.risks > 0 ? (
              <AlertTriangle className="icon icon--danger" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="icon icon--success" aria-hidden="true" />
            )}
          </CardHeader>
          <CardContent className="entity-card__metrics">
            <EntityStat label="Tasks" value={entity.openTasks} />
            <EntityStat label="Sales" value={entity.sales} />
            <EntityStat label="Onboard" value={entity.onboarding} />
            <EntityStat label="Risk" value={entity.risks} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EntityStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="entity-stat" data-testid={`metric-${label.toLowerCase()}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
