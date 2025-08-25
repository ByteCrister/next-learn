"use client";

import { ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const layoutRoutes = ["/dashboard", "/subjects", "/routines", "/exams", "/events", "/users"];

  const isLayoutPage = layoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );


  // Detect screen size on mount & resize
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render layout-specific content until mounted to avoid hydration mismatch
  if (!isLayoutPage || !isMounted) {
    return <>{children}</>;
  }


  if (!isLayoutPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
      {/* Sidebar + Overlay for mobile */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <>
            {/* Overlay (only on mobile) */}
            {isMobile && (
              <motion.div
                className="fixed inset-0 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ x: isMobile ? "-100%" : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? "-100%" : 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`${isMobile ? "fixed left-0 top-0 h-full z-20" : "relative flex-shrink-0 border-r border-gray-200 z-20"
                } bg-white w-64`}
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar onToggle={() => setSidebarOpen((o) => !o)} isOpen={sidebarOpen} />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
