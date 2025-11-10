"use client";

import React from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import SectionSkeleton from "./SectionSkeleton";
import NotFoundBlock from "./NotFoundBlock";
import RoadmapViewer from "./RoadmapViewer";
import ChaptersAccordion from "./ChaptersAccordion";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { encodeId } from "@/utils/helpers/IdConversion";
import { useRouter } from "next/navigation";

export default function SubjectReadPage({ subjectId }: { subjectId: string }) {
    const router = useRouter();
    const { selectedSubject: subject, subjectCache, selectedRoadmap: roadmap, loadingSelectedSubject, fetchSubjectById } = useSubjectStore();
    const [localLoading, setLocalLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const { setBreadcrumbs } = useBreadcrumbStore();

    // If there's a cached entry keyed by subjectId, populate selectedSubject/selectedRoadmap from it (store.fetchSubjectById already does this),
    // but we still call the store method to ensure latest data if not present.
    React.useEffect(() => {
        let mounted = true;
        async function init() {
            setError(null);

            // If store already has selectedSubject matching subjectId, skip fetch.
            const cacheEntry = subjectCache?.[subjectId];
            if (cacheEntry && cacheEntry.subject && String(cacheEntry.subject._id) === String(subjectId)) {
                // Ensure selectedSubject/selectedRoadmap in store are set (fetchSubjectById sets them when reading cache).
                // call fetchSubjectById but rely on its internal cache check (it returns early if cached).
                setLocalLoading(true);
                try {
                    await fetchSubjectById(subjectId);
                } catch (err) {
                    if (!mounted) return;
                    setError((err as Error)?.message ?? "Failed to load subject");
                } finally {
                    if (mounted) setLocalLoading(false);
                }
                return;
            }

            // If selectedSubject already loaded and matches id, nothing to do
            if (subject && String(subject._id) === String(subjectId)) return;

            // otherwise fetch from store which will use its cache internally
            setLocalLoading(true);
            try {
                await fetchSubjectById(subjectId);
            } catch (err) {
                if (!mounted) return;
                setError((err as Error)?.message ?? "Failed to load subject");
            } finally {
                if (mounted) setLocalLoading(false);
            }
        }

        init();
        setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Subjects', href: '/subjects' },
            { label: subject?.title ?? '-', href: `/subjects/${encodeId(encodeURIComponent(subject?._id ?? ''))}` },
            { label: 'Read', href: `/subjects/${encodeId(encodeURIComponent(subject?._id ?? ''))}/read` },
        ]);
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId, subject]);

    const retry = React.useCallback(async () => {
        setError(null);
        setLocalLoading(true);
        try {
            await fetchSubjectById(subjectId);
        } catch (err) {
            setError((err as Error)?.message ?? "Failed to load subject");
        } finally {
            setLocalLoading(false);
        }
    }, [fetchSubjectById, subjectId]);

    const goBack = React.useCallback(() => {
        router.back();
    }, [router]);

    // use the store values (they get set by fetchSubjectById)
    const loading = loadingSelectedSubject || localLoading;

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm">
                    <SectionSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <NotFoundBlock
                title="Subject not found"
                subtitle={error}
                actionLabel="Retry"
                onAction={retry}
                onBack={goBack}
            />
        );
    }

    if (!subject) {
        return (
            <NotFoundBlock
                title="Subject not found"
                subtitle="We could not load this subject right now."
                actionLabel="Back to subjects"
                onBack={() => router.push("/subjects")}
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <header className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{subject.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            <span className="font-medium">Code</span>: {subject.code} • <span className="font-medium">Updated</span>:{" "}
                            {new Date(subject.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 gap-6">
                <section className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
                    <h2 className="text-lg font-medium text-slate-800 mb-2">Description</h2>
                    <p className="text-slate-700">{subject.description ?? "No description provided."}</p>
                </section>

                <section className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
                    <h2 className="text-lg font-medium text-slate-800 mb-3">Roadmap</h2>
                    {roadmap ? <RoadmapViewer roadmap={roadmap} /> : <div className="text-sm text-slate-500">No roadmap available.</div>}
                </section>

                <section className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
                    <h2 className="text-lg font-medium text-slate-800 mb-3">Chapters</h2>
                    {roadmap && roadmap.chapters && roadmap.chapters.length > 0 ? (
                        <ChaptersAccordion chapters={roadmap.chapters} />
                    ) : (
                        <div className="text-sm text-slate-500">No chapters available.</div>
                    )}
                </section>
            </main>
        </div>
    );
}
