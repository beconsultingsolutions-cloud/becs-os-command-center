import { demoData } from "./demoData";
import type {
  CommandCenterData,
  EntityHealth,
  EntitySlug,
  IntakePayload,
  IntakeResponse,
  Metric,
  PipelineItem,
  TrainingLesson,
} from "./types";

const API_URL = import.meta.env.VITE_BECS_API_URL?.replace(/\/$/, "") || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
let lastDashboardFetchStatus = "Not started";
const BACKEND_UNREACHABLE_HINT =
  "Backend unreachable. Confirm VITE_BECS_API_URL points to the Render backend, the service is awake, and CORS allows this frontend domain.";

function authHeaders(hasBody = false): HeadersInit {
  const headers: Record<string, string> = {};

  if (hasBody) headers["Content-Type"] = "application/json";
  if (SUPABASE_ANON_KEY) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
    headers.apikey = SUPABASE_ANON_KEY;
  }

  return headers;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function parseRequiredJson<T extends object>(response: Response, endpoint: string): Promise<T> {
  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  const text = await response.text();
  if (!text.trim()) {
    throw new Error(
      `Empty response from ${API_URL}${endpoint}. Confirm VITE_BECS_API_URL points to the Render API service, not the frontend deployment.`,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return { message: text } as T;
  }
}

function apiErrorMessage(endpoint: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  return `${BACKEND_UNREACHABLE_HINT} Endpoint: ${API_URL}${endpoint}. Detail: ${detail}`;
}

type ApiEntityMetric = {
  entity_id?: string;
  slug?: string;
  name?: string;
  contacts?: number;
  leads?: number;
  leads_by_stage?: Record<string, number>;
  projects?: number;
  tasks?: number;
  revenue?: number;
};

type ApiCommandCenter = {
  total_entities?: number;
  total_contacts?: number;
  total_leads?: number;
  leads_by_stage?: Record<string, number>;
  total_projects?: number;
  total_tasks?: number;
  total_revenue?: number;
  total_events?: number;
  metrics_by_entity?: ApiEntityMetric[];
  entity?: {
    slug?: string;
    name?: string;
  } | null;
};

type ApiTrainingResponse = {
  items?: TrainingLesson[];
};

const entityLabels: Record<string, string> = {
  becs: "BE Consulting Solutions",
  leaa: "Lane Ellis Apparel Agency",
  "me-and-them": "Me & Them",
  fourfreq: "4FREQ",
};

const entityTone: Record<string, string> = {
  becs: "Strategic operations",
  leaa: "Apparel development",
  "me-and-them": "Creative and editorial",
  fourfreq: "Training and reflection",
};

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function metric(label: string, value: string | number, detail: string): Metric {
  return { label, value: String(value), detail, trend: "flat" };
}

function metricsFromApi(data: ApiCommandCenter): Metric[] {
  return [
    metric("Entities", data.total_entities ?? (data.entity ? 1 : 0), "Active brands in the operating system"),
    metric("Contacts", data.total_contacts ?? 0, "Universal people database"),
    metric("Leads", data.total_leads ?? 0, "Open pipeline records across stages"),
    metric("Projects", data.total_projects ?? 0, "Active work delivery records"),
    metric("Tasks", data.total_tasks ?? 0, "Action layer items"),
    metric("Revenue", formatCurrency(data.total_revenue ?? 0), "Recorded revenue across entities"),
  ];
}

function entitiesFromApi(data: ApiCommandCenter): EntityHealth[] {
  const rows = data.metrics_by_entity?.length
    ? data.metrics_by_entity
    : data.entity
      ? [
          {
            slug: data.entity.slug,
            name: data.entity.name,
            leads: data.total_leads,
            leads_by_stage: data.leads_by_stage,
            projects: data.total_projects,
            tasks: data.total_tasks,
            revenue: data.total_revenue,
          },
        ]
      : [];

  return rows.map((entity) => {
    const slug = entity.slug || "unknown";
    return {
      entity: entity.name || entityLabels[slug] || slug,
      tone: entityTone[slug] || "Entity operating metrics",
      openTasks: entity.tasks ?? 0,
      sales: entity.leads ?? 0,
      onboarding: entity.projects ?? 0,
      risks: 0,
    };
  });
}

function pipelineFromStages(stages: Record<string, number> | undefined, entitySlug: EntitySlug): PipelineItem[] {
  return Object.entries(stages || {}).map(([stage, count]) => ({
    id: `stage-${entitySlug}-${stage}`,
    name: `${count} lead${count === 1 ? "" : "s"}`,
    entity: entitySlug === "all" ? "All entities" : entityLabels[entitySlug] || entitySlug,
    stage,
    nextAction: "Review pipeline stage",
    due: "Open",
  }));
}

function adaptCommandCenter(data: ApiCommandCenter, entitySlug: EntitySlug, trainingLessons: TrainingLesson[]): CommandCenterData {
  return {
    connection: {
      mode: "live",
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
      backendUrl: API_URL,
      selectedEntity: entitySlug,
    },
    metrics: metricsFromApi(data),
    entities: entitiesFromApi(data),
    pipeline: pipelineFromStages(data.leads_by_stage, entitySlug),
    onboarding: [],
    projects: [],
    tasks: [],
    adminRecords: [],
    communications: [],
    approvals: [],
    triggers: [],
    automationRuns: [],
    intakeEvents: [],
    trainingLessons,
  };
}

async function fetchTrainingLessons(entitySlug: EntitySlug): Promise<TrainingLesson[]> {
  if (!API_URL) return demoData.trainingLessons || [];
  const endpoint = entitySlug === "all" ? "/api/training" : `/api/training?entity=${encodeURIComponent(entitySlug)}`;
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: authHeaders(),
  });
  const data = await parseRequiredJson<ApiTrainingResponse>(response, endpoint);
  return data.items || [];
}

export async function fetchCommandCenter(entitySlug: EntitySlug = "all"): Promise<CommandCenterData> {
  if (!API_URL) {
    lastDashboardFetchStatus = "Demo data loaded";
    return {
      ...demoData,
      connection: {
        ...demoData.connection,
        selectedEntity: entitySlug,
      },
    };
  }

  lastDashboardFetchStatus = "Live fetch in progress";
  const endpoint =
    entitySlug === "all" ? "/api/command-center" : `/api/command-center/${encodeURIComponent(entitySlug)}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: authHeaders(),
    });
    const data = await parseJson<ApiCommandCenter>(response);
    const trainingLessons = await fetchTrainingLessons(entitySlug);
    lastDashboardFetchStatus = "Live fetch succeeded";
    return adaptCommandCenter(data, entitySlug, trainingLessons);
  } catch (error) {
    const message = apiErrorMessage(endpoint, error);
    lastDashboardFetchStatus = `Live fetch failed: ${message}`;
    throw new Error(message);
  }
}

export async function submitIntakeEvent(payload: IntakePayload): Promise<IntakeResponse> {
  if (!API_URL) {
    return {
      message: "Demo mode: configure VITE_BECS_API_URL to submit to the live BECS OS API.",
      event: {
        id: `demo-${Date.now()}`,
        status: "demo",
        workflow: "intake",
      },
      classification: {
        workflow_category: "intake",
        suggested_entity_slug: payload.suggested_entity,
        required_action: payload.response_needed ? "Review response needed" : "Review intake event",
        confidence: 0.72,
      },
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify({
        entity_slug: payload.suggested_entity === "unsure" ? undefined : payload.suggested_entity,
        event_type: "intake",
        source: "frontend",
        due_date: payload.due_date.trim() || undefined,
        response_needed: payload.response_needed,
        calendar_needed: payload.calendar_needed,
        related_file_url: payload.related_file_url.trim() || undefined,
        payload: {
          summary: payload.request_summary.trim(),
          notes: payload.detailed_notes.trim(),
          response_needed: payload.response_needed,
          calendar_needed: payload.calendar_needed,
          related_file_url: payload.related_file_url.trim(),
        },
      }),
    });

    return parseRequiredJson<IntakeResponse>(response, "/api/events");
  } catch (error) {
    throw new Error(apiErrorMessage("/api/events", error));
  }
}

export const apiConfig = {
  apiUrl: API_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  hasAnonKey: Boolean(SUPABASE_ANON_KEY),
};

export function getApiHealth() {
  return {
    apiMode: API_URL ? "Live" : "Demo",
    apiUrlConfigured: Boolean(API_URL),
    lastDashboardFetchStatus,
  };
}
