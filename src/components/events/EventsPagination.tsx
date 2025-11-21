"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsPaginationProps {
  showEvents: boolean;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function EventsPagination({
  showEvents,
  totalPages,
  currentPage,
  setCurrentPage,
}: EventsPaginationProps) {
  return (
    <AnimatePresence>
      {showEvents && totalPages > 1 && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center items-center gap-5 py-6"
        >
          {/* Previous Button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="transition-transform"
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={` cursor-pointer rounded-lg p-3 transition-all duration-300 h-auto ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border border-gray-200'
                  : 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm text-gray-700'
              }`}
            >
              <ChevronLeft size={20} />
            </Button>
          </motion.div>

          {/* Current Page Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <span className="text-gray-500 text-sm font-medium">Page</span>
            <motion.span
              key={currentPage}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text"
            >
              {currentPage}
            </motion.span>
            <span className="text-gray-500 text-sm font-medium">of</span>
            <motion.span className="text-lg font-semibold text-gray-700">
              {totalPages}
            </motion.span>
          </motion.div>

          {/* Next Button */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="transition-transform"
          >
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className={` cursor-pointer rounded-lg p-3 transition-all duration-300 h-auto ${
                currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border border-gray-200'
                  : 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm text-gray-700'
              }`}
            >
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
