import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createWixClient } from "@/lib/wixClientBase";

export async function middleware(request: NextRequest) {
  if (!request.cookies.get("session")) {
    const response = NextResponse.next();
    const wixClient = createWixClient();
    response.cookies.set(
      "session",
      JSON.stringify(await wixClient.auth.generateVisitorTokens()),
      { path: "/" },
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
