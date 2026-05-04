import { demoData } from "./demoData";
import type { CommandCenterData, IntakePayload, IntakeResponse } from "./types";

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

export async function fetchCommandCenter(): Promise<CommandCenterData> {
  if (!API_URL) {
    lastDashboardFetchStatus = "Demo data loaded";
    return demoData;
  }

  lastDashboardFetchStatus = "Live fetch in progress";

  try {
    const response = await fetch(`${API_URL}/api/command-center`, {
      headers: authHeaders(),
    });
    const data = await parseJson<CommandCenterData>(response);
    lastDashboardFetchStatus = "Live fetch succeeded";
    return data;
  } catch (error) {
    const message = apiErrorMessage("/api/command-center", error);
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
        source: "frontend",
        request_summary: payload.request_summary.trim(),
        detailed_notes: payload.detailed_notes.trim(),
        suggested_entity: payload.suggested_entity,
        due_date: payload.due_date.trim(),
        response_needed: payload.response_needed,
        calendar_needed: payload.calendar_needed,
        related_file_url: payload.related_file_url.trim(),
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
