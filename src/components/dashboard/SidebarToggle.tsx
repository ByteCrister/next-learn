"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const barVariants = {
  closed: { rotate: 0, y: 0, opacity: 1 },
  openTop: { rotate: 45, y: 0 },
  openMiddle: { opacity: 0 },
  openBottom: { rotate: -45, y: 0 },
};

export const SidebarToggle: FC<SidebarToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <motion.button
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        relative w-10 h-10 flex items-center justify-center
        rounded-full shadow-md border border-border
        bg-white/10 dark:bg-white/5 backdrop-blur-md
        transition-colors duration-300
        hover:bg-white/20 dark:hover:bg-white/10
      "
    >
      {/* Top bar */}
      <motion.span
        className="absolute block h-0.5 w-6 rounded-full bg-neutral-700 dark:bg-neutral-300"
        initial={false}
        animate={isOpen ? "openTop" : "closed"}
        variants={barVariants}
        transition={{ duration: 0.3 }}
        whileHover={{ scaleX: 1.1 }}
      />

      {/* Middle bar */}
      <motion.span
        className="absolute block h-0.5 w-6 rounded-full bg-neutral-700 dark:bg-neutral-300"
        initial={false}
        animate={isOpen ? "openMiddle" : "closed"}
        variants={barVariants}
        transition={{ duration: 0.2 }}
        whileHover={{ scaleX: 1.1 }}
      />

      {/* Bottom bar */}
      <motion.span
        className="absolute block h-0.5 w-6 rounded-full bg-neutral-700 dark:bg-neutral-300"
        initial={false}
        animate={isOpen ? "openBottom" : "closed"}
        variants={barVariants}
        transition={{ duration: 0.3 }}
        whileHover={{ scaleX: 1.1 }}
      />
    </motion.button>
  );
};
