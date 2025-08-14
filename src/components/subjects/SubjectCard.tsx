import { FC, } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Subject } from "@/types/types.subjects";

interface SubjectCardProps {
    subject: Subject;
    index: number;
}
const BG_COLOR_PAIRS = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
];

const COLOR_GRADIENTS = [
  ["from-indigo-500", "to-pink-500"],
  ["from-emerald-500", "to-lime-500"],
  ["from-blue-500", "to-cyan-500"],
  ["from-purple-500", "to-violet-500"],
];

export const SubjectCard: FC<SubjectCardProps> = ({ subject, index }) => {
  const { bg, text } = BG_COLOR_PAIRS[index % BG_COLOR_PAIRS.length];
  const [fromColor, toColor] = COLOR_GRADIENTS[index % COLOR_GRADIENTS.length];

  return (
    <motion.article
      className={`rounded-2xl bg-gradient-to-br ${fromColor} ${toColor} p-[2px] shadow-md cursor-pointer`}
    >
      <Link
        href={`/subjects/${subject._id}`}
        className="block h-full rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg relative"
      >
        {/* Title */}
        <h3 className={`text-2xl font-extrabold mb-2 bg-clip-text bg-gradient-to-r ${fromColor} ${toColor}`}>
          {subject.title}
        </h3>

        {/* Code Badge */}
        {subject.code && (
          <span className={`${bg} ${text} px-2 py-0.5 rounded-md text-xs font-semibold mb-4 select-none`}>
            {subject.code}
          </span>
        )}

        {/* Description */}
        {subject.description && (
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-6 leading-relaxed">
            {subject.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <time>{new Date(subject.createdAt).toLocaleDateString()}</time>
          <HiOutlineArrowNarrowRight className="w-6 h-6 text-gray-900 dark:text-gray-100 opacity-75" />
        </div>
      </Link>
    </motion.article>
  );
};
