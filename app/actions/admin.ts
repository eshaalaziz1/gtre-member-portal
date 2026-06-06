"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  deactivatePortalResource,
  saveAssignmentOverride,
  savePortalResource,
} from "@/lib/adminContent";
import {
  postAdminOfficialReply,
  setForumQuestionAnswered,
} from "@/lib/adminForum";

async function getAdminAuth() {
  const sessionValue = (await cookies()).get("session")?.value;
  return requireAdmin(sessionValue);
}

export async function adminPostOfficialReplyAction(input: {
  questionId: string;
  body: string;
  authorName: string;
}) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false as const, error: "Not authorized." };
  const result = await postAdminOfficialReply(auth, input);
  if (result.ok) revalidatePath("/admin");
  return result;
}

export async function adminToggleAnsweredAction(
  questionId: string,
  isAnswered: boolean,
) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false as const, error: "Not authorized." };
  const result = await setForumQuestionAnswered(auth, questionId, isAnswered);
  if (result.ok) revalidatePath("/admin");
  return result;
}

export async function adminSaveAssignmentAction(input: {
  assignmentId: string;
  title: string;
  description: string;
  due: string;
  existingId?: string;
}) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false as const, error: "Not authorized." };
  const result = await saveAssignmentOverride(auth, input);
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/");
  }
  return result;
}

export async function adminSaveResourceAction(input: {
  id?: string;
  title: string;
  section: "materials-slides" | "materials-tools" | "casestudy";
  resourceType: string;
  description: string;
  url: string;
  sortOrder: number;
}) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false as const, error: "Not authorized." };
  const result = await savePortalResource(auth, input);
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/");
  }
  return result;
}

export async function adminDeleteResourceAction(id: string) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false as const, error: "Not authorized." };
  const result = await deactivatePortalResource(auth, id);
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/");
  }
  return result;
}
