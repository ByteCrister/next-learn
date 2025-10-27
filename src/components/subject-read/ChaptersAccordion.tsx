// /components/ChaptersAccordion.tsx
"use client";
import React from "react";
import type { VChapter } from "@/types/types.roadmap";

/* shadcn/ui accordion imports (adjust path if your project uses a different path) */
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import RoadmapChapterViewer from "./RoadmapChapterViewer";

export default function ChaptersAccordion({ chapters }: { chapters: VChapter[] }) {
    if (!chapters || chapters.length === 0) {
        return <div className="text-sm text-slate-500">No chapters found.</div>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {chapters.map((ch) => (
                <AccordionItem key={ch._id} value={ch._id} className="border-b last:border-0">
                    <AccordionTrigger className="px-3 py-2 text-left text-slate-800">{ch.title}</AccordionTrigger>
                    <AccordionContent className="px-3 py-4">
                        <RoadmapChapterViewer chapter={ch} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
