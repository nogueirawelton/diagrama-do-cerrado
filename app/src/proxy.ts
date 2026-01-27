import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const access_token = request.cookies.get("ACCESS_TOKEN")?.value;
  const refresh_token = request.cookies.get("REFRESH_TOKEN")?.value;

  const isAuthenticated = access_token || refresh_token;

  const { pathname } = request.nextUrl;

  const isLoginRoute = pathname === "/";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
