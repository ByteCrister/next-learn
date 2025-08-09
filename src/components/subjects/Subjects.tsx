"use client";

import { useEffect, useMemo, useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectCard } from "./SubjectCard";
import { Pagination } from "./Pagination";
import { useSubjectsSearch } from "@/hooks/useSubjectsSearch";
import { BsBook } from "react-icons/bs";
import SearchBar from "./SearchBar";
import { SortSelect } from "./SortSelect";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import NewSubjectPopover from "./NewSubjectModal";

type SortOption = "alpha-asc" | "alpha-desc" | "newest" | "oldest";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A → Z", value: "alpha-asc" },
  { label: "Z → A", value: "alpha-desc" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const ITEMS_PER_PAGE = 8;

export default function Subjects() {
  const { subjects, loadingSubjects, fetchSubjects } = useSubjectStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useSubjectsSearch(searchTerm, 300);
  const [sortOption, setSortOption] = useState<SortOption>("alpha-asc");
  const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  if (subjects.length === 0) {
    fetchSubjects();
  }
  setBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Subjects', href: '/subjects' },
  ]);
}, [fetchSubjects, setBreadcrumbs, subjects]);

  const filteredSubjects = useMemo(() => {
    let list = subjects || [];

    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description?.toLowerCase().includes(q) ?? false)
      );
    }

    return list.sort((a, b) => {
      switch (sortOption) {
        case "alpha-desc":
          return b.title.localeCompare(a.title);
        case "alpha-asc":
          return a.title.localeCompare(b.title);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [subjects, debouncedSearchTerm, sortOption]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortOption]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 lg:p-12">
      {/* Header */}
      <header className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-4 shadow-xl mb-8">
        <BsBook className="text-3xl" aria-hidden="true" />
        <h1 className="text-4xl font-bold">Subjects</h1>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />

        {/* Sort */}
        <SortSelect value={sortOption} options={SORT_OPTIONS} onChange={(v) => setSortOption(v)} />

        {/* Add Button */}
        <NewSubjectPopover />
      </div>

      {/* Subject Grid */}
      {loadingSubjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-48 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <BsBook size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No subjects found</p>
          <p className="text-sm">Try adjusting your search or add a new subject.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {pageItems.map((subject, idx) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                index={idx + (currentPage - 1) * ITEMS_PER_PAGE}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              page >= 1 && page <= totalPages && setCurrentPage(page)
            }
          />
        </div>
      )}
    </section>
  );
}
