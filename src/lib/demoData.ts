import type { CommandCenterData } from "./types";

export const demoData: CommandCenterData = {
  connection: {
    mode: "demo",
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "Add VITE_SUPABASE_URL",
    backendUrl: import.meta.env.VITE_BECS_API_URL || "Add VITE_BECS_API_URL",
  },
  metrics: [
    { label: "Open tasks", value: "24", detail: "Across operating workflows", trend: "flat" },
    { label: "Pipeline value", value: "$148K", detail: "Active revenue conversations", trend: "up" },
    { label: "Approvals", value: "5", detail: "Sensitive actions waiting", trend: "down" },
    { label: "Triggers", value: "18", detail: "Rules available to route events", trend: "up" },
    { label: "Automation runs", value: "62", detail: "Recent classified events", trend: "up" },
    { label: "Risks", value: "3", detail: "Blocked or urgent records", trend: "down" },
  ],
  entities: [
    { entity: "BE Consulting Solutions", tone: "Strategic operations", openTasks: 9, sales: 4, onboarding: 2, risks: 1 },
    { entity: "Lane Ellis Apparel Agency", tone: "Polished apparel sales", openTasks: 6, sales: 5, onboarding: 1, risks: 0 },
    { entity: "Me & Them", tone: "Editorial and relational", openTasks: 5, sales: 1, onboarding: 2, risks: 1 },
    { entity: "4FREQ", tone: "Rhythm, learning, community", openTasks: 4, sales: 2, onboarding: 3, risks: 1 },
  ],
  pipeline: [
    { id: "p-1", name: "Managed OS retainer", entity: "BECS", stage: "Proposal", nextAction: "Send phased scope", due: "This week" },
    { id: "p-2", name: "Resort apparel showroom", entity: "Lane Ellis", stage: "Follow-up", nextAction: "Confirm line sheet", due: "Tomorrow" },
    { id: "p-3", name: "Community launch sponsor", entity: "4FREQ", stage: "Discovery", nextAction: "Book intro call", due: "Next Monday" },
  ],
  onboarding: [
    { id: "o-1", title: "Client workspace setup", entity: "BECS", workflow: "Client setup", status: "In progress", priority: "high", due: "Friday" },
    { id: "o-2", title: "Vendor profile packet", entity: "Lane Ellis", workflow: "Partner setup", status: "Pending", priority: "medium", due: "Next week" },
  ],
  projects: [
    { id: "pr-1", title: "Command center rebuild", entity: "BECS", workflow: "Systems", status: "In progress", priority: "high", due: "Today" },
    { id: "pr-2", title: "Launch content calendar", entity: "Me & Them", workflow: "Editorial", status: "Review", priority: "medium", due: "Wednesday" },
  ],
  tasks: [
    { id: "t-1", title: "Review backend env setup", entity: "BECS", workflow: "Infrastructure", status: "Blocked", priority: "high", due: "Today" },
    { id: "t-2", title: "Draft buyer follow-up", entity: "Lane Ellis", workflow: "Sales", status: "Ready", priority: "medium", due: "Tomorrow" },
    { id: "t-3", title: "Queue reminder sequence", entity: "4FREQ", workflow: "Community", status: "Pending", priority: "low", due: "Friday" },
  ],
  adminRecords: [
    { id: "a-1", title: "Supabase table audit", entity: "BECS", workflow: "Records", status: "Review", priority: "medium", due: "Next week" },
  ],
  communications: [
    { id: "c-1", title: "Retainer renewal email", entity: "BECS", workflow: "External draft", status: "Approval", priority: "high", due: "Today" },
    { id: "c-2", title: "Buyer recap", entity: "Lane Ellis", workflow: "Follow-up", status: "Draft", priority: "medium", due: "Tomorrow" },
  ],
  approvals: [
    { id: "ap-1", title: "External proposal send", entity: "BECS", workflow: "Sales", status: "Pending approval", priority: "high", due: "Today" },
    { id: "ap-2", title: "Public post copy", entity: "Me & Them", workflow: "Comms", status: "Review", priority: "medium", due: "Thursday" },
  ],
  triggers: [
    { id: "tr-1", trigger: "High-value sales lead", summary: "Creates pipeline record and approval checkpoint.", status: "Enabled", action: "Create opportunity", entity: "BECS" },
    { id: "tr-2", trigger: "Calendar requested", summary: "Marks task for schedule review.", status: "Enabled", action: "Queue calendar control", entity: "All entities" },
  ],
  automationRuns: [
    { id: "ar-1", trigger: "Intake classified as sales", summary: "Pipeline card created from structured request.", status: "Success", action: "Created pipeline record", entity: "Lane Ellis" },
    { id: "ar-2", trigger: "Approval gate", summary: "External action held until reviewed.", status: "Pending review", action: "Hold send", entity: "BECS" },
  ],
  intakeEvents: [
    {
      id: "ie-1",
      request_summary: "Renew BECS retainer with Acme by Friday",
      status: "Classified",
      classification: {
        workflow_category: "sales",
        suggested_entity_slug: "BECS",
        required_action: "Create pipeline follow-up",
        confidence: 0.91,
      },
    },
  ],
};
