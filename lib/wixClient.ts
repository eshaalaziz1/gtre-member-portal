import { createClient, OAuthStrategy, type Tokens } from "@wix/sdk";
import { items } from "@wix/data";
import { members } from "@wix/members";

export {
  getRedirectUri,
  getSiteUrl,
  getOAuthOriginalUri,
  parseSessionCookie,
  SESSION_COOKIE_OPTIONS,
} from "./wixClientBase";

export function createWixClient(tokens?: Tokens | null) {
  return createClient({
    modules: { members, items },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: tokens ?? undefined,
    }),
  });
}

export type WixDataClient = ReturnType<typeof createWixClient>;
