import type { GradeRow } from "@/lib/dashboard";
import { PROGRAM_SEMESTER } from "@/lib/programConfig";

export default function GradesTab({
  avgLabel,
  completionPct,
  doneCount,
  totalCount,
  rows,
}: {
  avgLabel: string;
  completionPct: number;
  doneCount: number;
  totalCount: number;
  rows: GradeRow[];
}) {
  return (
    <div>
      <div className="portal-avg-bar">
        <div className="portal-avg-circle">
          <div className="portal-avg-num">{avgLabel}</div>
          <div className="portal-avg-sub">AVG</div>
        </div>
        <div className="portal-avg-info">
          <div className="portal-avg-title">{PROGRAM_SEMESTER} performance</div>
          <div className="portal-progress-track">
            <div
              className="portal-progress-fill"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="portal-avg-note">
            {doneCount} of {totalCount} activities complete
          </div>
        </div>
      </div>
      <div className="portal-grades-table">
        <div className="portal-g-row hdr">
          <div>Assignment / Quiz</div>
          <div>Score</div>
          <div>Max</div>
          <div>Status</div>
        </div>
        {rows.map((row) => (
          <div key={row.name} className="portal-g-row">
            <div className="portal-g-name">{row.name}</div>
            <div className={`portal-g-score ${row.scoreClass}`}>{row.score}</div>
            <div className="portal-g-max">100%</div>
            <div>
              <span className={`portal-badge ${row.status}`}>{row.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
