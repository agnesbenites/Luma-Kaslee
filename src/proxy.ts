import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const protectedPaths = ["/dashboard", "/api/user"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
