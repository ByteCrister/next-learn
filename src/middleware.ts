import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Guest-only pages (cannot be visited if logged in)
const AUTH_ONLY_ROUTES = [/^\/signin$/, /^\/signup$/, /^\/reset$/];

// Public pages (accessible with or without login)
const PUBLIC_ROUTES = [
    /^\/$/,                      // home
    // /^\/about$/,
    // /^\/contact$/,
    // /^\/terms$/,
    // /^\/privacy$/,
    /^\/view-subject\/[^/]+$/,   // dynamic view-subject/:id
];

// Public API routes (accessible with or without login)
const PUBLIC_APIS = [
    /^\/api\/view\/subject$/,    // GET /api/view/subject
    /^\/api\/view\/note$/,       // GET /api/view/note
];

const isPublicFile = (pathname: string) =>
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth") || // keep auth endpoints open
    pathname === "/favicon.ico" ||
    /\.(.*)$/.test(pathname);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Allow static files & Next.js internals
    if (isPublicFile(pathname)) {
        return NextResponse.next();
    }

    // 2. Allow public API routes without authentication
    if (PUBLIC_APIS.some(rx => rx.test(pathname))) {
        return NextResponse.next();
    }

    // 3. Get token to check auth status
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // 4. Authenticated users visiting guest-only pages → redirect to home
    if (token && AUTH_ONLY_ROUTES.some(rx => rx.test(pathname))) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 5. If unauthenticated and route is not public → redirect to signin
    const isProtectedRoute =
        !AUTH_ONLY_ROUTES.some(rx => rx.test(pathname)) &&
        !PUBLIC_ROUTES.some(rx => rx.test(pathname));

    if (!token && isProtectedRoute) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/signin";
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
