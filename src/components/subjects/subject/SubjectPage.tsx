"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useSubjectStore } from "@/store/useSubjectsStore";
import { useChapterStore } from "@/store/useChapterStore";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import TipTapEditor from "@/components/Editor/TipTapEditor";

import { SubjectInput } from "@/types/types.subjects";
import { updateRoadmapContent } from "@/utils/api/api.roadmap";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import EditSubjectForm from "./EditSubjectForm";
import SubjectCounts from "./SubjectCounts";
import RoadmapInfoCard from "./RoadmapInfoCard";
import SubjectPageLoading from "./SubjectPageLoading";

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };
const hoverScale = { scale: 1.03 };
const MotionButton = motion(Button);

const SubjectPage = ({ subjectId }: { subjectId: string }) => {
    const router = useRouter();
    const {
        fetchSubjectById,
        selectedSubject,
        selectedRoadmap,
        loadingSelectedSubject,
        editSubject,
        removeSubject,
        createRoadmap,
        editRoadmap,
        deleteRoadmap,
        subjectCounts,
        loadingSubCrud,
    } = useSubjectStore();

    const { createChapter, loadingCrud: loadingChapterCrud } = useChapterStore();
    const { setBreadcrumbs } = useBreadcrumbStore();

    const [subjectForm, setSubjectForm] = useState<SubjectInput>({
        title: "",
        code: "",
        description: "",
    });
    const [roadmapTitle, setRoadmapTitle] = useState("");
    const [roadmapDescription, setRoadmapDescription] = useState("");
    const [roadmapContent, setRoadmapContent] = useState<string>("");
    const [chapterTitle, setChapterTitle] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchSubjectById(subjectId);
    }, [fetchSubjectById, subjectId]);

    useEffect(() => {
        if (selectedSubject) {
            setSubjectForm({
                title: selectedSubject.title,
                code: selectedSubject.code,
                description: selectedSubject.description || "",
            });
        }
        if (selectedRoadmap) {
            setRoadmapTitle(selectedRoadmap.title || "");
            setRoadmapDescription(selectedRoadmap.description || "");
            setRoadmapContent(selectedRoadmap.roadmap || "");
        }
        setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Subjects', href: '/subjects' },
            { label: `${selectedSubject?.title ?? ''}`, href: `/subjects/${selectedSubject?._id}` },
        ]);

        console.log(selectedRoadmap);
    }, [selectedSubject, selectedRoadmap, setBreadcrumbs]);

    if (loadingSelectedSubject) return <SubjectPageLoading />

    if (!selectedSubject) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                No subject found.
            </div>
        );
    }

    const handleSubjectUpdate = () =>
        editSubject(selectedSubject._id, subjectForm);
    const handleDeleteSubject = () => removeSubject(selectedSubject._id);

    const handleRoadmapSave = async () => {
        if (selectedRoadmap?._id) {
            await editRoadmap({
                roadmapId: selectedRoadmap._id,
                title: roadmapTitle,
                description: roadmapDescription,
            });
        } else {
            await createRoadmap(selectedSubject._id, {
                title: roadmapTitle || "Roadmap title",
                description: roadmapDescription || "Provide roadmap description",
            });
        }
    };

    const handleSaveContent = () =>
        updateRoadmapContent(selectedRoadmap?._id ?? "", roadmapContent);

    const handleDeleteRoadmap = async () => {
        await deleteRoadmap(selectedRoadmap?._id ?? '');
    }

    const handleCreateChapter = async () => {
        if (!chapterTitle.trim()) return;
        const id = await createChapter({
            title: chapterTitle,
            roadmapId: selectedRoadmap?._id ?? "",
        });
        if (id) {
            setOpen(false);
            setChapterTitle("");
            router.push(`/subjects/${subjectId}/${id}`);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white space-y-10 rounded-2xl">
            {/* Subject Form */}
            <EditSubjectForm
                subjectForm={subjectForm}
                setSubjectForm={setSubjectForm}
                onUpdate={handleSubjectUpdate}
                onDelete={handleDeleteSubject}
                loading={loadingSubCrud}
            />

            {/* Counts */}
            <SubjectCounts
                subjectId={subjectId}
                subjectCounts={subjectCounts}
            />

            {/* Roadmap Info */}
            <RoadmapInfoCard
                roadmapTitle={roadmapTitle}
                setRoadmapTitle={(v: string) => setRoadmapTitle(v)}
                roadmapDescription={roadmapDescription}
                setRoadmapDescription={(v: string) => setRoadmapDescription(v)}
                handleRoadmapSave={handleRoadmapSave}
                loading={loadingSubCrud}
                showDelete={!!selectedRoadmap}
                onDeleteRoadmap={handleDeleteRoadmap}
                loadingDelete={loadingSubCrud}
            />


            {/* Roadmap Content */}
            {selectedRoadmap?._id && (<motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
                    Roadmap Content
                </h2>
                <TipTapEditor
                    content={roadmapContent}
                    onChange={setRoadmapContent}
                    handleSave={handleSaveContent}
                />
            </motion.div>)}

            {/* Chapters List */}
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-purple-600">Chapters</h3>
                    {selectedRoadmap && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <MotionButton className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                                    Add Chapter
                                </MotionButton>
                            </DialogTrigger>
                            <DialogContent className="bg-white/80 backdrop-blur-lg rounded-xl p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">New Chapter</DialogTitle>
                                </DialogHeader>
                                <Input
                                    placeholder="Chapter Title"
                                    value={chapterTitle}
                                    onChange={(e) => setChapterTitle(e.target.value)}
                                />
                                <MotionButton
                                    onClick={handleCreateChapter}
                                    disabled={loadingChapterCrud || !chapterTitle.trim()}
                                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                                >
                                    Create
                                </MotionButton>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {selectedRoadmap?.chapters?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedRoadmap.chapters.map((chapter) => (
                            <motion.div
                                key={chapter._id}
                                whileHover={hoverScale}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Link
                                    href={`/subjects/${subjectId}/${chapter._id}`}
                                    className="block"
                                >
                                    <Card className="bg-white/30 backdrop-blur-lg rounded-xl shadow-md border border-white/20">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-indigo-800">
                                                {chapter.title}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No chapters yet. Add your first!
                    </p>
                )}
            </div>
        </div>
    );
};

export default SubjectPage;
