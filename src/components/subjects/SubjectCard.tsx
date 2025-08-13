import { FC, } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Subject } from "@/types/types.subjects";

interface SubjectCardProps {
    subject: Subject;
    index: number;
}

const COLOR_PAIRS = [
    ["from-indigo-500", "to-pink-500"],
    ["from-emerald-500", "to-lime-500"],
    ["from-blue-500", "to-cyan-500"],
    ["from-purple-500", "to-violet-500"],
];

export const SubjectCard: FC<SubjectCardProps> = ({ subject, index }) => {

    const [fromColor, toColor] = COLOR_PAIRS[index % COLOR_PAIRS.length];

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
            className={`
        rounded-2xl
        bg-gradient-to-br ${fromColor} ${toColor}
        p-[2px]
        cursor-pointer
        shadow-md
        transition-shadow duration-300 ease-out
        will-change-transform
      `}
        >
            <Link
                href={`/subjects/${subject._id}`}
                aria-label={`View subject ${subject.title}`}
                className="block h-full rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-black/20 hover:shadow-2xl transition-shadow duration-300 relative"
            >

                {/* Title */}
                <h3
                    className={`
            text-2xl font-extrabold leading-tight
            text-gray-900 dark:text-gray-100
            bg-clip-text bg-gradient-to-r ${fromColor} ${toColor}
            transition-colors duration-300 mb-2
          `}
                >
                    {subject.title}
                </h3>

                {/* Code Badge */}
                {subject.code && (
                    <span
                        className={`
              inline-block
              bg-${fromColor.replace("from-", "")} bg-opacity-20
              text-${fromColor.replace("from-", "")} dark:text-${toColor.replace("to-", "")}
              px-2 py-0.5
              rounded-md
              text-xs font-semibold
              mb-4
              select-none
            `}
                    >
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
                    <HiOutlineArrowNarrowRight
                        className="w-6 h-6 text-gray-900 dark:text-gray-100 opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                    />
                </div>
            </Link>
        </motion.article>
    );
};
