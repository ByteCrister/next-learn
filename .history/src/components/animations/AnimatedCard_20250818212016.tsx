"use client"
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}

export default function AnimatedCard({ 
  children, 
  className = "",
  hoverScale = 1.02,
  hoverY = -4
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: hoverY, 
        scale: hoverScale,
