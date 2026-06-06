export default function AdminOverviewTab({
  stats,
}: {
  stats: {
    assignmentSubmissions: number;
    quizSubmissions: number;
    checkins: number;
    openQuestions: number;
    assignmentCount: number;
    resourceCount: number;
  };
}) {
  return (
    <div>
      <p className="admin-lead">
        Manage analyst program content, review submissions, and respond to forum
        questions. Changes to assignments and resources appear on the member portal
        immediately.
      </p>
      <div className="portal-stat-grid">
        <div className="portal-stat-card gold">
          <div className="portal-stat-val">{stats.assignmentSubmissions}</div>
          <div className="portal-stat-lbl">Assignment submissions</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{stats.quizSubmissions}</div>
          <div className="portal-stat-lbl">Quiz submissions</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{stats.checkins}</div>
          <div className="portal-stat-lbl">Check-ins</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{stats.openQuestions}</div>
          <div className="portal-stat-lbl">Open forum questions</div>
        </div>
      </div>
      <div className="admin-note">
        <strong>Wix CMS collections needed for full admin features:</strong>{" "}
        <code>AssignmentOverrides</code> and <code>PortalResources</code> (see
        setup note at bottom of Resources tab). Forum and submissions use existing
        collections.
      </div>
    </div>
  );
}
