import { GraduationCap } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState } from "../components/ui";
import type { CommandCenterData } from "../lib/types";
import { PageShell } from "./PageShell";

export function Training({ data }: { data: CommandCenterData }) {
  const lessons = [...(data.trainingLessons || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <PageShell route="training" data={data}>
      <Card data-testid="table-training-lessons">
        <CardHeader>
          <CardTitle>Training lessons</CardTitle>
          <CardDescription>Lightweight lesson index from the BECS OS backend.</CardDescription>
        </CardHeader>
        <CardContent className="table-wrap">
          {lessons.length === 0 ? (
            <EmptyState
              title="No training lessons yet"
              description="Seeded PES and 5C lessons will appear here after the Supabase seed runs."
            />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Lesson</th>
                  <th>Module</th>
                  <th>PES phase</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson.id || lesson.slug || lesson.title} data-testid={`row-training-${lesson.slug || index}`}>
                    <td>{lesson.order_index ?? index + 1}</td>
                    <td>
                      <span className="table-title">
                        <GraduationCap className="icon icon--muted" aria-hidden="true" />
                        {lesson.title}
                      </span>
                    </td>
                    <td>{lesson.module || "-"}</td>
                    <td>{lesson.pes_phase || "-"}</td>
                    <td><Badge value={lesson.status || "active"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
