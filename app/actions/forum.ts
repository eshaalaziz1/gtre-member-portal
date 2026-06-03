"use server";

import { cookies } from "next/headers";
import { postForumQuestion, postForumReply } from "@/lib/forum";

export async function postForumQuestionAction(input: {
  title: string;
  body: string;
  visibility: "public" | "admin-only";
  authorName: string;
}) {
  const sessionValue = (await cookies()).get("session")?.value;
  return postForumQuestion(sessionValue, input);
}

export async function postForumReplyAction(input: {
  questionId: string;
  body: string;
  authorName: string;
}) {
  const sessionValue = (await cookies()).get("session")?.value;
  return postForumReply(sessionValue, input);
}
