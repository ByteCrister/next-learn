"use client";

import React, { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import ChapterList from "@/components/subjects-subject/ChapterList";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { encodeId } from "@/utils/helpers/IdConversion";

const alertVariants = cva(
    "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "bg-card text-card-foreground",
                destructive:
                    "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
                className
            )}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
                className
            )}
            {...props}
        />
    );
}

export default function ChaptersPage({ subjectId }: { subjectId: string }) {
    const { selectedRoadmap, selectedSubject, fetchSubjectById } = useSubjectStore();
    const { setBreadcrumbs } = useBreadcrumbStore();
    const [roadmapId, setRoadmapId] = useState<string>("");

    useEffect(() => {
        fetchSubjectById(subjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    useEffect(() => {
        if (selectedRoadmap?._id) {
            setRoadmapId(selectedRoadmap._id);
        }
    }, [selectedRoadmap]);

    useEffect(() => {
        if (selectedSubject) {
            const subjectTitle = selectedSubject.title || "Subject";
            setBreadcrumbs([
                { label: 'Home', href: '/' },
                { label: 'Subjects', href: '/subjects' },
                { label: subjectTitle, href: `/subjects/${encodeId(encodeURIComponent(subjectId))}` },
                { label: 'ChaptersList', href: `/subjects/${encodeId(encodeURIComponent(subjectId))}/chapters` }
            ]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubject]);

    if (!roadmapId) {
        return (
            <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
                <Alert variant="destructive">
                    <AlertTitle>No Roadmap Found</AlertTitle>
                    <AlertDescription>Please add roadmap details first.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white">
            <ChapterList roadmapId={roadmapId} />
        </div>
    );
}
