"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileType } from "@/types/types.studymaterials";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import StudyMaterialCard from "./StudyMaterialCard";
import EditStudyMaterialDialog from "./EditStudyMaterialDialog";
import ViewStudyMaterialDialog from "./ViewStudyMaterialDialog";
import PaginationControls from "./PaginationControls";
import { useStudyMaterialHandlers } from "@/hooks/useStudyMaterialHandlers";

interface StudyMaterialListProps {
    subjectId?: string;
    roadmapId?: string;
    searchTerm?: string;
    visibilityFilter?: "all" | "public" | "private";
    fileTypeFilter?: "all" | FileType;
    sortBy?: "filename" | "fileType" | "visibility" | "date";
    sortOrder?: "asc" | "desc";
    viewMode?: "list" | "grid";
}

export default function StudyMaterialList({
    subjectId,
    roadmapId,
    searchTerm = "",
    visibilityFilter = "all",
    fileTypeFilter = "all",
    sortBy = "filename",
    sortOrder = "asc",
    viewMode = "list"
}: StudyMaterialListProps) {
    const {
        studyMaterials,
        loading,
        editingMaterial,
        setEditingMaterial,
        viewingMaterial,
        setViewingMaterial,
        isSaving,
        editUploading,
        selectedEditFile,
        setSelectedEditFile,
        currentPage,
        setCurrentPage,
        editForm,
        setEditForm,
        editError,
        viewedMaterials,
        handleEdit,
        handleFileTypeEditChange,
        handleSaveEdit,
        handleView,
        handleShare,
        handleDelete
    } = useStudyMaterialHandlers({ subjectId, roadmapId });

    const [filteredMaterials, setFilteredMaterials] = useState(studyMaterials);
    const [sortedMaterials, setSortedMaterials] = useState(studyMaterials);

    useEffect(() => {
        const filtered = studyMaterials.filter(material => {
            const matchesSearch = !searchTerm ||
                material.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (material.tags && material.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
            const matchesVisibility = visibilityFilter === "all" || material.visibility === visibilityFilter;
            const matchesFileType = fileTypeFilter === "all" || material.fileTypes?.includes(fileTypeFilter);
            return matchesSearch && matchesVisibility && matchesFileType;
        });
        setFilteredMaterials(filtered);
    }, [studyMaterials, searchTerm, visibilityFilter, fileTypeFilter]);

    useEffect(() => {
        const sorted = [...filteredMaterials].sort((a, b) => {
            if (sortBy === "date") {
                const aDate = new Date(a.uploadedAt);
                const bDate = new Date(b.uploadedAt);
                return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
            }
            let aVal: string, bVal: string;
            switch (sortBy) {
                case "filename":
                    aVal = a.filename.toLowerCase();
                    bVal = b.filename.toLowerCase();
                    break;
                case "fileType":
                    aVal = a.fileTypes?.[0] || "";
                    bVal = b.fileTypes?.[0] || "";
                    break;
                case "visibility":
                    aVal = a.visibility;
                    bVal = b.visibility;
                    break;
                default:
                    return 0;
            }
            if (sortOrder === "asc") {
                return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
            } else {
                return bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
            }
        });
        setSortedMaterials(sorted);
    }, [filteredMaterials, sortBy, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, visibilityFilter, fileTypeFilter, sortBy, sortOrder, viewMode]);

    const itemsPerPage = viewMode === "list" ? 3 : 6;
    const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage);
    const paginatedMaterials = sortedMaterials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    if (loading) return (
        <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4" : "space-y-4"}>
                {sortedMaterials.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 text-gray-500 col-span-full"
                    >
                        <FileText className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                        <p className="text-xl font-medium text-gray-600 mb-2">No study materials yet</p>
                        <p className="text-gray-500">Start by uploading your first resource to build your study collection!</p>
                    </motion.div>
                ) : (
                    paginatedMaterials.map((material, index) => (
                        <StudyMaterialCard
                            key={material._id}
                            material={material}
                            viewedMaterials={viewedMaterials}
                            onView={handleView}
                            onEdit={handleEdit}
                            onShare={handleShare}
                            onDelete={handleDelete}
                            buttonVariants={buttonVariants}
                        />
                    ))
                )}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            <EditStudyMaterialDialog
                editingMaterial={editingMaterial}
                setEditingMaterial={setEditingMaterial}
                editForm={editForm}
                setEditForm={setEditForm}
                editError={editError}
                isSaving={isSaving}
                editUploading={editUploading}
                selectedEditFile={selectedEditFile}
                setSelectedEditFile={setSelectedEditFile}
                handleFileTypeEditChange={(value) => handleFileTypeEditChange(value as FileType)}
                handleSaveEdit={handleSaveEdit}
            />
            <ViewStudyMaterialDialog viewingMaterial={viewingMaterial} setViewingMaterial={setViewingMaterial} />
        </div>
    );
}