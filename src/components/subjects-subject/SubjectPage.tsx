"use client";

import { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/useSubjectsStore";
import {
    FaBook,
    FaLink,
    FaStickyNote,
    FaListUl,
    FaEdit,
    FaTrash,
    FaSave,
    FaPenFancy,
    FaCode,
    FaAlignLeft,
} from "react-icons/fa";
import RoadmapViewer from "@/components/subjects-subject/RoadmapViewer";
import CountBadge from "@/components/subjects-subject/CountBadge";
import { Subject } from "@/types/types.subjects";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/roadmap-viewer.module.css";
import TipTapEditor from "../Editor/TipTapEditor";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import SubjectPageSkeleton from "./SubjectPageSkeleton";
import ShareButton from "./ShareButton";

const SubjectPage = ({ subjectId }: { subjectId: string }) => {
    const {
        selectedSubject,
        selectedRoadmap,
        fetchSubjectById,
        editSubject,
        removeSubject,
        updateRoadmapContent,
        loadingSelectedSubject,
    } = useSubjectStore();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<Subject>>({});
    const [roadmapContent, setRoadmapContent] = useState("");
    const [viewMode, setViewMode] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { setBreadcrumbs } = useBreadcrumbStore();

    useEffect(() => {
        fetchSubjectById(subjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectId]);

    useEffect(() => {
        if (selectedSubject) {
            setFormData({
                title: selectedSubject.title,
                code: selectedSubject.code,
                description: selectedSubject.description,
            });
        }
        if (selectedRoadmap) {
            setRoadmapContent(selectedRoadmap.roadmap);
        }
        setBreadcrumbs([
            { label: "Home", href: "/" },
            { label: "Subjects", href: "/subjects" },
            {
                label: `${selectedSubject?.title ?? "-"}`,
                href: `/subjects/${selectedSubject?._id}`,
            },
        ]);
    }, [selectedSubject, selectedRoadmap, setBreadcrumbs]);

    const handleSaveSubject = async () => {
        // Check if there are changes
        const hasChanges =
            formData.title !== selectedSubject?.title ||
            formData.code !== selectedSubject?.code ||
            formData.description !== selectedSubject?.description;

        if (!hasChanges) {
            // No update, just exit edit mode
            setEditMode(false);
            return;
        }

        // Only call API if something changed
        await editSubject(subjectId, formData);
        setEditMode(false);
    };


    const handleDeleteSubject = async () => {
        await removeSubject(subjectId);
        setShowDeleteModal(false);
    };

    const handleSaveContent = async () => {
        if (!selectedRoadmap?._id) return;
        await updateRoadmapContent(selectedRoadmap._id, roadmapContent);
    };

    if (loadingSelectedSubject) {
        return (
            <SubjectPageSkeleton />
        );
    }

    if (!selectedSubject) {
        return (
            <p className="text-center mt-10 text-red-500 font-semibold">
                Subject not found.
            </p>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 py-10 font-sans"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <AnimatePresence mode="wait">
                    {editMode ? (
                        <motion.input
                            key="edit-title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl sm:text-3xl font-bold border-b-2 border-indigo-300 focus:outline-none px-2 py-1 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent w-full caret-black"
                            value={formData.title || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    ) : (
                        <motion.h1
                            key="view-title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2 w-full"
                        >
                            <FaBook className="text-indigo-500" /> {selectedSubject.title}
                        </motion.h1>
                    )}
                </AnimatePresence>

                {/* Header Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
                    <motion.a
                        href={`/subjects/${subjectId}/read`} // replace with your read page route
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                   bg-gradient-to-r from-green-500 to-teal-600 text-white shadow hover:shadow-lg 
                   transition-all text-sm md:text-base font-semibold"
                    >
                        <FaBook /> Read
                    </motion.a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                            setEditMode(!editMode);
                            if (editMode) {
                                await handleSaveSubject();
                            }
                        }}
                        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                   bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-lg 
                   transition-all text-sm md:text-base font-semibold"
                    >
                        {editMode ? <FaSave /> : <FaEdit />}
                        {editMode ? "Save" : "Edit"}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                   bg-gradient-to-r from-red-500 to-pink-600 text-white shadow hover:shadow-lg 
                   transition-all text-sm md:text-base font-semibold"
                    >
                        <FaTrash /> Delete
                    </motion.button>
                    {/* Share Button */}
                    <ShareButton SubjectId={subjectId} />
                </div>
            </div>

            {/* Subject Code & Description */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <AnimatePresence mode="wait">
                    {editMode ? (
                        <motion.div
                            key="edit-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                <FaCode className="text-indigo-400" />
                                <input
                                    className="flex-1 focus:outline-none px-2 py-1 text-gray-800"
                                    value={formData.code || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, code: e.target.value })
                                    }
                                    placeholder="Subject Code"
                                />
                            </div>

                            <div className="flex items-start gap-2">
                                <FaAlignLeft className="text-indigo-400 mt-2" />
                                <textarea
                                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300"
                                    rows={3}
                                    value={formData.description || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Description..."
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <p className="text-gray-500 font-mono">{selectedSubject.code}</p>
                            <p className="mt-2 text-gray-700 leading-relaxed">
                                {selectedSubject.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Counts */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 },
                    },
                }}
            >
                <CountBadge
                    subjectId={subjectId}
                    icon={<FaStickyNote size={20} />}
                    label="Notes"
                    count={selectedSubject.selectedSubjectCounts?.notes || 0}
                />
                <CountBadge
                    subjectId={subjectId}
                    icon={<FaLink size={20} />}
                    label="External Links"
                    count={selectedSubject.selectedSubjectCounts?.externalLinks || 0}
                />
                <CountBadge
                    subjectId={subjectId}
                    icon={<FaBook size={20} />}
                    label="Study Materials"
                    count={selectedSubject.selectedSubjectCounts?.studyMaterials || 0}
                />
                <CountBadge
                    subjectId={subjectId}
                    icon={<FaListUl size={20} />}
                    label="Chapters"
                    count={selectedSubject.selectedSubjectCounts?.chapters || 0}
                />
            </motion.div>

            {/* Roadmap */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-900">
                        <FaPenFancy className="text-indigo-500" /> Roadmap
                    </h2>

                    {/* Edit Roadmap Button */}
                    {viewMode && (
                        <button
                            onClick={() => setViewMode(false)}
                            className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-all text-sm md:text-base font-semibold"
                        >
                            <FaEdit /> Edit Roadmap
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {viewMode ? (
                        <motion.div
                            key="viewer"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <RoadmapViewer htmlContent={roadmapContent} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <TipTapEditor
                                content={roadmapContent}
                                onChange={setRoadmapContent}
                                handleSave={async () => {
                                    await handleSaveContent();
                                    setViewMode(true);
                                }}
                                handleCancel={() => setViewMode(true)} // toggle back to view mode
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete{" "}
                                <span className="font-bold text-red-500">
                                    {selectedSubject.title}
                                </span>
                                ? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSubject}
                                    className="px-4 py-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SubjectPage;
