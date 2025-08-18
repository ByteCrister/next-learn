"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface MobileMenuAnimationProps {
  isOpen: boolean;
  children: ReactNode;
}

export const MobileMenuAnimation = ({ isOpen, children }: MobileMenuAnimationProps) => {
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          className="overflow-hidden"
        >
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
