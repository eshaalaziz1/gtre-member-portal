"use server";

import { cookies } from "next/headers";
import { getQuizByModuleId } from "@/lib/quiz/capitalMarkets";
import { getAuthenticatedClientWithEmail } from "@/lib/wixSession";

export async function submitQuizAction(input: {
  moduleId: string;
  answers: Record<number, string>;
}) {
  const auth = await getAuthenticatedClientWithEmail(
    (await cookies()).get("session")?.value,
  );
  if (!auth?.email) {
    return { ok: false as const, error: "You must be logged in." };
  }

  const questions = getQuizByModuleId(input.moduleId);
  if (questions.length === 0) {
    return { ok: false as const, error: "Quiz not found." };
  }

  let correct = 0;
  questions.forEach((q, i) => {
    if (input.answers[i] === q.ans) correct++;
  });
  const pct = Math.round((correct / questions.length) * 100);

  try {
    await auth.client.items.insert("QuizSubmissions", {
      gtEmail: auth.email,
      memberId: auth.email,
      moduleId: input.moduleId,
      score: correct,
      totalQuestions: questions.length,
      percentageScore: pct,
      submittedAt: new Date().toISOString(),
    });
    return {
      ok: true as const,
      correct,
      total: questions.length,
      percentage: pct,
    };
  } catch (error) {
    console.error("[Quiz] Submit failed:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Could not save quiz.",
    };
  }
}
