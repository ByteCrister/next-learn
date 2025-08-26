"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/Editor/TipTapEditor";
import HtmlContent from "@/components/global/HtmlContent";

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

interface RoadmapContentBlockProps {
    roadmapContent: string;
    setRoadmapContent: (content: string) => void;
    handleSaveContent: () => Promise<void>;
}

export default function RoadmapContentBlock({
    roadmapContent,
    setRoadmapContent,
    handleSaveContent,
}: RoadmapContentBlockProps) {
    const [viewMode, setViewMode] = useState(true);

    return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
                Roadmap Content
            </h2>

            {viewMode ? (
                <div className="relative">
                    <div className="prose prose-indigo max-w-none p-8 rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-white to-indigo-50">
                        <HtmlContent html={roadmapContent} className="prose-indigo" />
                    </div>

                    {/* Edit Icon Button */}
                    <Button
                        size="icon"
                        onClick={() => setViewMode(false)}
                        className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full shadow-md transition-transform hover:scale-110"
                        title="Edit content"
                    >
                        <Pencil className="w-5 h-5" />
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    {/* Back button for editor */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setViewMode(true)}
                        className="absolute top-4 right-4 mb-3 flex items-center justify-center p-2 rounded-full shadow-sm"
                        title="Back to view"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <TipTapEditor
                        content={roadmapContent}
                        onChange={setRoadmapContent}
                        handleSave={async () => {
                            await handleSaveContent();
                            setViewMode(true);
                        }}
                    />
                </div>
            )}

        </motion.div>
    );
}
