"use client";

import { useEffect, useState } from "react";
import {
  createWixClient,
  getOAuthOriginalUri,
  getRedirectUri,
  parseSessionCookie,
} from "@/lib/wixClientBase";
import { getMemberDisplayEmail } from "@/lib/memberDisplay";
import {
  clearOAuthRedirectData,
  clearSessionCookie,
  setOAuthRedirectData,
} from "@/lib/sessionClient";
import Cookies from "js-cookie";

export default function MemberAuth({
  initialEmail,
  initialLoggedIn = false,
  errorMessage,
  variant = "default",
}: {
  initialEmail?: string | null;
  initialLoggedIn?: boolean;
  errorMessage?: string;
  variant?: "default" | "portal" | "compact";
}) {
  const [email, setEmail] = useState<string | null>(initialEmail ?? null);
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
  const [loading, setLoading] = useState(!initialLoggedIn && !initialEmail);
  const [loginError, setLoginError] = useState<string | null>(
    errorMessage ?? null,
  );

  useEffect(() => {
    if (initialLoggedIn || initialEmail) {
      setLoading(false);
      return;
    }

    async function fetchMember() {
      try {
        const session = parseSessionCookie(Cookies.get("session"));
        const client = createWixClient(session);
        if (session) client.auth.setTokens(session);

        if (client.auth.loggedIn()) {
          setLoggedIn(true);
          const { member } = await client.members.getCurrentMember({
            fieldsets: ["EXTENDED"],
          });
          setEmail(getMemberDisplayEmail(member));
        }
      } catch (e) {
        setLoginError(e instanceof Error ? e.message : "Failed to load member");
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [initialEmail, initialLoggedIn]);

  async function login() {
    setLoginError(null);
    clearSessionCookie();
    clearOAuthRedirectData();

    try {
      const session = parseSessionCookie(Cookies.get("session"));
      const client = createWixClient(session);
      const originalURI = getOAuthOriginalUri();
      const redirectURI = getRedirectUri();
      const data = client.auth.generateOAuthData(redirectURI, originalURI);
      setOAuthRedirectData(data);
      const { authUrl } = await client.auth.getAuthUrl(data, {
        responseMode: "query",
      });
      window.location.href = authUrl;
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Login failed");
    }
  }

  async function logout() {
    const session = parseSessionCookie(Cookies.get("session"));
    const client = createWixClient(session);
    const { logoutUrl } = await client.auth.logout(getOAuthOriginalUri());
    clearSessionCookie();
    window.location.href = logoutUrl;
  }

  if (loading) {
    return <p>{variant === "portal" ? "Checking session…" : "Loading..."}</p>;
  }

  if (loggedIn) {
    if (variant === "compact") {
      return (
        <button
          type="button"
          className="portal-btn-text"
          onClick={logout}
        >
          Logout
        </button>
      );
    }

    if (variant === "portal") {
      return null;
    }

    return (
      <div>
        {email ? (
          <p>Logged in as {email}</p>
        ) : (
          <p>Logged in as member</p>
        )}
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  if (variant === "portal") {
    return (
      <div>
        {loginError && <p className="portal-login-error">{loginError}</p>}
        <button
          type="button"
          className="portal-btn-primary"
          style={{ width: "100%", padding: "13px", fontSize: "14px" }}
          onClick={login}
        >
          Sign in with Wix
        </button>
      </div>
    );
  }

  return (
    <div>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  );
}
