import { extractItemFields, fieldString } from "./dataItems";
import { isExecutiveBoardRole } from "./analystMembers";
import { getAuthenticatedClientWithEmail } from "./wixSession";

const QUESTIONS_COLLECTION = "ForumQuestions";
const REPLIES_COLLECTION = "ForumReplies";

export type ForumQuestion = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  gtEmail: string;
  visibility: "public" | "admin-only";
  isAnswered: boolean;
  createdAt: string;
};

export type ForumReply = {
  id: string;
  questionId: string;
  authorName: string;
  body: string;
  isOfficialAnswer: boolean;
  createdAt: string;
};

export function mapQuestion(item: Record<string, unknown>): ForumQuestion {
  const data = extractItemFields(item);
  const visibility = fieldString(data.visibility) || "public";
  return {
    id: String(item._id ?? ""),
    title: fieldString(data.title),
    body: fieldString(data.body),
    authorName: fieldString(data.authorName) || "Member",
    gtEmail: fieldString(data.gtEmail),
    visibility: visibility === "admin-only" ? "admin-only" : "public",
    isAnswered: Boolean(data.isAnswered),
    createdAt: fieldString(data.createdAt),
  };
}

export function mapReply(item: Record<string, unknown>): ForumReply {
  const data = extractItemFields(item);
  return {
    id: String(item._id ?? ""),
    questionId: fieldString(data.questionId),
    authorName: fieldString(data.authorName) || "Member",
    body: fieldString(data.body),
    isOfficialAnswer: Boolean(data.isOfficialAnswer),
    createdAt: fieldString(data.createdAt),
  };
}

export function canMemberSeeQuestion(
  question: ForumQuestion,
  isExecutiveBoard: boolean,
): boolean {
  if (question.visibility !== "admin-only") return true;
  return isExecutiveBoard;
}

export async function getForumQuestionsForMember(
  sessionValue: string | undefined,
  isExecutiveBoard: boolean,
): Promise<ForumQuestion[]> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) return [];

  try {
    const results = await auth.client.items
      .query(QUESTIONS_COLLECTION)
      .descending("createdAt")
      .find();

    return results.items
      .map((item) => mapQuestion(item as Record<string, unknown>))
      .filter((q) => canMemberSeeQuestion(q, isExecutiveBoard));
  } catch (error) {
    console.error("[Forum] Questions query failed:", error);
    return [];
  }
}

export async function getForumQuestionDetail(
  sessionValue: string | undefined,
  questionId: string,
  isExecutiveBoard: boolean,
): Promise<{ question: ForumQuestion; replies: ForumReply[] } | null> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) return null;

  try {
    const questionItem = await auth.client.items.get(
      QUESTIONS_COLLECTION,
      questionId,
    );
    if (!questionItem) return null;
    const question = mapQuestion(questionItem as Record<string, unknown>);

    if (!canMemberSeeQuestion(question, isExecutiveBoard)) {
      return null;
    }

    const replyResults = await auth.client.items
      .query(REPLIES_COLLECTION)
      .eq("questionId", questionId)
      .ascending("createdAt")
      .find();

    const replies = replyResults.items.map((item) =>
      mapReply(item as Record<string, unknown>),
    );

    return { question, replies };
  } catch (error) {
    console.error("[Forum] Detail load failed:", error);
    return null;
  }
}

export async function postForumQuestion(
  sessionValue: string | undefined,
  input: {
    title: string;
    body: string;
    visibility: "public" | "admin-only";
    authorName: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) {
    return { ok: false, error: "You must be logged in to post." };
  }

  try {
    await auth.client.items.insert(QUESTIONS_COLLECTION, {
      memberId: auth.email,
      authorName: input.authorName,
      gtEmail: auth.email,
      title: input.title.trim(),
      body: input.body.trim(),
      visibility: input.visibility,
      isAnswered: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (error) {
    console.error("[Forum] Post question failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not post question.",
    };
  }
}

export async function postForumReply(
  sessionValue: string | undefined,
  input: {
    questionId: string;
    body: string;
    authorName: string;
    isOfficialAnswer?: boolean;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) {
    return { ok: false, error: "You must be logged in to reply." };
  }

  try {
    await auth.client.items.insert(REPLIES_COLLECTION, {
      questionId: input.questionId,
      memberId: auth.email,
      authorName: input.authorName,
      body: input.body.trim(),
      isOfficialAnswer: input.isOfficialAnswer ?? false,
      createdAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (error) {
    console.error("[Forum] Post reply failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not post reply.",
    };
  }
}

export { isExecutiveBoardRole };
