import { NextRequest, NextResponse } from "next/server";
import { createWixClient, parseSessionCookie } from "@/lib/wixClientBase";
import { getSiteUrl } from "@/lib/siteUrl";

function siteRedirect(path: string) {
  return NextResponse.redirect(new URL(path, getSiteUrl()));
}

export async function GET(request: NextRequest) {
  const oauthCookie = request.cookies.get("oauthRedirectData");

  if (!oauthCookie?.value) {
    return siteRedirect("/?error=missing_login_data");
  }

  const oauthData = JSON.parse(oauthCookie.value);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  if (error) {
    const message = encodeURIComponent(errorDescription ?? error);
    const response = siteRedirect(`/?error=${message}`);
    response.cookies.delete("oauthRedirectData");
    return response;
  }

  if (!code || !state) {
    const response = siteRedirect("/?error=missing_authorization_code");
    response.cookies.delete("oauthRedirectData");
    return response;
  }

  try {
    const sessionTokens = parseSessionCookie(
      request.cookies.get("session")?.value,
    );
    const wixClient = createWixClient(sessionTokens);
    const tokens = await wixClient.auth.getMemberTokens(code, state, oauthData);

    const response = siteRedirect("/");
    response.cookies.set("session", JSON.stringify(tokens), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.delete("oauthRedirectData");
    return response;
  } catch (e) {
    const message = encodeURIComponent(
      e instanceof Error ? e.message : "Login failed",
    );
    const response = siteRedirect(`/?error=${message}`);
    response.cookies.delete("oauthRedirectData");
    return response;
  }
}
