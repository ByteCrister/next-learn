/**
 * Navigation Routes Configuration
 * This file contains all the navigation routes used in the application
 */

export interface NavRoute {
  href: string;
  label: string;
  description?: string;
  isProtected?: boolean;
}

export const navRoutes: NavRoute[] = [
  {
    href: "/",
    label: "Home",
    description: "Welcome to Next Learn - Your Study Planner"
  },
  {
    href: "/features",
    label: "Features",
    description: "Explore all the powerful features of Next Learn"
  },
  {
    href: "/about",
    label: "About",
    description: "Learn more about Next Learn and our mission"
  },
  {
    href: "/how-to-use",
    label: "How to use",
    description: "Get started with our comprehensive guide"
  }
];

// Additional routes that might be useful
export const additionalRoutes = {
  login: "/user-login",
  signup: "/user-signup",
  resetPassword: "/user-reset-pass",
  dashboard: "/dashboard",
  subjects: "/subjects",
  routines: "/routines",
  newRoutine: "/routines/new"
};

// Protected routes that require authentication
export const protectedRoutes: string[] = [
  "/dashboard",
  "/subjects",
  "/subjects/[subjectId]",
  "/subjects/[subjectId]/[chapterId]",
  "/subjects/[subjectId]/materials",
  "/subjects/[subjectId]/notes",
  "/subjects/[subjectId]/notes/new",
  "/subjects/[subjectId]/notes/[noteId]",
  "/subjects/[subjectId]/roadmap",
  "/routines",
  "/routines/new"
];

// Public routes that don't require authentication
export const publicRoutes: string[] = [
  "/",
  "/features",
  "/about",
  "/how-to-use",
  "/user-login",
  "/user-signup",
  "/user-reset-pass"
];

// Route metadata for SEO and navigation
