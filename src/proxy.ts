import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ONLY_ROUTES = [/^\/signin$/, /^\/signup$/, /^\/reset-password$/];

const PUBLIC_ROUTES = [
  /^\/$/, /^\/about$/, /^\/features$/, /^\/how-to-use$/,
  /^\/view-subject\/.+/, /^\/view-routine\/.+/, /^\/view-result\/.+/, /^\/join-exam\/.+/,
  /^\/view-subject\/[^/]+$/,
  /^\/view-subject\/notes\/[^/]+\/[^/]+$/,
  /^\/view-subject\/study-material\/[^/]+\/[^/]+$/,
  /^\/view-subject\/external-link\/[^/]+\/[^/]+$/,
  /^\/view-subject\/external-links\/[^/]+\/[^/]+$/,
];

const PUBLIC_APIS = [
  /^\/api\/view\/subject$/, /^\/api\/view\/note$/, /^\/api\/routines\/view$/,
  /^\/api\/results\/view-result$/, /^\/api\/exams\/.+/,
  /^\/api\/view\/notes$/, /^\/api\/view\/study-materials$/,
  /^\/api\/view\/study-material$/, /^\/api\/view\/external-link$/,
  /^\/api\/user/,
];

const isPublicFile = (pathname: string) =>
  pathname.startsWith("/_next/") ||
  pathname.startsWith("/api/auth") ||
  pathname === "/favicon.ico" ||
  /\.(.*)$/.test(pathname);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow sitemap & robots
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  // Allow static & auth files
  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_APIS.some((rx) => rx.test(pathname))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 
    process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
  });

  console.log("Token in middleware:", token);
  console.log("Cookies:", req.cookies.getAll());
  
  // Restrict admin route
  if (pathname.startsWith("/api/make-admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }
  }

  // Redirect signed-in users away from guest-only pages
  if (token && AUTH_ONLY_ROUTES.some((rx) => rx.test(pathname))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected =
    !AUTH_ONLY_ROUTES.some((rx) => rx.test(pathname)) &&
    !PUBLIC_ROUTES.some((rx) => rx.test(pathname));

  if (!token && isProtected) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/signin";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
