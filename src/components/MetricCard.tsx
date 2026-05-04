import type { Metric } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle, TrendIcon } from "./ui";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card data-testid={`card-kpi-${metric.label.toLowerCase().replaceAll(" ", "-")}`}>
      <CardHeader className="metric-card__header">
        <div>
          <p className="metric-card__label">{metric.label}</p>
          <CardTitle className="metric-card__value">{metric.value}</CardTitle>
        </div>
        <TrendIcon trend={metric.trend} />
      </CardHeader>
      <CardContent>
        <p className="metric-card__detail">{metric.detail}</p>
      </CardContent>
    </Card>
  );
}
