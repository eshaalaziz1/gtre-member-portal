import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { members } from "@wix/members";

export function getRedirectUri(origin: string) {
  return `${origin}/api/oauth/callback`;
}

export const SESSION_COOKIE_OPTIONS = { path: "/" } as const;

export function parseSessionCookie(value: string | undefined): Tokens | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Tokens;
  } catch {
    return null;
  }
}

export function createWixClient(tokens?: Tokens | null) {
  return createClient({
    modules: { members },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: tokens ?? undefined,
    }),
  });
}
