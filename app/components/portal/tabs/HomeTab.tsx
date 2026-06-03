import type { DashboardSummary } from "@/lib/dashboard";
import type { MemberActivity } from "@/lib/memberActivity";
import { PROGRAM_SEMESTER } from "@/lib/programConfig";
import HomeClient from "./HomeClient";

export default function HomeTab({
  email,
  dashboard,
  activity,
}: {
  email: string | null;
  dashboard: DashboardSummary;
  activity: MemberActivity;
}) {
  const name = email?.split("@")[0] ?? "member";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div className="portal-greeting">
        {greeting}, {name}
      </div>
      <div className="portal-greeting-sub">
        GTRE Analyst Program · {PROGRAM_SEMESTER}
      </div>
      <div className="portal-stat-grid">
        <div className="portal-stat-card gold">
          <div className="portal-stat-val">{dashboard.avgQuizLabel}</div>
          <div className="portal-stat-lbl">Avg quiz score</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{dashboard.checkinCount}</div>
          <div className="portal-stat-lbl">Check-ins</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{dashboard.assignmentsDoneCount}</div>
          <div className="portal-stat-lbl">Assignments done</div>
        </div>
        <div className="portal-stat-card">
          <div className="portal-stat-val">{dashboard.dueSoonCount}</div>
          <div className="portal-stat-lbl">Due soon</div>
        </div>
      </div>
      <div className="portal-section-label">Upcoming</div>
      <div className="portal-upcoming-list">
        {dashboard.upcoming.length === 0 ? (
          <div className="portal-empty">Nothing due right now.</div>
        ) : (
          dashboard.upcoming.map((item, i) => (
            <div key={i} className="portal-upcoming-item">
              <div className={`portal-u-dot ${item.dot}`} />
              <div className="portal-u-info">
                <div className="portal-u-title">{item.title}</div>
                <div className="portal-u-meta">{item.meta}</div>
              </div>
              <div className={`portal-u-tag ${item.tagClass}`}>{item.tag}</div>
            </div>
          ))
        )}
      </div>
      <div className="portal-section-label" style={{ marginTop: 20 }}>
        Module progress
      </div>
      <HomeClient modules={dashboard.modules} activity={activity} />
    </div>
  );
}
