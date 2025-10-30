"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import BatchesShell from "@/components/batches/BatchesShell";
import BatchGrid from "@/components/batches/BatchGrid";
import { useBatchesStore } from "@/store/useBatchesStore";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function BatchesPage() {
  const router = useRouter();
  const { fetchBatches, loading, total: storeTotal, batches: rawBatches } = useBatchesStore();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "name">("new");

  // pagination states (UI-managed)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  useEffect(() => {
    if (loading || rawBatches.length > 0) {
      setBreadcrumbs([
        { label: "Home", href: "/" },
        { label: "Batches", href: "/batches" },
      ]);
      return;
    }

    fetchBatches().catch(() => { });
    setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Batches", href: "/batches" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rawBatches.slice();

    if (q) {
      list = list.filter((b) => {
        const name = b.name?.toLowerCase() ?? "";
        const program = b.program?.toLowerCase() ?? "";
        const year = String(b.year ?? "").toLowerCase();
        return name.includes(q) || program.includes(q) || year.includes(q);
      });
    }

    if (sort === "new") {
      list.sort((a, z) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dz = z.createdAt ? new Date(z.createdAt).getTime() : 0;
        return dz - da;
      });
    } else if (sort === "old") {
      list.sort((a, z) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dz = z.createdAt ? new Date(z.createdAt).getTime() : 0;
        return da - dz;
      });
    } else {
      list.sort((a, z) => (a.name ?? "").localeCompare(z.name ?? ""));
    }

    return list;
  }, [rawBatches, query, sort]);

  // compute pagination here (single source of truth)
  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / safePageSize));
  const safePage = Math.max(1, Math.min(page, pageCount));

  // if page becomes invalid due to change in pageSize or filters, reset to 1
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const start = (safePage - 1) * safePageSize;
  const pageItems = filtered.slice(start, start + safePageSize);

  return (
    <main
      className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          {/* Page Header */}
          <div className="mb-8">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Batches
            </motion.h1>
            <motion.p className="text-slate-600 dark:text-slate-400 text-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              Manage and organize your student batches
            </motion.p>
          </div>

          <BatchesShell
            total={storeTotal}
            query={query}
            onQueryChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            sort={sort}
            onSortChange={(v) => {
              setSort(v);
              setPage(1);
            }}
            page={safePage}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
            onCreate={() => router.push("/batches/new")}
          />

          <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <BatchGrid
              batches={pageItems}
              loading={loading}
              page={safePage}
              pageCount={pageCount}
              onPageChange={(n) => setPage(n)}
              totalCount={filtered.length}
            />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
