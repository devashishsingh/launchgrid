/**
 * Scoped middleware: only intercepts /readiness/** to enforce auth + flag.
 * The rest of the app is untouched.
 */
import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "bloyi_session";
const PUBLIC = new Set([
  "/readiness/login",
  "/readiness/mfa",
  "/readiness/onboard",
  "/readiness/disabled",
]);

export function middleware(req: NextRequest) {
  const flagOff =
    (process.env.ENABLE_READINESS ?? "true").toLowerCase() === "false";
  const url = req.nextUrl;
  if (flagOff) {
    if (url.pathname !== "/readiness/disabled") {
      return NextResponse.rewrite(new URL("/readiness/disabled", url));
    }
    return NextResponse.next();
  }
  if (PUBLIC.has(url.pathname)) return NextResponse.next();
  // require signed session cookie; the API routes do their own deeper validation
  const c = req.cookies.get(COOKIE);
  if (!c || !c.value || !c.value.includes(".")) {
    return NextResponse.redirect(new URL("/readiness/login", url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/readiness/:path*"],
};
