import { Database, ExternalLink } from "lucide-react";
import type { ConnectionInfo } from "../lib/types";
import { Card, CardContent, LinkButton } from "./ui";

export function ConnectionBanner({ connection }: { connection: ConnectionInfo }) {
  return (
    <Card className="connection-banner" data-testid="banner-connection">
      <CardContent className="connection-banner__content">
        <div className="connection-banner__copy">
          <Database className="icon icon--primary" aria-hidden="true" />
          <div>
            <p>Connection mode: {connection.mode || "unknown"}</p>
            <span>
              Supabase: {connection.supabaseUrl || "not configured"}{" "}
              {connection.backendUrl ? `Backend: ${connection.backendUrl}` : "Backend API not configured"}
            </span>
          </div>
        </div>
        <LinkButton
          href="https://github.com/beconsultingsolutions-cloud/becs-os-backend/blob/main/docs/supabase-setup.md"
          rel="noopener noreferrer"
          target="_blank"
          variant="outline"
        >
          Supabase notes
          <ExternalLink className="button__icon" aria-hidden="true" />
        </LinkButton>
      </CardContent>
    </Card>
  );
}
