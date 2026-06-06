import { extractItemFields, fieldNumber, fieldString } from "./dataItems";
import type { AuthenticatedClient } from "./wixSession";

const ASSIGNMENTS_COLLECTION = "Assignments";
const QUIZ_COLLECTION = "QuizSubmissions";

export type AdminAssignmentSubmission = {
  id: string;
  gtEmail: string;
  assignmentId: string;
  assignmentTitle: string;
  submissionType: string;
  writtenResponse: string;
  fileUrl: string;
  comments: string;
  status: string;
  submittedAt: string;
};

export type AdminQuizSubmission = {
  id: string;
  gtEmail: string;
  moduleId: string;
  score: number | null;
  totalQuestions: number | null;
  percentageScore: number | null;
  submittedAt: string;
};

export type AdminCheckinSubmission = {
  id: string;
  gtEmail: string;
  weekId: string;
  eventName: string;
  checkinCode: string;
  submittedAt: string;
};

function mapAssignment(item: Record<string, unknown>): AdminAssignmentSubmission {
  const data = extractItemFields(item);
  return {
    id: String(item._id ?? ""),
    gtEmail: fieldString(data.gtEmail),
    assignmentId: fieldString(data.assignmentId),
    assignmentTitle: fieldString(data.assignmentTitle),
    submissionType: fieldString(data.submissionType),
    writtenResponse: fieldString(data.writtenResponse),
    fileUrl: fieldString(data.fileUrl),
    comments: fieldString(data.comments),
    status: fieldString(data.status) || "Submitted",
    submittedAt: fieldString(data.submittedAt),
  };
}

export async function getAllAssignmentSubmissions(
  auth: AuthenticatedClient,
): Promise<AdminAssignmentSubmission[]> {
  try {
    const results = await auth.client.items
      .query(ASSIGNMENTS_COLLECTION)
      .descending("submittedAt")
      .limit(500)
      .find();
    return results.items.map((item) =>
      mapAssignment(item as Record<string, unknown>),
    );
  } catch (error) {
    console.error("[Admin] Assignment submissions query failed:", error);
    return [];
  }
}

export async function getAllQuizAndCheckinSubmissions(auth: AuthenticatedClient): Promise<{
  quizzes: AdminQuizSubmission[];
  checkins: AdminCheckinSubmission[];
}> {
  try {
    const results = await auth.client.items
      .query(QUIZ_COLLECTION)
      .descending("submittedAt")
      .limit(500)
      .find();

    const quizzes: AdminQuizSubmission[] = [];
    const checkins: AdminCheckinSubmission[] = [];

    for (const item of results.items) {
      const data = extractItemFields(item as Record<string, unknown>);
      const weekId = data.weekId;
      if (weekId !== undefined && weekId !== null && weekId !== "") {
        checkins.push({
          id: String((item as Record<string, unknown>)._id ?? ""),
          gtEmail: fieldString(data.gtEmail),
          weekId: String(weekId),
          eventName: fieldString(data.eventName),
          checkinCode: fieldString(data.checkinCode),
          submittedAt: fieldString(data.submittedAt),
        });
        continue;
      }

      const moduleId = fieldString(data.moduleId);
      const pct = fieldNumber(data.percentageScore);
      if (moduleId && pct !== null) {
        quizzes.push({
          id: String((item as Record<string, unknown>)._id ?? ""),
          gtEmail: fieldString(data.gtEmail),
          moduleId,
          score: fieldNumber(data.score),
          totalQuestions: fieldNumber(data.totalQuestions),
          percentageScore: pct,
          submittedAt: fieldString(data.submittedAt),
        });
      }
    }

    return { quizzes, checkins };
  } catch (error) {
    console.error("[Admin] Quiz/check-in submissions query failed:", error);
    return { quizzes: [], checkins: [] };
  }
}
