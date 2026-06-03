import type { ScheduleEvent } from "@/lib/schedule";

export default function ScheduleTab({
  events,
  semester,
}: {
  events: ScheduleEvent[];
  semester: string;
}) {
  return (
    <div>
      <div className="portal-schedule-title">2026 GTRE Analyst Program</div>
      <div className="portal-schedule-sub">
        {semester} · All sessions at Caddell unless noted
      </div>

      {events.length === 0 ? (
        <p className="portal-empty">
          No sessions defined. Add entries to{" "}
          <code>lib/schedule.ts</code> and redeploy.
        </p>
      ) : (
        <div className="portal-schedule-wrap">
          <div className="portal-schedule-hdr">
            <div>Date</div>
            <div>Topic</div>
            <div>Location</div>
          </div>
          {events.map((event) => {
            const isCase = event.eventType === "case-study";
            return (
              <div
                key={event.id}
                className={`portal-schedule-row${isCase ? " case" : ""}`}
              >
                <div className="col-date">{event.eventDate}</div>
                <div className="col-topic">{event.title}</div>
                <div className="col-loc">{event.location}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
