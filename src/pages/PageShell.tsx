import { ExternalLink, Filter } from "lucide-react";
import type { CommandCenterData, RouteKey } from "../lib/types";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { HealthCheck } from "../components/HealthCheck";
import { LinkButton } from "../components/ui";

export const pageMeta: Record<RouteKey, { title: string; description: string }> = {
  overview: { title: "Command Center", description: "Cross-entity operating view for BECS, Lane Ellis, Me & Them, and 4FREQ." },
  intake: { title: "Intake Router", description: "Events entering the classifier, context layer, and trigger engine." },
  sales: { title: "Sales Pipeline", description: "Leads, opportunities, follow-ups, proposals, and revenue conversations." },
  onboarding: { title: "Onboarding", description: "Client, vendor, reader, student, partner, and community setup." },
  projects: { title: "Projects", description: "Entity-specific workstreams, deliverables, dependencies, and blockers." },
  tasks: { title: "Tasks", description: "Operational task layer across workflows and shared services." },
  admin: { title: "Operations Admin", description: "Contracts, files, invoices, records, approvals, and housekeeping." },
  communications: { title: "Communications", description: "Drafts, tone inheritance, approvals, follow-ups, and sent status." },
  approvals: { title: "Approvals", description: "Sensitive actions held for review before external execution." },
  triggers: { title: "Triggers", description: "Human-readable registry of the coded automation rules." },
  automation: { title: "Automation Logs", description: "Audit trail of trigger matches, outcomes, failures, and approvals." },
  calendar: { title: "Calendar", description: "Deadline, review, reminder, and scheduling control layer." },
};

export function PageShell({
  route,
  data,
  children,
}: {
  route: RouteKey;
  data: CommandCenterData;
  children: React.ReactNode;
}) {
  const meta = pageMeta[route];

  return (
    <div className="page" data-testid={`page-${route}`}>
      <div className="page__header">
        <div>
          <p className="eyebrow">BECS OS v0</p>
          <h1 data-testid="text-page-title">{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        {route === "overview" ? (
          <LinkButton href="https://github.com/beconsultingsolutions-cloud/becs-os-backend" rel="noopener noreferrer" target="_blank">
            Backend repo
            <ExternalLink className="button__icon" aria-hidden="true" />
          </LinkButton>
        ) : (
          <button className="button button--outline" type="button">
            <Filter className="button__icon" aria-hidden="true" />
            Filter
          </button>
        )}
      </div>
      <ConnectionBanner connection={data.connection} />
      <HealthCheck />
      {children}
    </div>
  );
}
