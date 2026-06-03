import { createWixClient, parseSessionCookie } from "./wixClientBase";
import { getMemberDisplayEmail } from "./memberDisplay";

export type SessionStatus = {
  loggedIn: boolean;
  email: string | null;
};

export async function getSessionStatus(
  sessionValue: string | undefined,
): Promise<SessionStatus> {
  const tokens = parseSessionCookie(sessionValue);
  if (!tokens) return { loggedIn: false, email: null };

  const client = createWixClient(tokens);
  client.auth.setTokens(tokens);

  if (!client.auth.loggedIn()) {
    return { loggedIn: false, email: null };
  }

  try {
    const { member } = await client.members.getCurrentMember({
      fieldsets: ["EXTENDED"],
    });
    return { loggedIn: true, email: getMemberDisplayEmail(member) };
  } catch {
    return { loggedIn: true, email: null };
  }
}
