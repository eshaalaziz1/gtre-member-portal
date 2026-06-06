import type {
  AdminAssignmentSubmission,
  AdminCheckinSubmission,
  AdminQuizSubmission,
} from "@/lib/adminSubmissions";

function formatWhen(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function AdminSubmissionsTab({
  assignments,
  quizzes,
  checkins,
}: {
  assignments: AdminAssignmentSubmission[];
  quizzes: AdminQuizSubmission[];
  checkins: AdminCheckinSubmission[];
}) {
  return (
    <div>
      <div className="portal-section-label">Assignment submissions ({assignments.length})</div>
      {assignments.length === 0 ? (
        <p className="portal-empty">No assignment submissions yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Assignment</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((s) => (
                <tr key={s.id}>
                  <td>{s.gtEmail}</td>
                  <td>
                    <strong>{s.assignmentTitle || s.assignmentId}</strong>
                    {s.writtenResponse && (
                      <div className="admin-cell-sub">{s.writtenResponse.slice(0, 120)}…</div>
                    )}
                    {s.fileUrl && (
                      <div className="admin-cell-sub">
                        <a href={s.fileUrl} target="_blank" rel="noopener noreferrer">
                          File link
                        </a>
                      </div>
                    )}
                  </td>
                  <td>{s.submissionType || "—"}</td>
                  <td>{s.status}</td>
                  <td>{formatWhen(s.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="portal-section-label" style={{ marginTop: 24 }}>
        Quiz submissions ({quizzes.length})
      </div>
      {quizzes.length === 0 ? (
        <p className="portal-empty">No quiz submissions yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Module</th>
                <th>Score</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((s) => (
                <tr key={s.id}>
                  <td>{s.gtEmail}</td>
                  <td>{s.moduleId.slice(0, 8)}…</td>
                  <td>
                    {s.percentageScore}%
                    {s.score !== null && s.totalQuestions
                      ? ` (${s.score}/${s.totalQuestions})`
                      : ""}
                  </td>
                  <td>{formatWhen(s.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="portal-section-label" style={{ marginTop: 24 }}>
        Check-ins ({checkins.length})
      </div>
      {checkins.length === 0 ? (
        <p className="portal-empty">No check-ins yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Week</th>
                <th>Event</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((s) => (
                <tr key={s.id}>
                  <td>{s.gtEmail}</td>
                  <td>{s.weekId}</td>
                  <td>{s.eventName}</td>
                  <td>{formatWhen(s.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
