"use server";

import { cookies } from "next/headers";
import { getAssignmentById } from "@/lib/programConfig";
import { getAuthenticatedClientWithEmail } from "@/lib/wixSession";

export async function submitAssignmentAction(input: {
  assignmentId: string;
  submissionType: "link" | "text";
  response: string;
  comments: string;
}) {
  const auth = await getAuthenticatedClientWithEmail(
    (await cookies()).get("session")?.value,
  );
  if (!auth?.email) {
    return { ok: false as const, error: "You must be logged in to submit." };
  }

  const assignment = getAssignmentById(input.assignmentId);
  if (!assignment) {
    return { ok: false as const, error: "Unknown assignment." };
  }

  if (!input.response.trim()) {
    return {
      ok: false as const,
      error:
        input.submissionType === "link"
          ? "Please paste a link."
          : "Please enter your response.",
    };
  }

  try {
    await auth.client.items.insert("Assignments", {
      gtEmail: auth.email,
      memberId: auth.email,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      submissionType: input.submissionType,
      writtenResponse:
        input.submissionType === "text" ? input.response.trim() : "",
      fileUrl: input.submissionType === "link" ? input.response.trim() : "",
      comments: input.comments.trim(),
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      moduleId: "assignment",
    });
    return { ok: true as const };
  } catch (error) {
    console.error("[Assignments] Submit failed:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Submit failed.",
    };
  }
}
