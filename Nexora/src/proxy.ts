import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Define paths
  const authRoutes = ["/login", "/register"];
  const publicRoutes = [...authRoutes, "/api/auth"];

  const session = await auth();

  // 1. If user is logged in and trying to access login/register, redirect to home
  if (session && authRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If it's a public route (including api/auth), let it pass
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 3. If no token and accessing a protected route, redirect to login
  if (!session) {
    const loginURL = new URL("/login", request.url);
    loginURL.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginURL);
  }

  const role = session.user?.role;
  if (pathname.startsWith("/user") && role !== "user")
    return NextResponse.redirect(new URL("/unauthorized", request.url));

  if (pathname.startsWith("/delivery") && role !== "deliveryBoy")
    return NextResponse.redirect(new URL("/unauthorized", request.url));

  if (pathname.startsWith("/admin") && role !== "admin")
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
