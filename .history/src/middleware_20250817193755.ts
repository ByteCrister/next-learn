import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_FILE = /\.(.*)$/; // regex for static files

const AUTH_PAGES = ["/next-learn-user-auth", "/next-learn-user-reset-pass"]; // your public routes

export async function middleware(req: NextRequest) {
    // Avoid checking static files (images, fonts, etc)
    if (
        PUBLIC_FILE.test(req.nextUrl.pathname) ||
        req.nextUrl.pathname.startsWith("/_next") // next.js internals
    ) {
        return NextResponse.next();
    }

    // Allow NextAuth API routes to pass through without auth check
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Get token from cookie using NextAuth JWT helper
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If user is not signed in and tries to access protected route, redirect to login page
    if (!token && !AUTH_PAGES.includes(req.nextUrl.pathname)) {
        const loginUrl = new URL("/next-learn-user-auth", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is signed in and tries to visit login page, redirect to home
    if (token && AUTH_PAGES.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Otherwise let them pass
    return NextResponse.next();
}

// Define the routes this middleware should run on
export const config = {
    matcher: [
        /*
          Run middleware on all routes except:
          - static files
          - api/auth routes (NextAuth)
          - public routes defined above (like login)
        */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
