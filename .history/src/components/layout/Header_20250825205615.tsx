"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaNeos } from "react-icons/fa"; // N Icon from react-icons
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";
import routeDashboard from "@/utils/helpers/routeDashboard";
import { useRouter } from "next/navigation";

// Framer Motion Variants
const menuVariants = {
  open: { height: "auto", opacity: 1, transition: { staggerChildren: 0.05, duration: 0.3 } },
  closed: { height: 0, opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.2 } },
};

const itemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -20 },
};

export default function Header() {
  const { user } = useDashboardStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
    { href: "/how-to-use", label: "How to Use" },
  ];

  if (!isMounted) {
    return (
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 w-full h-16 border-b border-gray-200 dark:border-gray-700" />
    );
  }

  const handleClick = () => {
    if (user) {
      routeDashboard();
    } else {
      router.push('/signin');
    }
  };

  return (
    <header className="bg-white/70 dark:bg-black/60 backdrop-blur-md sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.3 }}>
              <FaNeos className="h-7 w-7 text-indigo-600 dark:text-indigo-400 drop-shadow-md" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-wide text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              Next-Learn
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.label}
                className="relative"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <Link
                  href={link.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium tracking-wide transition-colors duration-300"
                >
                  {link.label}
                </Link>
                <motion.span
                  className="absolute bottom-[-4px] left-0 h-[2px] bg-indigo-500 dark:bg-indigo-400 rounded"
                  variants={{
                    rest: { width: 0 },
                    hover: { width: "100%", x: 0, backgroundColor: "#6366f1" }
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </motion.div>
            ))}

          </nav>

          {/* CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link href={user ? '/dashboard' : '/signin'} className="hidden sm:inline-flex">
              <Button className="bg-gradient-to-r from-blue-500 to-B-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                {user ? 'Dashboard' : 'Sign In'} 
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden bg-white/80 dark:bg-black/70 backdrop-blur-lg"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link href={user ? "/dashboard" : "/signin"}>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Get Started <Sparkles className="ml-2 w-4 h-4 opacity-80" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
