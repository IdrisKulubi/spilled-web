import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect /app to /home (the authenticated app)
  if (pathname === "/app") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/app"],
};
