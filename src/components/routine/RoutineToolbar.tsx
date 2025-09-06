"use client";

import {
    FiPlus,
    FiSearch,
    FiCalendar,
    FiEdit,
    FiClock,
    FiArrowUp,
    FiArrowDown,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    query: string;
    onQuery: (v: string) => void;
    sortKey: "name" | "createdAt" | "updatedAt";
    sortDir: "asc" | "desc";
    onSortKey: (k: Props["sortKey"]) => void;
    onSortDir: (d: Props["sortDir"]) => void;
    onAddNew: () => void;
    isMutating: boolean;
};

export default function RoutineToolbar({
    query,
    onQuery,
    sortKey,
    sortDir,
    onSortKey,
    onSortDir,
    onAddNew,
    isMutating,
}: Props) {
    return (
       <motion.div
  className="mt-6 flex flex-col gap-4 rounded-2xl border border-border/50 bg-gradient-to-br from-card/90 to-card/60 p-5 shadow-sm backdrop-blur-sm transition 
             md:flex-row md:items-center md:justify-between"
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
>
  {/* Search bar */}
  <div className="flex items-center gap-2 w-full md:w-auto md:min-w-[360px]">
    <div className="relative w-full">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search routines..."
        className="pl-9 rounded-lg border-input bg-background/70 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
      />
    </div>
  </div>

  {/* Sorting + Add button */}
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
    <div className="flex gap-3 w-full md:w-auto">
      <Select
        value={sortKey}
        onValueChange={(v) => onSortKey(v as Props["sortKey"])}
      >
        <SelectTrigger className="w-full md:w-[160px] rounded-lg border-input shadow-sm transition hover:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/50">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-lg">
          <SelectItem value="name"><FiEdit /> Name</SelectItem>
          <SelectItem value="createdAt"><FiCalendar /> Created</SelectItem>
          <SelectItem value="updatedAt"><FiClock /> Updated</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sortDir}
        onValueChange={(v) => onSortDir(v as Props["sortDir"])}
      >
        <SelectTrigger className="w-full md:w-[140px] rounded-lg border-input shadow-sm transition hover:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/50">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-lg">
          <SelectItem value="asc"><FiArrowUp /> Ascending</SelectItem>
          <SelectItem value="desc"><FiArrowDown /> Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Add Button */}
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="w-full md:w-auto">
      <Button
        onClick={onAddNew}
        disabled={isMutating}
        className="w-full md:w-auto gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-500/70"
      >
        <FiPlus className="text-lg" /> Add routine
      </Button>
    </motion.div>
  </div>
</motion.div>

    );
}
