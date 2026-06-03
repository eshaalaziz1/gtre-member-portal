import Cookies from "js-cookie";
import { SESSION_COOKIE_OPTIONS } from "./wixClient";

const OAUTH_STORAGE_KEY = "oauthRedirectData";

export function setOAuthRedirectData(data: object) {
  const serialized = JSON.stringify(data);
  localStorage.setItem(OAUTH_STORAGE_KEY, serialized);
  Cookies.set(OAUTH_STORAGE_KEY, serialized, SESSION_COOKIE_OPTIONS);
}

export function clearOAuthRedirectData() {
  localStorage.removeItem(OAUTH_STORAGE_KEY);
  Cookies.remove(OAUTH_STORAGE_KEY, SESSION_COOKIE_OPTIONS);
}

export function clearSessionCookie() {
  Cookies.remove("session", SESSION_COOKIE_OPTIONS);
  Cookies.remove("session", { path: "/api/oauth/callback" });
}
