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
} from "lucide-react";

type SortKey = "title" | "subjectCode" | "examCode";
type SortDir = "asc" | "desc";

export default function ExamsClient() {
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
  }, [fetchExams]);

  React.useEffect(() => {
    setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Exams", href: "/exams" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      {/* Subtle ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="mx-auto h-[24rem] w-[24rem] rounded-full bg-gradient-to-tr from-primary/20 via-violet-500/10 to-cyan-400/10 blur-3xl opacity-50 md:h-[32rem] md:w-[32rem]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              Exams
            </h1>
            <p className="text-muted-foreground">
              Browse, search, and manage all exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fetchExams()}
              disabled={fetching}
              aria-label="Refresh exams"
            >
              <RefreshCw
                className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <CreateExamDialog>
              <Button className="relative gap-2 overflow-hidden">
                <span className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,hsl(var(--primary)/.1),45%,transparent,55%,hsl(var(--primary)/.1))] [animation:shimmer_2s_infinite] [background-size:200%_100%]" />
                <Plus className="h-4 w-4" />
                Add exam
              </Button>
            </CreateExamDialog>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-muted/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
              {/* Search with icon and clear */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, subject, or code…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search exams"
                  className="pl-9 pr-9"
                />
                <AnimatePresence initial={false}>
                  {query && (
                    <motion.button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                      className="group absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort key */}
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Sort</div>
                <Select
                  value={sortKey}
                  onValueChange={(v: SortKey) => setSortKey(v)}
                >
                  <SelectTrigger className="w-[172px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="subjectCode">Subject</SelectItem>
                    <SelectItem value="examCode">Exam code</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort direction + quick toggle */}
                <Select
                  value={sortDir}
                  onValueChange={(v: SortDir) => setSortDir(v)}
                >
                  <SelectTrigger className="w-[146px]">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle sort direction"
                  onClick={toggleSortDir}
                  className="ml-1"
                >
                  {sortDir === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Results badge (auto wraps under on small screens) */}
              <div className="flex items-center justify-start md:justify-end">
                <span
                  aria-live="polite"
                  className="inline-flex items-center rounded-full border border-muted bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Page{" "}
              <span className="tabular-nums font-medium text-foreground">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="tabular-nums">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground">
                {((currentPage - 1) * pageSize + 1).toString().padStart(2, "0")}
                -
                {Math.min(currentPage * pageSize, filtered.length)
                  .toString()
                  .padStart(2, "0")}{" "}
                of {filtered.length.toString().padStart(2, "0")}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Inline message */}
        <AnimatePresence>
          {message && (
            <motion.div
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {fetching && exams.length === 0 ? (
          <ExamGridSkeleton count={pageSize} />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
          >
            {pageItems.map((exam, idx) => (
              <motion.div
                key={exam._id}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.03, duration: 0.25 }}
                className="group"
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

        {/* Empty state */}
        {!fetching && filtered.length === 0 && <EmptyState />}
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-2 rounded-full border bg-muted/40 p-3 text-muted-foreground">
          <FileSearch className="h-5 w-5" />
        </div>
        <CardTitle>No exams found</CardTitle>
        <CardDescription>
          Try adjusting your search or create a new exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <CreateExamDialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create exam
          </Button>
        </CreateExamDialog>
      </CardContent>
    </Card>
  );
}
