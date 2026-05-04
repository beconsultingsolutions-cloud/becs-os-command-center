import { getApiHealth } from "../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui";

export function HealthCheck() {
  const health = getApiHealth();

  return (
    <Card className="health-check" data-testid="section-health-check">
      <CardHeader className="health-check__header">
        <CardTitle>Health check</CardTitle>
        <CardDescription>Frontend deployment readiness for the BECS OS command center.</CardDescription>
      </CardHeader>
      <CardContent className="health-check__grid">
        <HealthItem label="API mode" value={health.apiMode} />
        <HealthItem label="API URL configured" value={health.apiUrlConfigured ? "Yes" : "No"} />
        <HealthItem label="Last dashboard fetch status" value={health.lastDashboardFetchStatus} wide />
      </CardContent>
    </Card>
  );
}

function HealthItem({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "health-check__item health-check__item--wide" : "health-check__item"}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
