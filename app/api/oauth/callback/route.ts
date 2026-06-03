import { NextRequest, NextResponse } from "next/server";
import { createWixClient, parseSessionCookie } from "@/lib/wixClientBase";

export async function GET(request: NextRequest) {
  const oauthCookie = request.cookies.get("oauthRedirectData");

  if (!oauthCookie?.value) {
    return NextResponse.redirect(
      new URL("/?error=missing_login_data", request.url),
    );
  }

  const oauthData = JSON.parse(oauthCookie.value);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  if (error) {
    const message = encodeURIComponent(errorDescription ?? error);
    const response = NextResponse.redirect(
      new URL(`/?error=${message}`, request.url),
    );
    response.cookies.delete("oauthRedirectData");
    return response;
  }

  if (!code || !state) {
    const response = NextResponse.redirect(
      new URL("/?error=missing_authorization_code", request.url),
    );
    response.cookies.delete("oauthRedirectData");
    return response;
  }

  try {
    const sessionTokens = parseSessionCookie(
      request.cookies.get("session")?.value,
    );
    const wixClient = createWixClient(sessionTokens);
    const tokens = await wixClient.auth.getMemberTokens(code, state, oauthData);

    const response = NextResponse.redirect(new URL("/", request.url));
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
    const response = NextResponse.redirect(
      new URL(`/?error=${message}`, request.url),
    );
    response.cookies.delete("oauthRedirectData");
    return response;
  }
}
