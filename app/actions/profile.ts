"use server";

import { cookies } from "next/headers";
import { saveAnalystProfile, type ProfileInput } from "@/lib/analystMembers";

export async function saveProfileAction(input: ProfileInput) {
  const sessionValue = (await cookies()).get("session")?.value;
  return saveAnalystProfile(sessionValue, input);
}
