"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";
import { encodeId } from "@/utils/helpers/IdConversion";

interface CountBadgeProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  subjectId: string; // new prop
}

const CountBadge = ({ icon, label, count, subjectId }: CountBadgeProps) => {
  // convert label → URL slug
  const slug = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/subjects/${encodeId(subjectId)}/${slug}`}>
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        className="flex items-center gap-5 bg-white/70 backdrop-blur-md shadow-lg px-6 py-5 rounded-2xl cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        {/* Icon Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          whileHover={{ scale: 1.15 }}
          className="w-14 h-14 flex items-center justify-center rounded-full 
             bg-gradient-to-br from-blue-500 to-indigo-600 text-white 
             shadow-md ring-4 ring-white/40"
        >
          {icon}
        </motion.div>

        {/* Count + Label */}
        <div>
          <CountUp
            end={count}
            duration={1.5}
            className="text-3xl font-extrabold text-gray-900"
          />
          <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">
            {label}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CountBadge;
