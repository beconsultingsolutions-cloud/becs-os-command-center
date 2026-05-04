import { useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { fetchCommandCenter } from "./lib/api";
import type { CommandCenterData, RouteKey } from "./lib/types";
import { Layout } from "./components/Layout";
import { HealthCheck } from "./components/HealthCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui";
import { Admin } from "./pages/Admin";
import { Approvals } from "./pages/Approvals";
import { AutomationLogs } from "./pages/AutomationLogs";
import { Calendar } from "./pages/Calendar";
import { Communications } from "./pages/Communications";
import { Intake } from "./pages/Intake";
import { Onboarding } from "./pages/Onboarding";
import { Overview } from "./pages/Overview";
import { Projects } from "./pages/Projects";
import { SalesPipeline } from "./pages/SalesPipeline";
import { Tasks } from "./pages/Tasks";
import { Triggers } from "./pages/Triggers";

const routeByHash: Record<string, RouteKey> = {
  "/": "overview",
  "/intake": "intake",
  "/sales": "sales",
  "/onboarding": "onboarding",
  "/projects": "projects",
  "/tasks": "tasks",
  "/admin": "admin",
  "/communications": "communications",
  "/approvals": "approvals",
  "/triggers": "triggers",
  "/automation": "automation",
  "/calendar": "calendar",
};

const pathByRoute = Object.fromEntries(
  Object.entries(routeByHash).map(([path, route]) => [route, path]),
) as Record<RouteKey, string>;

function readRouteFromHash(): RouteKey {
  const path = window.location.hash.replace(/^#/, "") || "/";
  return routeByHash[path] || "overview";
}

export default function App() {
  const [route, setRoute] = useState<RouteKey>(() => readRouteFromHash());
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchCommandCenter());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Command center unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!window.location.hash) window.location.hash = "#/";
    const onHashChange = () => setRoute(readRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const navigate = (nextRoute: RouteKey) => {
    window.location.hash = pathByRoute[nextRoute];
    setRoute(nextRoute);
  };

  return (
    <>
      <Layout activeRoute={route} onNavigate={navigate}>
        {isLoading && <LoadingState />}
        {!isLoading && error && <ErrorState error={error} onRetry={loadData} />}
        {!isLoading && !error && data && renderRoute(route, data, loadData)}
      </Layout>
      <Analytics />
    </>
  );
}

function renderRoute(route: RouteKey, data: CommandCenterData, reload: () => void) {
  switch (route) {
    case "intake":
      return <Intake data={data} onSubmitted={reload} />;
    case "sales":
      return <SalesPipeline data={data} />;
    case "onboarding":
      return <Onboarding data={data} />;
    case "projects":
      return <Projects data={data} />;
    case "tasks":
      return <Tasks data={data} />;
    case "admin":
      return <Admin data={data} />;
    case "communications":
      return <Communications data={data} />;
    case "approvals":
      return <Approvals data={data} />;
    case "triggers":
      return <Triggers data={data} />;
    case "automation":
      return <AutomationLogs data={data} />;
    case "calendar":
      return <Calendar data={data} />;
    case "overview":
    default:
      return <Overview data={data} />;
  }
}

function LoadingState() {
  return (
    <div className="page" data-testid="state-loading">
      <div className="skeleton skeleton--title" />
      <div className="metric-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="skeleton skeleton--card" key={index} />
        ))}
      </div>
      <div className="skeleton skeleton--table" />
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="page" data-testid="state-error">
      <HealthCheck />
      <Card>
        <CardHeader>
          <CardTitle>Command center unavailable</CardTitle>
          <CardDescription>Check the frontend server or backend API configuration.</CardDescription>
        </CardHeader>
        <CardContent className="error-card">
          <p>{error}</p>
          <button className="button button--primary" onClick={onRetry} type="button">Retry</button>
        </CardContent>
      </Card>
    </div>
  );
}
