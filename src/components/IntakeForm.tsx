import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { submitIntakeEvent } from "../lib/api";
import type { IntakePayload, IntakeResponse } from "../lib/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorNotice, SuccessNotice } from "./ui";
import { formatConfidence } from "./DataTables";

const defaultPayload: IntakePayload = {
  request_summary: "",
  detailed_notes: "",
  suggested_entity: "unsure",
  due_date: "",
  response_needed: false,
  calendar_needed: false,
  related_file_url: "",
};

const entityOptions: { label: string; value: IntakePayload["suggested_entity"] }[] = [
  { label: "BECS", value: "becs" },
  { label: "LEAA", value: "leaa" },
  { label: "Me & Them", value: "me-and-them" },
  { label: "4FREQ", value: "fourfreq" },
  { label: "Unsure", value: "unsure" },
];

export function IntakeForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [payload, setPayload] = useState<IntakePayload>(defaultPayload);
  const [result, setResult] = useState<IntakeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (payload.request_summary.trim().length < 3) {
      setError("Provide a short summary before submitting the intake event.");
      return;
    }

    if (payload.related_file_url.trim() && !/^https?:\/\//i.test(payload.related_file_url.trim())) {
      setError("Use a full related file URL starting with http(s)://.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitIntakeEvent(payload);
      setResult(response);
      setPayload(defaultPayload);
      onSubmitted();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card data-testid="card-intake-form">
      <CardHeader>
        <CardTitle>Submit intake event</CardTitle>
        <CardDescription>Sends a structured event to the BECS OS classifier. Events flow into the trigger engine for routing.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="intake-form" noValidate onSubmit={handleSubmit}>
          <label>
            <span>Summary</span>
            <input
              data-testid="input-intake-summary"
              onChange={(event) => setPayload((value) => ({ ...value, request_summary: event.target.value }))}
              placeholder="e.g. Renew BECS retainer with Acme by Friday"
              value={payload.request_summary}
            />
            <small>One-line description of the request.</small>
          </label>
          <label>
            <span>Details</span>
            <textarea
              data-testid="input-intake-details"
              onChange={(event) => setPayload((value) => ({ ...value, detailed_notes: event.target.value }))}
              placeholder="Add context, links, decisions, or follow-ups."
              rows={5}
              value={payload.detailed_notes}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Suggested entity</span>
              <select
                data-testid="select-intake-entity"
                onChange={(event) => setPayload((value) => ({ ...value, suggested_entity: event.target.value as IntakePayload["suggested_entity"] }))}
                value={payload.suggested_entity}
              >
                {entityOptions.map((entity) => (
                  <option key={entity.value} value={entity.value}>{entity.label}</option>
                ))}
              </select>
              <small>Pick Unsure to let the classifier route it.</small>
            </label>
            <label>
              <span>Due date</span>
              <input
                data-testid="input-intake-due-date"
                onChange={(event) => setPayload((value) => ({ ...value, due_date: event.target.value }))}
                type="date"
                value={payload.due_date}
              />
              <small>Optional. Leave blank if there is no firm deadline.</small>
            </label>
          </div>
          <label>
            <span>Related file URL</span>
            <input
              data-testid="input-intake-file-url"
              inputMode="url"
              onChange={(event) => setPayload((value) => ({ ...value, related_file_url: event.target.value }))}
              placeholder="https://drive.google.com/..."
              value={payload.related_file_url}
            />
          </label>
          <div className="check-panel">
            <label className="checkbox-row">
              <input
                checked={payload.response_needed}
                data-testid="checkbox-intake-response"
                onChange={(event) => setPayload((value) => ({ ...value, response_needed: event.target.checked }))}
                type="checkbox"
              />
              <span>Response needed</span>
              <small>Mark when an external reply is required.</small>
            </label>
            <label className="checkbox-row">
              <input
                checked={payload.calendar_needed}
                data-testid="checkbox-intake-calendar"
                onChange={(event) => setPayload((value) => ({ ...value, calendar_needed: event.target.checked }))}
                type="checkbox"
              />
              <span>Calendar needed</span>
              <small>Adds the item to the calendar control layer.</small>
            </label>
          </div>
          {error && (
            <ErrorNotice>
              <strong>Submission failed</strong>
              <p>{error}</p>
              <small>Confirm the BECS API base URL is reachable and authorization keys are configured.</small>
            </ErrorNotice>
          )}
          {result && <IntakeSuccess result={result} />}
          <div className="form-actions">
            <Button disabled={isSubmitting} onClick={() => { setPayload(defaultPayload); setResult(null); setError(null); }} type="button" variant="ghost">
              Reset
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Loader2 className="button__icon spin" aria-hidden="true" /> : <Send className="button__icon" aria-hidden="true" />}
              Submit event
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function IntakeSuccess({ result }: { result: IntakeResponse }) {
  const event = result.event ?? {
    id: result.id,
    event_id: result.event_id,
    status: result.status,
    workflow: result.workflow,
  };
  const rows = [
    ["Event ID", event.id || event.event_id],
    ["Status", event.status],
    ["Workflow", result.classification?.workflow_category || event.workflow],
    ["Suggested entity", result.classification?.suggested_entity_slug || result.classification?.entity],
    ["Required action", result.classification?.required_action || result.classification?.next_action],
    ["Confidence", formatConfidence(result.classification?.confidence)],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <SuccessNotice>
      <strong>Event submitted to BECS OS</strong>
      {result.message && <p>{result.message}</p>}
      {rows.length > 0 && (
        <dl className="success-grid">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {(result.reason || result.notes) && <p>{result.reason || result.notes}</p>}
    </SuccessNotice>
  );
}
