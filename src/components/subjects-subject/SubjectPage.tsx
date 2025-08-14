"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useSubjectStore } from "@/store/useSubjectsStore";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/Editor/TipTapEditor";
import { Pencil, ArrowLeft } from "lucide-react";

import { SubjectInput } from "@/types/types.subjects";
import { updateRoadmapContent } from "@/utils/api/api.roadmap";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import EditSubjectForm from "./EditSubjectForm";
import SubjectCounts from "./SubjectBadges";
import RoadmapInfoCard from "./RoadmapInfoCard";
import SubjectPageLoading from "./SubjectPageLoading";
import HtmlContent from "@/components/global/HtmlContent";
import { ShareSubjectButton } from "./ShareSubjectButton";
import { useDashboardStore } from "@/store/useDashboardStore";

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const SubjectPage = ({ subjectId }: { subjectId: string }) => {
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
        loadingSubCrud,
    } = useSubjectStore();
    const { updateCounts } = useDashboardStore();
    const { setBreadcrumbs } = useBreadcrumbStore();

    const [subjectForm, setSubjectForm] = useState<SubjectInput>({
        title: "",
        code: "",
        description: "",
    });
    const [roadmapTitle, setRoadmapTitle] = useState("");
    const [roadmapDescription, setRoadmapDescription] = useState("");
    const [roadmapContent, setRoadmapContent] = useState<string>("");
    const [viewMode, setViewMode] = useState(true);

    useEffect(() => {
        fetchSubjectById(subjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

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
    
    const handleDeleteSubject = async () => {
        const isRemoved = await removeSubject(selectedSubject._id)
        if (isRemoved) updateCounts('subjectsCount', '-')
    };

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

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white space-y-10 rounded-2xl">
            {/* Top right share button */}
            <ShareSubjectButton subjectId={subjectId} />

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
                subjectCounts={selectedSubject?.selectedSubjectCounts || null}
                loading={loadingSelectedSubject}
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
            {selectedRoadmap?._id && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                    <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
                        Roadmap Content
                    </h2>

                    {viewMode ? (
                        <div className="relative">
                            <HtmlContent html={roadmapContent} />

                            {/* Edit Icon Button */}
                            <Button
                                size="icon"
                                onClick={() => setViewMode(false)}
                                className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-600 p-2 rounded-full"
                                title="Edit content"
                            >
                                <Pencil className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Back button for editor */}
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setViewMode(true)}
                                className="absolute top-4 right-4 mb-3 flex items-center justify-center p-2 rounded-full"
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
            )}
        </div>
    );
};

export default SubjectPage;
