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
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
