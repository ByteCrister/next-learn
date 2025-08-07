import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ONLY_ROUTES = new Set([
    "/login",
    "/reset",
]);

const isPublicFile = (pathname: string) =>
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    /\.(.*)$/.test(pathname); // catches assets like .jpg, .js, .svg etc.

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Allow static files and Next.js internals
    if (isPublicFile(pathname)) {
        return NextResponse.next();
    }

    // 2. Get token to check auth status
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // 3. If authenticated and trying to access auth-only (login/reset) pages → redirect to "/"
    if (token && AUTH_ONLY_ROUTES.has(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 4. If unauthenticated and trying to access protected routes (excluding "/", login, reset) → redirect to login
    const isProtectedRoute =
        pathname !== "/" && !AUTH_ONLY_ROUTES.has(pathname);

    if (!token && isProtectedRoute) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Allow access otherwise
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
