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
