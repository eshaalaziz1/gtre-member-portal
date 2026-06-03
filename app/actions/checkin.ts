"use server";

import { cookies } from "next/headers";
import { findCurrentWeek } from "@/lib/programConfig";
import { getAuthenticatedClientWithEmail } from "@/lib/wixSession";

export async function submitCheckinAction(code: string) {
  const auth = await getAuthenticatedClientWithEmail(
    (await cookies()).get("session")?.value,
  );
  if (!auth?.email) {
    return { ok: false as const, error: "You must be logged in to check in." };
  }

  const trimmed = code.trim().toUpperCase();
  if (!trimmed || trimmed.length < 4) {
    return { ok: false as const, error: "Please enter the session code." };
  }

  const week = findCurrentWeek();

  try {
    await auth.client.items.insert("QuizSubmissions", {
      gtEmail: auth.email,
      memberId: auth.email,
      weekId: week.id,
      eventName: week.event.name,
      checkinCode: trimmed,
      submittedAt: new Date().toISOString(),
      moduleId: `week-${week.id}`,
    });
    return { ok: true as const, eventName: week.event.name };
  } catch (error) {
    console.error("[Checkin] Submit failed:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Check-in failed.",
    };
  }
}
