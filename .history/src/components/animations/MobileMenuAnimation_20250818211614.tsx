"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface MobileMenuAnimationProps {
  isOpen: boolean;
  children: ReactNode;
}

export const MobileMenuAnimation = ({ isOpen, children }: MobileMenuAnimationProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
