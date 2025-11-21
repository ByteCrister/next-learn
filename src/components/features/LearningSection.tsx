"use client";

import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import { BookOpen, Pen, Palette, RotateCcw, Target, Calendar, Sparkles, Image, Link, Code, Bookmark, Folder, Shield, User, Map, FileText } from "lucide-react";
import { fadeUp } from "./motion-variants";
import SectionHeading from "./SectionHeading";
import AccordionItemEnhanced from "./AccordionItemEnhanced";
import EnhancedCard from "./EnhancedCard";
import FeatureList from "./FeatureList";
import SubjectChip from "./SubjectChip";
import PreviewCard from "./PreviewCard";
import RoadmapPreview from "./RoadmapPreview";
import NotePreview from "./NotePreview";
import ResourceCard from "./ResourceCard";

export default function LearningSection() {
    // Generate 15 floating particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
    }));

    return (
        <section
            {...fadeUp}
            className="relative space-y-10 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-slate-900/80 dark:to-gray-950/80 px-4 py-16 sm:py-20 rounded-2xl mx-auto max-w-7xl backdrop-blur-xl "
        >
            {/* Enhanced Animated Background Grid */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.4) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <motion.div
                className="absolute top-20 left-10 w-60 h-72 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-60 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/4 w-60 h-64 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 80, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/3 w-60 h-80 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl"
                animate={{
                    x: [0, -60, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.4, 1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-60"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            <SectionHeading
                icon={<BookOpen className="w-8 h-8" />}
                title="Learning & content creation"
                subtitle="Create subjects, roadmaps, rich notes, and organize your resources with powerful tools designed for deep learning."
            />

            <motion.div >
                <Accordion type="single" collapsible className="space-y-8">
                    <AccordionItemEnhanced
                        value="subjects"
                        title="Create personalized subjects"
                        icon={<User className="w-5 h-5" />}
                        badge="Core Feature"
                    >
                        <div className="grid sm:grid-cols-2 gap-8">
                            <EnhancedCard
                                title="Build your own subjects"
                                description="Create custom titles and organize your learning journey with visual hierarchy."
                                gradient="from-blue-500/10 to-cyan-500/10"
                            >
                                <FeatureList
                                    items={[
                                        { label: "Custom titles", detail: "Name subjects the way you think", icon: <Pen className="w-4 h-4" /> },
                                        { label: "Color coding", detail: "Visual identifiers for instant recognition", icon: <Palette className="w-4 h-4" /> },
                                        { label: "Smart ordering", detail: "Drag-and-drop prioritization", icon: <RotateCcw className="w-4 h-4" /> },
                                    ]}
                                />
                            </EnhancedCard>

                            <div className="space-y-6">
                                <PreviewCard>
                                    <div className="space-y-4">
                                        <SubjectChip color="bg-blue-500" label="Data Structures" />
                                        <SubjectChip color="bg-purple-500" label="Machine Learning" />
                                        <SubjectChip color="bg-green-500" label="Web Development" />
                                    </div>
                                </PreviewCard>
                            </div>
                        </div>
                    </AccordionItemEnhanced>

                    <AccordionItemEnhanced
                        value="roadmaps"
                        title="Design learning roadmaps"
                        icon={<Map className="w-5 h-5" />}
                        badge="Popular"
                    >
                        <EnhancedCard
                            title="Rich text roadmaps"
                            description="Create detailed course plans with milestones, goals, and visual timelines."
                            gradient="from-purple-500/10 to-pink-500/10"
                        >
                            <div className="grid sm:grid-cols-2 gap-8">
                                <FeatureList
                                    items={[
                                        { label: "Visual milestones", detail: "Track progress with interactive checkpoints", icon: <Target className="w-4 h-4" /> },
                                        { label: "Smart goals", detail: "SMART framework with deadline tracking", icon: <Calendar className="w-4 h-4" /> },
                                        { label: "Rich formatting", detail: "Markdown, code blocks, and embeds", icon: <Sparkles className="w-4 h-4" /> },
                                    ]}
                                />
                                <RoadmapPreview />
                            </div>
                        </EnhancedCard>
                    </AccordionItemEnhanced>

                    <AccordionItemEnhanced
                        value="notes"
                        title="Write rich notes"
                        icon={<FileText className="w-5 h-5" />}
                        badge="Enhanced"
                    >
                        <EnhancedCard
                            title="Beautiful notes editor"
                            description="Take formatted notes with images, links, code, and mathematical expressions."
                            gradient="from-green-500/10 to-emerald-500/10"
                        >
                            <div className="grid sm:grid-cols-2 gap-8">
                                <FeatureList
                                    items={[
                                        // eslint-disable-next-line jsx-a11y/alt-text
                                        { label: "Media embeds", detail: "Images, videos, and diagrams", icon: <Image className="w-4 h-4" /> },
                                        { label: "Smart linking", detail: "Internal and external references", icon: <Link className="w-4 h-4" /> },
                                        { label: "Code & math", detail: "Syntax highlighting and LaTeX", icon: <Code className="w-4 h-4" /> },
                                    ]}
                                />
                                <NotePreview />
                            </div>
                        </EnhancedCard>
                    </AccordionItemEnhanced>

                    <AccordionItemEnhanced
                        value="resources"
                        title="Collect resources"
                        icon={<Bookmark className="w-5 h-5" />}
                        badge="New"
                    >
                        <div className="grid sm:grid-cols-3 gap-8">
                            <ResourceCard icon={<Bookmark className="w-6 h-6" />} title="Link capture" desc="Save URLs with auto-preview generation" />
                            <ResourceCard icon={<Folder className="w-6 h-6" />} title="Collections" desc="Organize by subject, theme, or project" />
                            <ResourceCard icon={<Shield className="w-6 h-6" />} title="Safe previews" desc="Privacy-focused embed sanitization" />
                        </div>
                    </AccordionItemEnhanced>
                </Accordion>
            </motion.div>
        </section>
    );
}
