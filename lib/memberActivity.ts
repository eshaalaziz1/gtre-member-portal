import { extractItemFields, fieldNumber, fieldString } from "./dataItems";
import { getAuthenticatedClientWithEmail } from "./wixSession";

const QUIZ_COLLECTION = "QuizSubmissions";
const ASSIGNMENTS_COLLECTION = "Assignments";

export type MemberActivity = {
  email: string;
  checkinWeekIds: string[];
  quizScores: Record<string, number>;
  submittedAssignmentIds: string[];
};

export async function getMemberActivity(
  sessionValue: string | undefined,
): Promise<MemberActivity | null> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) return null;

  const empty: MemberActivity = {
    email: auth.email,
    checkinWeekIds: [],
    quizScores: {},
    submittedAssignmentIds: [],
  };

  try {
    const [quizResults, assignmentResults] = await Promise.all([
      auth.client.items
        .query(QUIZ_COLLECTION)
        .eq("gtEmail", auth.email)
        .find(),
      auth.client.items
        .query(ASSIGNMENTS_COLLECTION)
        .eq("gtEmail", auth.email)
        .find(),
    ]);

    const checkinWeekIds: string[] = [];
    const quizScores: Record<string, number> = {};
    const submittedAssignmentIds: string[] = [];

    for (const item of quizResults.items) {
      const data = extractItemFields(item as Record<string, unknown>);
      const weekId = data.weekId;
      if (weekId !== undefined && weekId !== null && weekId !== "") {
        checkinWeekIds.push(String(weekId));
        continue;
      }
      const moduleId = fieldString(data.moduleId);
      const pct = fieldNumber(data.percentageScore);
      if (moduleId && pct !== null) {
        quizScores[moduleId] = pct;
      }
    }

    for (const item of assignmentResults.items) {
      const data = extractItemFields(item as Record<string, unknown>);
      const assignmentId = fieldString(data.assignmentId);
      if (assignmentId) submittedAssignmentIds.push(assignmentId);
    }

    return {
      email: auth.email,
      checkinWeekIds: [...new Set(checkinWeekIds)],
      quizScores,
      submittedAssignmentIds: [...new Set(submittedAssignmentIds)],
    };
  } catch (error) {
    console.error("[MemberActivity] Load failed:", error);
    return empty;
  }
}
