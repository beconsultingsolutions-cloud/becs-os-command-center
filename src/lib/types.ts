export type Trend = "up" | "down" | "flat";

export type Metric = {
  label: string;
  value: string;
  detail: string;
  trend: Trend;
};

export type EntityHealth = {
  entity: string;
  tone: string;
  openTasks: number;
  sales: number;
  onboarding: number;
  risks: number;
};

export type PipelineItem = {
  id: string;
  name: string;
  entity: string;
  stage: string;
  nextAction: string;
  due: string;
};

export type WorkItem = {
  id: string;
  title: string;
  entity: string;
  workflow: string;
  status: string;
  priority: string;
  due: string;
};

export type TriggerItem = {
  id: string;
  trigger: string;
  summary: string;
  status: string;
  action: string;
  entity: string;
};

export type IntakeEvent = {
  id: string;
  title?: string;
  request_summary?: string;
  status: string;
  workflow?: string;
  entity?: string;
  suggested_entity?: string;
  classification?: {
    workflow_category?: string;
    suggested_entity_slug?: string;
    entity?: string;
    required_action?: string;
    next_action?: string;
    confidence?: number | string | null;
  } | null;
};

export type ConnectionInfo = {
  mode: string;
  supabaseUrl?: string;
  backendUrl?: string;
};

export type CommandCenterData = {
  connection: ConnectionInfo;
  metrics: Metric[];
  entities: EntityHealth[];
  pipeline: PipelineItem[];
  onboarding: WorkItem[];
  projects: WorkItem[];
  tasks: WorkItem[];
  adminRecords: WorkItem[];
  communications: WorkItem[];
  approvals: WorkItem[];
  triggers: TriggerItem[];
  automationRuns: TriggerItem[];
  intakeEvents: IntakeEvent[];
};

export type IntakePayload = {
  request_summary: string;
  detailed_notes: string;
  suggested_entity: "BECS" | "Lane Ellis" | "Me & Them" | "4FREQ" | "Unsure";
  due_date: string;
  response_needed: boolean;
  calendar_needed: boolean;
  related_file_url: string;
};

export type IntakeResponse = {
  message?: string;
  event?: {
    id?: string;
    event_id?: string;
    status?: string;
    workflow?: string;
    created_at?: string;
  };
  id?: string;
  event_id?: string;
  status?: string;
  workflow?: string;
  classification?: IntakeEvent["classification"];
  reason?: string;
  notes?: string;
};

export type RouteKey =
  | "overview"
  | "intake"
  | "sales"
  | "onboarding"
  | "projects"
  | "tasks"
  | "admin"
  | "communications"
  | "approvals"
  | "triggers"
  | "automation"
  | "calendar";
