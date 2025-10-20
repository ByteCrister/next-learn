"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IExternalLink, LinkCategory } from "@/models/ExternalLink";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import ExternalLinkCard from "./ExternalLinkCard";
import ExternalLinkPaginationControls from "./ExternalLinkPaginationControls";
import ExternalLinkForm from "./ExternalLinkForm";
import { useExternalLinkHandlers } from "@/hooks/useExternalLinkHandlers";

interface ExternalLinkListProps {
    subjectId?: string;
    searchTerm?: string;
    categoryFilter?: "all" | LinkCategory;
    sortBy?: "title" | "category" | "date";
    sortOrder?: "asc" | "desc";
    viewMode?: "list" | "grid";
}

export default function ExternalLinkList({
    subjectId,
    searchTerm = "",
    categoryFilter = "all",
    sortBy = "title",
    sortOrder = "asc",
    viewMode = "grid"
}: ExternalLinkListProps) {
    const {
        externalLinks,
        loading,
        editingLink,
        setEditingLink,
        viewingLink,
        setViewingLink,
        currentPage,
        setCurrentPage,
        openForm,
        setOpenForm,
        viewedExternalLinks,
        searchTerm: hookSearchTerm,
        setSearchTerm,
        categoryFilter: hookCategoryFilter,
        setCategoryFilter,
        sortBy: hookSortBy,
        setSortBy,
        sortOrder: hookSortOrder,
        setSortOrder,
        viewMode: hookViewMode,
        setViewMode,
        filteredLinks,
        sortedLinks,
        paginatedLinks,
        totalPages,
        getPageNumbers,
        handleEdit,
        handleView,
        handleShare,
        handleDelete,
        handleFormSubmit,
    } = useExternalLinkHandlers({ subjectId });

    // Use props if provided, else use hook state
    const effectiveSearchTerm = searchTerm || hookSearchTerm;
    const effectiveCategoryFilter = categoryFilter || hookCategoryFilter;
    const effectiveSortBy = sortBy || hookSortBy;
    const effectiveSortOrder = sortOrder || hookSortOrder;
    const effectiveViewMode = viewMode || hookViewMode;

    // Update hook state if props change
    useEffect(() => {
        if (searchTerm !== hookSearchTerm) setSearchTerm(searchTerm);
    }, [searchTerm, hookSearchTerm, setSearchTerm]);

    useEffect(() => {
        if (categoryFilter !== hookCategoryFilter) setCategoryFilter(categoryFilter);
    }, [categoryFilter, hookCategoryFilter, setCategoryFilter]);

    useEffect(() => {
        if (sortBy !== hookSortBy) setSortBy(sortBy);
    }, [sortBy, hookSortBy, setSortBy]);

    useEffect(() => {
        if (sortOrder !== hookSortOrder) setSortOrder(sortOrder);
    }, [sortOrder, hookSortOrder, setSortOrder]);

    useEffect(() => {
        if (viewMode !== hookViewMode) setViewMode(viewMode);
    }, [viewMode, hookViewMode, setViewMode]);

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

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <div className="w-full">
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {sortedLinks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center py-16 text-gray-500 ${viewMode === "grid" ? "col-span-full" : ""}`}
                    >
                        <div className="relative">
                            <ExternalLinkIcon className="mx-auto h-20 w-20 mb-6 text-gray-300" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-20"></div>
                        </div>
                        <p className="text-2xl font-semibold text-gray-700 mb-2">No external links yet</p>
                        <p className="text-gray-500 max-w-md mx-auto">Start building your collection of valuable resources by adding your first external link!</p>
                    </motion.div>
                ) : (
                    paginatedLinks.map((link, index) => (
                        <ExternalLinkCard
                            key={(link._id as string)}
                            link={link}
                            viewedExternalLinks={viewedExternalLinks}
                            onView={handleView}
                            onEdit={handleEdit}
                            onShare={handleShare}
                            onDelete={handleDelete}
                            buttonVariants={buttonVariants}
                            index={index}
                        />
                    ))
                )}
            </div>
            {totalPages > 1 && (
                <ExternalLinkPaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    getPageNumbers={getPageNumbers}
                    setCurrentPage={setCurrentPage}
                    buttonVariants={buttonVariants}
                />
            )}

            <ExternalLinkForm
                open={openForm}
                onOpenChange={setOpenForm}
                editingLink={editingLink}
                subjectId={subjectId}
                onSubmit={handleFormSubmit}
                loading={loading}
                existingLinks={externalLinks}
            />
        </div>
    );
}
