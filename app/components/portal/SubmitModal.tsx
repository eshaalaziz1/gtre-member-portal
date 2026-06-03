"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitAssignmentAction } from "@/app/actions/assignment";
import type { ProgramAssignment } from "@/lib/programConfig";

export default function SubmitModal({
  assignment,
  onClose,
}: {
  assignment: ProgramAssignment;
  onClose: () => void;
}) {
  const router = useRouter();
  const [submissionType, setSubmissionType] = useState<"link" | "text">("link");
  const [response, setResponse] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitAssignmentAction({
        assignmentId: assignment.id,
        submissionType,
        response,
        comments,
      });
      if (result.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(onClose, 2000);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="portal-overlay active" onClick={onClose}>
      <div className="portal-submit-modal" onClick={(e) => e.stopPropagation()}>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <h3>Submit Assignment</h3>
            <div className="portal-modal-sub">{assignment.title}</div>
            <label className="portal-form-label">Submission type</label>
            <select
              className="portal-form-select"
              value={submissionType}
              onChange={(e) =>
                setSubmissionType(e.target.value as "link" | "text")
              }
            >
              <option value="link">Link (Google Docs, Drive, etc.)</option>
              <option value="text">Written response</option>
            </select>
            {submissionType === "link" ? (
              <>
                <label className="portal-form-label">Link URL</label>
                <input
                  className="portal-form-input"
                  type="url"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="https://docs.google.com/..."
                />
              </>
            ) : (
              <>
                <label className="portal-form-label">Your response</label>
                <textarea
                  className="portal-form-textarea"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                />
              </>
            )}
            <label className="portal-form-label">Comments (optional)</label>
            <textarea
              className="portal-form-textarea"
              style={{ minHeight: 50 }}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any notes for the reviewer..."
            />
            {error && <div className="portal-form-error">{error}</div>}
            <div className="portal-modal-actions">
              <button type="button" className="portal-btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="portal-btn-primary" disabled={pending}>
                {pending ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <div className="portal-submit-success">
            <div className="portal-s-icon">✓</div>
            <h4>Submitted!</h4>
            <p>{assignment.title} submitted successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}
