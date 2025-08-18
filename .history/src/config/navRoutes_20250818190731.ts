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
