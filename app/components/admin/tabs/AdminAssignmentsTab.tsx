"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminSaveAssignmentAction } from "@/app/actions/admin";
import type { AssignmentOverride } from "@/lib/adminContent";
import type { ProgramWeek } from "@/lib/programConfig";

export default function AdminAssignmentsTab({
  weeks,
  overrides,
}: {
  weeks: ProgramWeek[];
  overrides: AssignmentOverride[];
}) {
  const router = useRouter();
  const overrideByAssignment = new Map(
    overrides.map((o) => [o.assignmentId, o]),
  );

  return (
    <div>
      <p className="admin-lead">
        Edit assignment title, description, and due date. Overrides are stored in
        Wix and merged with the base program config on the member portal.
      </p>
      {weeks.flatMap((week) =>
        week.assignments.map((assignment) => (
          <AssignmentEditor
            key={assignment.id}
            weekLabel={week.date}
            assignment={assignment}
            override={overrideByAssignment.get(assignment.id)}
            onSaved={() => router.refresh()}
          />
        )),
      )}
      {weeks.every((w) => w.assignments.length === 0) && (
        <p className="portal-empty">No assignments in program config.</p>
      )}
    </div>
  );
}

function AssignmentEditor({
  weekLabel,
  assignment,
  override,
  onSaved,
}: {
  weekLabel: string;
  assignment: { id: string; title: string; description: string; due: string };
  override?: AssignmentOverride;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(override?.title || assignment.title);
  const [description, setDescription] = useState(
    override?.description || assignment.description,
  );
  const [due, setDue] = useState(override?.due || assignment.due);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="admin-card"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("");
        startTransition(async () => {
          const result = await adminSaveAssignmentAction({
            assignmentId: assignment.id,
            title,
            description,
            due,
            existingId: override?.id,
          });
          if (result.ok) {
            setMessage("Saved");
            onSaved();
          } else {
            setMessage(result.error);
          }
        });
      }}
    >
      <div className="admin-card-hdr">
        <strong>{assignment.id}</strong>
        <span className="admin-muted">Week {weekLabel}</span>
      </div>
      <label className="portal-form-label">Title</label>
      <input
        className="portal-form-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="portal-form-label">Description</label>
      <textarea
        className="portal-form-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <label className="portal-form-label">Due date (YYYY-MM-DD)</label>
      <input
        className="portal-form-input"
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        required
      />
      <div className="portal-assign-actions">
        <button type="submit" className="portal-btn-primary" disabled={pending}>
          Save override
        </button>
        {message && (
          <span className={message === "Saved" ? "admin-success" : "portal-form-error"}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
