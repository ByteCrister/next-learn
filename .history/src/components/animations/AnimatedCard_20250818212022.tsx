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
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
