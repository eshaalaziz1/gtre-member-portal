const DEFAULT_SITE_URL = "http://localhost:3000";

/** Base site URL (no trailing slash). Uses NEXT_PUBLIC_SITE_URL, else local dev default. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = configured || DEFAULT_SITE_URL;
  return base.replace(/\/$/, "");
}

/** Wix OAuth redirect URI registered in the Headless app settings. */
export function getRedirectUri(): string {
  return `${getSiteUrl()}/api/oauth/callback`;
}

/** Post-login return URL passed to generateOAuthData. */
export function getOAuthOriginalUri(): string {
  return `${getSiteUrl()}/`;
}
