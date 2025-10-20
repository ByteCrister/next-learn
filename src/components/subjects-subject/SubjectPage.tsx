"use client";

import React, { useEffect, useState } from "react";

import { useSubjectStore } from "@/store/useSubjectsStore";

import { Button } from "@/components/ui/button";
import { Pencil, Eye, Map, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

import { SubjectInput } from "@/types/types.subjects";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import EditSubjectForm from "./EditSubjectForm";
import SubjectCounts from "./SubjectBadges";
import SubjectPageLoading from "./SubjectPageLoading";
import { ShareSubjectButton } from "./ShareSubjectButton";
import { useDashboardStore } from "@/store/useDashboardStore";
import RoadmapInfoDialog from "./RoadmapInfoCard";
import RoadmapContentBlock from "./RoadmapContentBlock";
import ChapterList from "./ChapterList";
import SubjectViewDialog from "./SubjectViewDialog";


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
        updateRoadmapContent,
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
    const [viewRoadmapMode, setViewRoadmapMode] = useState(false);

    const [openRoadmap, setOpenRoadmap] = useState(false);
    const [openView, setOpenView] = useState(false);

    useEffect(() => {
        fetchSubjectById(subjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            { label: `${selectedSubject?.title ?? '-'}`, href: `/subjects/${selectedSubject?._id}` },
        ]);
    }, [selectedRoadmap, selectedSubject, setBreadcrumbs]);

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
        <>
            <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-white space-y-10 rounded-2xl">
                {/* --- Top Right Action Buttons --- */}
                <nav aria-label="Subject actions" className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpenView(true)}
                            aria-label="View"
                            className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setOpenRoadmap(true)}
                            aria-label="Open roadmap"
                            className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <Map className="h-4 w-4" />
                            <span>Roadmap</span>
                        </Button>

                        {selectedRoadmap?._id && (
                            <Link href={`/subjects/${subjectId}/chapters`}>
                                <Button
                                    variant="outline"
                                    aria-label="View chapters"
                                    className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    <span>Chapters</span>
                                </Button>
                            </Link>
                        )}

                        {selectedRoadmap?._id && (
                            <Button
                                variant="outline"
                                onClick={() => setViewRoadmapMode(prev => !prev)}
                                aria-label="Edit roadmap"
                                className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                            >
                                <Pencil className="h-4 w-4" />
                                <span>Edit Roadmap</span>
                            </Button>
                        )}

                        <Link href={`/subjects/${subjectId}/study-materials`}>
                            <Button
                                variant="outline"
                                aria-label="View study materials"
                                className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Study Materials</span>
                            </Button>
                        </Link>

                        <Link href={`/subjects/${subjectId}/external-links`}>
                            <Button
                                variant="outline"
                                aria-label="View external links"
                                className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span>External Links</span>
                            </Button>
                        </Link>

                        {/* If ShareSubjectButton doesn't accept className, wrap it */}
                        <div className="w-full sm:w-auto">
                            <ShareSubjectButton subjectId={subjectId} />
                        </div>
                    </div>
                </nav>


                {(selectedRoadmap?._id && viewRoadmapMode) && (
                    <RoadmapContentBlock
                        roadmapContent={roadmapContent}
                        setRoadmapContent={setRoadmapContent}
                        handleSaveContent={handleSaveContent}
                    />
                )}

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



            </div>

            {/* Dialog with form */}
            <RoadmapInfoDialog
                open={openRoadmap}
                onOpenChange={setOpenRoadmap}
                roadmapTitle={roadmapTitle}
                setRoadmapTitle={setRoadmapTitle}
                roadmapDescription={roadmapDescription}
                setRoadmapDescription={setRoadmapDescription}
                handleRoadmapSave={handleRoadmapSave}
                loading={loadingSubCrud}
                showDelete={!!selectedRoadmap}
                onDeleteRoadmap={handleDeleteRoadmap}
                loadingDelete={loadingSubCrud}
            />

            <SubjectViewDialog
                open={openView}
                onOpenChange={(s: boolean) => setOpenView(s)}
                className="-mt-4"
            />
        </>
    );
};

export default SubjectPage;
