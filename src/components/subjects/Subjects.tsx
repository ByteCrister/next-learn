"use client";

import { useEffect, useMemo, useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectCard } from "./SubjectCard";
import { Pagination } from "./Pagination";
import { useSubjectsSearch } from "@/hooks/useSubjectsSearch";
import { BsBook, BsFileEarmarkText, BsLink45Deg } from "react-icons/bs";
import SearchBar from "./SearchBar";
import { SortSelect } from "./SortSelect";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import AddSubjectModal from "./AddSubjectModal";
import { StatCard } from "./StatCard";
import FullSubjectsSkeleton from "./SubjectsSkeleton";
import { decodeId } from "@/utils/helpers/IdConversion";

export type SortOption = "alpha-asc" | "alpha-desc" | "newest" | "oldest" | "none";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A → Z", value: "alpha-asc" },
  { label: "Z → A", value: "alpha-desc" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "None", value: "none" },
];

const ITEMS_PER_PAGE = 8;

export default function Subjects() {
  const { subjects, subjectCounts = { notes: 0, externalLinks: 0, studyMaterials: 0 }, loadingSubjects, fetchSubjects } = useSubjectStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useSubjectsSearch(searchTerm, 300);
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const searchedParam = searchParams?.get("searched") ?? null;
  const [searchedId, setSearchedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const resp = await fetchSubjects(searchedParam);
      if (!mounted) return;

      // If API returned matched metadata, use it (server already moved matched to front)
      if (resp && typeof resp === "object" && "matched" in resp && resp.matched) {
        setSearchedId(String(resp.matched.id));
        // server put matched at index 0 so show page 1
        setCurrentPage(1);
        // optional prefetch of full subject details:
        // fetchSubjectById(resp.matched.id);
        return;
      }

      // If server didn't return matched but param exists, try decode fallback
      if (searchedParam) {
        try {
          const raw = decodeId(String(searchedParam));
          setSearchedId(raw);
          // raw may not be in list; still show page 1 where we may have inserted it
          setCurrentPage(1);
        } catch {
          setSearchedId(null);
        }
      } else {
        setSearchedId(null);
      }
    })();

    return () => {
      mounted = false;
    };
    // re-run when searchedParam changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedParam]);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Subjects', href: '/subjects' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    // Preserve server/DB order when user chooses no client-side sort
    if (sortOption === "none") {
      return list.slice(); // shallow copy to trigger downstream updates
    }

    // Only sort when user explicitly requests
    const sorted = [...list].sort((a, b) => {
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

    return sorted;
  }, [subjects, debouncedSearchTerm, sortOption]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortOption]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  if (loadingSubjects) return <FullSubjectsSkeleton />

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-4 shadow-xl mb-8">
        <BsBook className="text-3xl" aria-hidden="true" />
        <h1 className="text-4xl font-bold">Subjects</h1>
      </header>

      {/* Total Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-5 tracking-wide">
        Total
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Notes"
          value={subjectCounts.notes ?? 0}
          icon={<BsBook className="text-xl text-white" />}
          gradientClasses="from-blue-500 to-indigo-600"
        />

        <StatCard
          label="External Links"
          value={subjectCounts.externalLinks ?? 0}
          icon={<BsLink45Deg className="text-xl text-white" />}
          gradientClasses="from-green-400 to-teal-500"
        />

        <StatCard
          label="Study Materials"
          value={subjectCounts.studyMaterials ?? 0}
          icon={<BsFileEarmarkText className="text-xl text-white" />}
          gradientClasses="from-purple-500 to-pink-500"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />

        {/* Sort */}
        <SortSelect value={sortOption} options={SORT_OPTIONS} onChange={(v) => setSortOption(v)} />

        {/* Add Button */}
        <AddSubjectModal />
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
                isSearched={searchedId !== null && String(subject._id) === searchedId}
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