"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { CourseRoadmapDTO, SubjectDTO } from "@/types/types.view.subject";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getViewSubject } from "@/utils/api/api.view";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import HeaderSkeleton from "./HeaderSkeleton";
import ErrorHeader from "./ErrorHeader";
import HeaderView from "./HeaderView";
import BodySkeleton from "./BodySkeleton";
import ErrorBody from "./ErrorBody";
import ContentTabs from "./ContentTabs";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { decodeId } from "@/utils/helpers/IdConversion";

// ---------- Types ----------
type ViewData = { subject: SubjectDTO; roadmap: CourseRoadmapDTO | null };

// ---------- Variants ----------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ViewSubjectPage() {
  const [data, setData] = React.useState<ViewData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"overview" | "roadmap" | "chapters">("overview");
  const { setBreadcrumbs } = useBreadcrumbStore();

  const { slug } = useParams(); // slug will be "68977baa-0edaacbf-608660b5"
  const subjectId = decodeId(decodeURIComponent(slug as string));

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getViewSubject(subjectId);
      if ("message" in res) {
        toast.error(res.message || "Failed to load subject.");
        setError(res.message || "Failed to load subject.");
        setData(null);
      } else {
        setData(res);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong while fetching data.");
      setError("Something went wrong while fetching data.");
      setData(null);
    } finally {
      setLoading(false);
    }
    setBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'View Subject', href: `/view-subject/${slug}` },
    ]);
  }, [setBreadcrumbs, slug, subjectId]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <TooltipProvider>
      <div className="relative min-h-[100dvh]">
        {/* Ambient gradient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.20),transparent_60%),radial-gradient(900px_500px_at_100%_10%,rgba(139,92,246,0.18),transparent_60%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-6 md:mb-8"
            aria-live="polite"
          >
            {loading ? (
              <HeaderSkeleton />
            ) : error ? (
              <ErrorHeader onRetry={load} error={error} />
            ) : data ? (
              <HeaderView subject={data.subject} roadmap={data.roadmap} />
            ) : null}
          </motion.header>

          {/* Body */}
          <motion.section initial="hidden" animate="show" variants={fadeUp}>
            {loading ? (
              <BodySkeleton />
            ) : error ? (
              <ErrorBody onRetry={load} />
            ) : data ? (
              <ContentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                subject={data.subject}
                roadmap={data.roadmap}
              />
            ) : null}
          </motion.section>
        </div>
      </div>
    </TooltipProvider>
  );
}
