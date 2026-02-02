import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Redirect envirohealth.fly.dev → envirohealth.us (301)
  if (hostname.includes("fly.dev")) {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = "envirohealth.us";
    redirectUrl.port = "";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Add canonical header for good measure
  const response = NextResponse.next();
  response.headers.set(
    "Link",
    `<https://envirohealth.us${url.pathname}>; rel="canonical"`
  );

  return response;
}

export const config = {
  // Run on all routes except static files and API
  matcher: ["/((?!_next/static|_next/image|favicon|api/).*)"],
};
