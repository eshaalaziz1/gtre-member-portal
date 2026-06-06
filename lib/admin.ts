import { getAuthenticatedClientWithEmail } from "./wixSession";
import type { AuthenticatedClient } from "./wixSession";

export const ADMIN_EMAIL = "eaziz3@gatech.edu";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase().trim() === ADMIN_EMAIL;
}

export async function requireAdmin(
  sessionValue: string | undefined,
): Promise<(AuthenticatedClient & { email: string }) | null> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth?.email || !isAdminEmail(auth.email)) return null;
  return { ...auth, email: auth.email };
}
