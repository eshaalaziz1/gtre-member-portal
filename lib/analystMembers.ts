import { extractItemFields, fieldNumber, fieldString } from "./dataItems";
import { getAuthenticatedClientWithEmail } from "./wixSession";

const COLLECTION_ID = "AnalystMembers";
const DEFAULT_SEMESTER = "Spring 2026";

export type AnalystProfile = {
  _id: string | null;
  gtEmail: string;
  memberId: string;
  firstName: string;
  lastName: string;
  major: string;
  graduationYear: number | null;
  reInterest: string;
  linkedinUrl: string;
  resumeUrl: string;
  bio: string;
  role: string;
  programSemester: string;
};

export type ProfileInput = Omit<
  AnalystProfile,
  "_id" | "gtEmail" | "memberId" | "role" | "programSemester"
>;

function mapProfile(
  item: Record<string, unknown> | null,
  email: string,
): AnalystProfile {
  const data = item ? extractItemFields(item) : {};
  return {
    _id: item?._id ? String(item._id) : null,
    gtEmail: fieldString(data.gtEmail) || email,
    memberId: fieldString(data.memberId) || email,
    firstName: fieldString(data.firstName),
    lastName: fieldString(data.lastName),
    major: fieldString(data.major),
    graduationYear: fieldNumber(data.graduationYear),
    reInterest: fieldString(data.reInterest),
    linkedinUrl: fieldString(data.linkedinUrl),
    resumeUrl: fieldString(data.resumeUrl),
    bio: fieldString(data.bio),
    role: fieldString(data.role),
    programSemester: fieldString(data.programSemester) || DEFAULT_SEMESTER,
  };
}

export async function getAnalystProfile(
  sessionValue: string | undefined,
): Promise<AnalystProfile | null> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) return null;

  try {
    const results = await auth.client.items
      .query(COLLECTION_ID)
      .eq("gtEmail", auth.email)
      .limit(1)
      .find();

    if (results.items.length > 0) {
      return mapProfile(
        results.items[0] as Record<string, unknown>,
        auth.email,
      );
    }

    return mapProfile(null, auth.email);
  } catch (error) {
    console.error("[AnalystMembers] Profile query failed:", error);
    return mapProfile(null, auth.email);
  }
}

export async function saveAnalystProfile(
  sessionValue: string | undefined,
  input: ProfileInput,
): Promise<{ ok: true; profile: AnalystProfile } | { ok: false; error: string }> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email) {
    return { ok: false, error: "You must be logged in to save your profile." };
  }

  if (!input.firstName.trim() || !input.lastName.trim()) {
    return { ok: false, error: "First and last name are required." };
  }

  const existing = await getAnalystProfile(sessionValue);
  const payload: Record<string, unknown> = {
    gtEmail: auth.email,
    memberId: auth.email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    major: input.major.trim(),
    graduationYear: input.graduationYear,
    reInterest: input.reInterest.trim(),
    linkedinUrl: input.linkedinUrl.trim(),
    resumeUrl: input.resumeUrl.trim(),
    bio: input.bio.trim(),
    programSemester: existing?.programSemester ?? DEFAULT_SEMESTER,
    role: existing?.role || "",
  };

  try {
    if (existing?._id) {
      await auth.client.items.update(COLLECTION_ID, {
        _id: existing._id,
        ...payload,
      });
    } else {
      await auth.client.items.insert(COLLECTION_ID, {
        ...payload,
        isApproved: false,
      });
    }

    const profile = await getAnalystProfile(sessionValue);
    if (!profile) {
      return { ok: false, error: "Profile saved but could not be reloaded." };
    }
    return { ok: true, profile };
  } catch (error) {
    console.error("[AnalystMembers] Profile save failed:", error);
    const message =
      error instanceof Error ? error.message : "Could not save profile.";
    return { ok: false, error: message };
  }
}

export function isExecutiveBoardRole(role: string): boolean {
  const normalized = role.toLowerCase();
  return ["executive", "admin", "e-board", "executive board"].some((r) =>
    normalized.includes(r),
  );
}
