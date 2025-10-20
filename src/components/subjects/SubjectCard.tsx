"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { CalendarDays, BookOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/types.subjects";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

const COLOR_GRADIENTS = [
  ["from-indigo-500", "to-pink-500"],
  ["from-emerald-500", "to-lime-500"],
  ["from-blue-500", "to-cyan-500"],
  ["from-purple-500", "to-violet-500"],
];

export const SubjectCard: FC<SubjectCardProps> = ({ subject, index }) => {
  const [fromColor, toColor] = COLOR_GRADIENTS[index % COLOR_GRADIENTS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="transition-transform"
    >
      <Link href={`/subjects/${subject._id}`}>
        {/* Gradient Border Wrapper */}
        <div
          className={cn(
            "relative rounded-2xl p-[2px] bg-gradient-to-br",
            fromColor,
            toColor,
            "shadow-lg hover:shadow-xl transition-all duration-300"
          )}
        >
          <Card
            className={cn(
              "relative rounded-2xl border-0 bg-white backdrop-blur-sm"
            )}
          >
            <CardHeader>
              <CardTitle
                className={cn(
                  "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                  fromColor,
                  toColor,
                  poppins.className
                )}
              >
                {subject.title.length > 14 ? subject.title.slice(0, 14) + "." : subject.title}
              </CardTitle>

              {subject.code && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-2 font-medium text-white shadow-md",
                    "bg-gradient-to-r",
                    fromColor,
                    toColor
                  )}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  {subject.code}
                </Badge>
              )}
            </CardHeader>

            {subject.description && (
              <CardContent>
                <CardDescription className="text-gray-700 line-clamp-3 leading-relaxed">
                  {subject.description}
                </CardDescription>
              </CardContent>
            )}

            <Separator className="my-4" />

            <CardFooter className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(subject.createdAt).toLocaleDateString()}
              </div>
              <HiOutlineArrowNarrowRight className="w-6 h-6 opacity-75" />
            </CardFooter>
          </Card>
        </div>
      </Link>
    </motion.div>
  );
};
