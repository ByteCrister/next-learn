"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { getViewExternalLink } from "@/utils/api/api.view";
import { toast } from "react-toastify";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Calendar, BookOpen, ExternalLink } from "lucide-react";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { encodeId } from "@/utils/helpers/IdConversion";
import HeaderSkeleton from "../HeaderSkeleton";
import ErrorHeader from "../ErrorHeader";
import BodySkeleton from "../BodySkeleton";
import ErrorBody from "../ErrorBody";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ViewExternalLinkData = { externalLink: any; subject: { title: string; code?: string } };

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ViewSharedExternalLinkPage({ subjectId, externalLinkId }: { subjectId: string; externalLinkId: string }) {
    const [data, setData] = React.useState<ViewExternalLinkData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const { setBreadcrumbs } = useBreadcrumbStore();

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {

            const res = await getViewExternalLink(subjectId as string, externalLinkId as string);
            if ("message" in res) {
                toast.error(res.message || "Failed to load external link.");
                setError(res.message || "Failed to load external link.");
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
            { label: 'Shared External Link', href: `/view-subject/external-link/${encodeId(encodeURIComponent(subjectId))}/${encodeId(encodeURIComponent(externalLinkId))}` },
        ]);
    }, [setBreadcrumbs, subjectId, externalLinkId]);

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
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-indigo-600" />
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            {data.subject.title}
                                        </h1>
                                        {data.subject.code && (
                                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                {data.subject.code}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Shared External Link
                                </p>
                            </div>
                        ) : null}
                    </motion.header>

                    {/* Body */}
                    <motion.section initial="hidden" animate="show" variants={fadeUp}>
                        {loading ? (
                            <BodySkeleton />
                        ) : error ? (
                            <ErrorBody onRetry={load} />
                        ) : data ? (
                            <div className="space-y-6">
                                {/* External Link Content */}
                                {data.externalLink && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                                                    <ExternalLink className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    {data.externalLink.title}
                                                </h2>
                                                {data.externalLink.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        {data.externalLink.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(data.externalLink.addedAt).toLocaleDateString()}
                                                    </div>
                                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-xs">
                                                        {data.externalLink.category}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <a
                                                        href={data.externalLink.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Visit Link
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* No content message */}
                                {!data.externalLink && (
                                    <div className="text-center py-12">
                                        <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            External Link Not Found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            The shared external link could not be found or is not publicly available.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </motion.section>
                </div>
            </div>
        </TooltipProvider>
    );
}
