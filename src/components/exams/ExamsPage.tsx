"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useExamStore } from "@/store/useExamStore";
import { CreateExamDialog } from "./CreateExamDialog";
import { ExamGridSkeleton } from "./ExamGridSkeleton";
import { ExamCard } from "./ExamCard";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import {
  Plus,
  Search,
  X,
  SortAsc,
  SortDesc,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "title" | "subjectCode" | "examCode";
type SortDir = "asc" | "desc";

export default function ExamsPage() {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const { exams, fetchExams, fetching, message } = useExamStore();
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("title");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  React.useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Exams", href: "/exams" },
    ]);
  }, [setBreadcrumbs]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? exams.filter((e) =>
        [e.title, e.description ?? "", e.subjectCode, e.examCode]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      : exams;

    const sorted = [...list].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [exams, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  React.useEffect(() => {
    setPage(1);
  }, [query, sortKey, sortDir]);

  const toggleSortDir = React.useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/10 blur-3xl opacity-40 mix-blend-multiply animation-pulse dark:opacity-20" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-transparent blur-3xl opacity-30 mix-blend-multiply animation-pulse dark:opacity-10 animation-delay-2000" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Exam Management
                  </span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100">
                Exams
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Manage and organize your exams. Search, filter, and create new exams with ease.
              </p>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                className="gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                onClick={() => fetchExams()}
                disabled={fetching}
                aria-label="Refresh exams"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 text-slate-600 dark:text-slate-400",
                    fetching && "animate-spin"
                  )}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <CreateExamDialog>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline font-semibold">Add exam</span>
                  <span className="sm:hidden font-semibold">Add</span>
                </Button>
              </CreateExamDialog>
            </motion.div>
          </div>

          {/* Controls Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:gap-6">
                  {/* Search Input */}
                  <div className="relative group">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="Search by title, subject, code…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search exams"
                      className="pl-12 pr-10 h-11 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all text-base"
                    />
                    <AnimatePresence initial={false}>
                      {query && (
                        <motion.button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Sort by
                    </div>
                    <Select
                      value={sortKey}
                      onValueChange={(v: SortKey) => setSortKey(v)}
                    >
                      <SelectTrigger className="w-auto border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-500">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="subjectCode">Subject</SelectItem>
                        <SelectItem value="examCode">Exam code</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Toggle sort direction"
                      onClick={toggleSortDir}
                      className="h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {sortDir === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {filtered.length}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        result{filtered.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator className="bg-slate-200 dark:bg-slate-700" />

              {/* Pagination */}
              <CardFooter className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50 dark:bg-slate-900/30">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {((currentPage - 1) * pageSize + 1).toString().padStart(2, "0")}-
                    {Math.min(currentPage * pageSize, filtered.length)
                      .toString()
                      .padStart(2, "0")}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {filtered.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="gap-1.5 border-slate-200 dark:border-slate-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 min-w-[4rem] text-center">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="gap-1.5 border-slate-200 dark:border-slate-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {message && (
              <motion.div
                className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400 shadow-md"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exams Grid */}
          {fetching && exams.length === 0 ? (
            <ExamGridSkeleton count={pageSize} />
          ) : (
            <motion.div
              layout
              // className="grid auto-cols-max gap-6 justify-start"
              className="grid gap-6 justify-start items-stretch"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
              transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
            >
              {pageItems.map((exam, idx) => (
                <motion.div
                  key={exam._id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  className="cursor-pointer"
                >
                  <ExamCard
                    exam={exam}
                    onClick={() => router.push(`/exams/${exam._id}`)}
                    index={idx}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!fetching && filtered.length === 0 && <EmptyState />}
        </motion.div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-col items-center text-center py-12">
          <motion.div
            className="mb-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FileSearch className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No exams found
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-400 max-w-sm">
            Get started by creating your first exam or adjust your search filters to find what you&apos;re looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <CreateExamDialog>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5" />
              Create exam
            </Button>
          </CreateExamDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}