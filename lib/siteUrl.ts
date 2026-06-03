const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Base site URL (no trailing slash).
 * 1. NEXT_PUBLIC_SITE_URL when set (preferred for production)
 * 2. Browser origin on the client (works even if env was missing at build)
 * 3. VERCEL_URL on the server (auto-set on Vercel)
 * 4. http://localhost:3000 for local dev
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return normalizeBaseUrl(configured);
  }

  if (typeof window !== "undefined") {
    return normalizeBaseUrl(window.location.origin);
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return normalizeBaseUrl(`https://${vercelHost}`);
  }

  return DEFAULT_SITE_URL;
}

/** Wix OAuth redirect URI registered in the Headless app settings. */
export function getRedirectUri(): string {
  return `${getSiteUrl()}/api/oauth/callback`;
}

/** Post-login return URL passed to generateOAuthData. */
export function getOAuthOriginalUri(): string {
  return `${getSiteUrl()}/`;
}
