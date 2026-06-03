"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitCheckinAction } from "@/app/actions/checkin";
import { formatDisplayDate } from "@/lib/programConfig";
import type { ProgramWeek } from "@/lib/programConfig";

export default function CheckInTab({
  week,
  alreadyCheckedIn,
}: {
  week: ProgramWeek;
  alreadyCheckedIn: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(alreadyCheckedIn);
  const [successMsg, setSuccessMsg] = useState(
    alreadyCheckedIn
      ? "Already checked in for this session."
      : "",
  );
  const [pending, startTransition] = useTransition();

  function handleCheckin() {
    setError("");
    startTransition(async () => {
      const result = await submitCheckinAction(code);
      if (result.ok) {
        setSuccess(true);
        setSuccessMsg(`Checked in for ${result.eventName}`);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="portal-checkin-card">
      <div className="portal-checkin-event-name">{week.event.name}</div>
      <div className="portal-checkin-event-meta">
        {formatDisplayDate(week.event.date)} · {week.event.time} ·{" "}
        {week.event.location}
      </div>
      {!success ? (
        <>
          <div className="portal-checkin-label">Enter session code</div>
          <input
            type="text"
            className={`portal-code-input${error ? " err" : ""}`}
            maxLength={6}
            placeholder="- - - - - -"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleCheckin()}
          />
          <div className="portal-checkin-error">{error}</div>
          <button
            type="button"
            className="portal-btn-primary portal-checkin-btn"
            onClick={handleCheckin}
            disabled={pending}
          >
            {pending ? "Checking in…" : "Check In"}
          </button>
        </>
      ) : (
        <div className="portal-checked-success">
          <div className="portal-check-icon">✓</div>
          <div className="portal-checked-text">{successMsg}</div>
        </div>
      )}
    </div>
  );
}
