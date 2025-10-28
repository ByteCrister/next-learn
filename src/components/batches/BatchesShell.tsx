// components/batches/BatchesShell.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiRefreshCw, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

type Props = {
  total: number;
  query: string;
  onQueryChange: (q: string) => void;
  sort: "new" | "old" | "name";
  onSortChange: (v: "new" | "old" | "name") => void;
  onCreate: () => void;
  page: number;
  pageSize: number;
  setPage: (n: number) => void;
  setPageSize: (n: number) => void;
};

export default function BatchesShell({
  total,
  query,
  onQueryChange,
  sort,
  onSortChange,
  onCreate,
  pageSize,
  setPageSize,
}: Props) {
  const [localQ, setLocalQ] = useState(query ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebouncedCallback((v: string) => onQueryChange(v), 250);

  useEffect(() => {
    setLocalQ(query ?? "");
  }, [query]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalQ(e.target.value);
    debounced(e.target.value);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden"
    >
      {/* Top Section */}
      <div className="p-4 sm:p-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Search Bar */}
          <motion.div 
            className="flex-1"
            animate={{ 
              scale: isFocused ? 1.005 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className={`
              relative flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 
              rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-300
              ${isFocused 
                ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50 shadow-lg shadow-blue-500/10' 
                : 'ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm'
              }
            `}>
              <FiSearch className={`text-base sm:text-lg flex-shrink-0 transition-colors ${isFocused ? 'text-blue-500' : 'text-slate-400'}`} />
              <Input
                value={localQ}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by name, program, or year..."
                className="bg-transparent border-0 px-0 py-0 text-sm sm:text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                aria-label="Search batches"
              />
              <AnimatePresence>
                {localQ && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setLocalQ("");
                      onQueryChange("");
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </motion.button>
                )}
              </AnimatePresence>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 flex-shrink-0">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {total}
                </span>
                <span className="text-xs text-slate-400 whitespace-nowrap">total</span>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onCreate} 
              className="w-full lg:w-auto h-11 px-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-xl font-medium text-sm sm:text-base"
            >
              <FiPlus className="mr-2 text-base sm:text-lg" /> 
              Create Batch
            </Button>
          </motion.div>
        </div>
        
        {/* Mobile total count */}
        <div className="sm:hidden mt-2 text-xs text-slate-500 dark:text-slate-400">
          {total} total batches
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-4 sm:p-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
          <FiFilter className="text-slate-400 text-sm" />
          <span>Filters:</span>
        </div>

        <Select 
          onValueChange={(v: string) => onSortChange(v as "new" | "old" | "name")} 
          value={sort}
        >
          <SelectTrigger className="w-36 sm:w-44 h-9 sm:h-10 text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="new" className="rounded-md text-sm">📅 Newest first</SelectItem>
            <SelectItem value="old" className="rounded-md text-sm">📆 Oldest first</SelectItem>
            <SelectItem value="name" className="rounded-md text-sm">🔤 Name A–Z</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          onValueChange={(v: string) => setPageSize(Number(v))} 
          defaultValue={String(pageSize || 12)}
        >
          <SelectTrigger className="w-24 sm:w-32 h-9 sm:h-10 text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="6" className="rounded-md text-sm">Show 6</SelectItem>
            <SelectItem value="12" className="rounded-md text-sm">Show 12</SelectItem>
            <SelectItem value="24" className="rounded-md text-sm">Show 24</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              onClick={() => location.reload()} 
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
              aria-label="Refresh list"
            >
              <FiRefreshCw className="sm:mr-2 text-base" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}