import {
  mapQuestion,
  mapReply,
  type ForumQuestion,
  type ForumReply,
} from "./forum";
import type { AuthenticatedClient } from "./wixSession";

const QUESTIONS_COLLECTION = "ForumQuestions";
const REPLIES_COLLECTION = "ForumReplies";

export async function getAllForumQuestions(
  auth: AuthenticatedClient,
): Promise<ForumQuestion[]> {
  try {
    const results = await auth.client.items
      .query(QUESTIONS_COLLECTION)
      .descending("createdAt")
      .limit(200)
      .find();
    return results.items.map((item) =>
      mapQuestion(item as Record<string, unknown>),
    );
  } catch (error) {
    console.error("[Admin] Forum questions query failed:", error);
    return [];
  }
}

export async function getAdminForumDetail(
  auth: AuthenticatedClient,
  questionId: string,
): Promise<{ question: ForumQuestion; replies: ForumReply[] } | null> {
  try {
    const questionItem = await auth.client.items.get(
      QUESTIONS_COLLECTION,
      questionId,
    );
    if (!questionItem) return null;

    const question = mapQuestion(questionItem as Record<string, unknown>);
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
    console.error("[Admin] Forum detail failed:", error);
    return null;
  }
}

export async function postAdminOfficialReply(
  auth: AuthenticatedClient,
  input: { questionId: string; body: string; authorName: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await auth.client.items.insert(REPLIES_COLLECTION, {
      questionId: input.questionId,
      memberId: auth.email,
      authorName: input.authorName,
      body: input.body.trim(),
      isOfficialAnswer: true,
      createdAt: new Date().toISOString(),
    });

    await auth.client.items.update(QUESTIONS_COLLECTION, {
      _id: input.questionId,
      isAnswered: true,
    });

    return { ok: true };
  } catch (error) {
    console.error("[Admin] Official reply failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not post reply.",
    };
  }
}

export async function setForumQuestionAnswered(
  auth: AuthenticatedClient,
  questionId: string,
  isAnswered: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await auth.client.items.update(QUESTIONS_COLLECTION, {
      _id: questionId,
      isAnswered,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not update question.",
    };
  }
}
