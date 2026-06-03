import { createWixClient, parseSessionCookie } from "./wixClient";
import type { WixDataClient } from "./wixClient";

export type AuthenticatedClient = {
  client: WixDataClient;
  email: string | null;
};

export function getAuthenticatedClient(
  sessionValue: string | undefined,
): AuthenticatedClient | null {
  const tokens = parseSessionCookie(sessionValue);
  if (!tokens) return null;

  const client = createWixClient(tokens);
  client.auth.setTokens(tokens);

  if (!client.auth.loggedIn()) return null;

  return { client, email: null };
}

export async function getAuthenticatedClientWithEmail(
  sessionValue: string | undefined,
): Promise<AuthenticatedClient | null> {
  const auth = getAuthenticatedClient(sessionValue);
  if (!auth) return null;

  try {
    const { member } = await auth.client.members.getCurrentMember({
      fieldsets: ["EXTENDED"],
    });
    const email = member?.loginEmail?.toLowerCase() ?? null;
    return { client: auth.client, email };
  } catch {
    return auth;
  }
}
