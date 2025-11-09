
"use client";

import React, { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { useSearchParams } from "next/navigation";
import { useChapterStore } from "@/store/useChapterStore";
import ChapterEditor from "@/components/subjects-subject/ChapterEditor";

export default function ChapterPage({ subjectId, chapterId }: { subjectId: string; chapterId: string }) {
    const { selectedRoadmap, fetchSubjectById } = useSubjectStore();
    const { chapters, fetchChaptersByRoadmapId } = useChapterStore();
    const [roadmapId, setRoadmapId] = useState<string>("");
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') === 'view' ? 'view' : 'edit';

    useEffect(() => {
        fetchSubjectById(subjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    useEffect(() => {
        if (selectedRoadmap?._id) {
            setRoadmapId(selectedRoadmap._id);
            fetchChaptersByRoadmapId(selectedRoadmap._id);
        }
    }, [selectedRoadmap, fetchChaptersByRoadmapId]);

    // Dynamic SEO
    useEffect(() => {
        const chapter = chapters.find((ch) => ch._id === chapterId);
        if (chapter) {
            const title = `${chapter.title} | Learning Platform`;
            const description = chapter.content
                ? (Array.isArray(chapter.content)
                    ? chapter.content.join(' ').replace(/<[^>]*>/g, '').substring(0, 160)
                    : chapter.content.replace(/<[^>]*>/g, '').substring(0, 160))
                : `Read and learn about ${chapter.title}`;

            document.title = title;

            // Update meta tags
            const updateMetaTag = (name: string, content: string) => {
                let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.name = name;
                    document.head.appendChild(meta);
                }
                meta.content = content;
            };

            updateMetaTag('description', description);
            updateMetaTag('og:title', title);
            updateMetaTag('og:description', description);
            updateMetaTag('og:type', 'article');
            updateMetaTag('twitter:title', title);
            updateMetaTag('twitter:description', description);
            updateMetaTag('twitter:card', 'summary_large_image');

            // Add structured data
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": chapter.title,
                "description": description,
                "articleSection": "Education",
                "publisher": {
                    "@type": "Organization",
                    "name": "Learning Platform"
                },
                "datePublished": new Date().toISOString(),
                "dateModified": new Date().toISOString()
            };

            let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }
    }, [chapters, chapterId]);

    if (!roadmapId) {
        return (
            <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white">
            <ChapterEditor roadmapId={roadmapId} chapterId={chapterId} mode={mode} />
        </div>
    );
}
