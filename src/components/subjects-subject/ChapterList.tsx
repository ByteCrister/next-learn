"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useChapterStore } from "@/store/useChapterStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, X, Check, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { encodeId } from "@/utils/helpers/IdConversion";

interface ChapterListProps {
    roadmapId: string;
    subjectId: string;
}

export default function ChapterList({ roadmapId, subjectId }: ChapterListProps) {
    const { chapters, isFetching, fetchChaptersByRoadmapId, createChapter, loadingCrud, deleteChapter } = useChapterStore();
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
    const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3x3 grid

    useEffect(() => {
        if (roadmapId) {
            fetchChaptersByRoadmapId(roadmapId);
        }
    }, [roadmapId, fetchChaptersByRoadmapId]);

    const handleAddChapter = async () => {
        if (!newChapterTitle.trim()) return;

        // Check for duplicate title
        const existingChapter = chapters.find((ch) =>
            ch.title.toLowerCase().trim() === newChapterTitle.toLowerCase().trim()
        );

        if (existingChapter) {
            toast.error(`A chapter with the title "${newChapterTitle.trim()}" already exists. Please choose a different title.`);
            return;
        }

        const chapterId = await createChapter({
            title: newChapterTitle.trim(),
            roadmapId
        });

        if (chapterId) {
            setNewChapterTitle("");
            setIsAddingChapter(false);
        }
    };

    const handleCancelAdd = () => {
        setNewChapterTitle("");
        setIsAddingChapter(false);
    };

    // Filter and sort chapters
    const filteredAndSortedChapters = useMemo(() => {
        let filtered = chapters;

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = chapters.filter((chapter) =>
                chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort chapters
        if (sortOrder !== 'none') {
            filtered = [...filtered].sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();

                if (sortOrder === 'asc') {
                    return titleA.localeCompare(titleB);
                } else {
                    return titleB.localeCompare(titleA);
                }
            });
        }

        return filtered;
    }, [chapters, searchTerm, sortOrder]);

    // Paginate chapters
    const paginatedChapters = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedChapters.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedChapters, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedChapters.length / itemsPerPage);

    // Reset to page 1 when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOrder]);

    const handleSortToggle = () => {
        if (sortOrder === 'none') {
            setSortOrder('asc');
        } else if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else {
            setSortOrder('none');
        }
    };

    const handleDeleteClick = (chapterId: string) => {
        setChapterToDelete(chapterId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (chapterToDelete && roadmapId) {
            await deleteChapter(roadmapId, chapterToDelete);
            setIsDeleteDialogOpen(false);
            setChapterToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setChapterToDelete(null);
    };

    if (isFetching) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-3">
                            <Skeleton className="h-6 w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-1/4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-12 rounded" />
                                    <Skeleton className="h-6 w-12 rounded" />
                                    <Skeleton className="h-6 w-12 rounded" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chapters</h2>
                    {!isAddingChapter ? (
                        <Button
                            onClick={() => setIsAddingChapter(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                            <Plus className="h-5 w-5" />
                            Add Chapter
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3 animate-in slide-in-from-right-5 duration-300">
                            <Input
                                placeholder="Enter chapter title..."
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                className="w-64 h-12 text-lg"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddChapter();
                                    if (e.key === 'Escape') handleCancelAdd();
                                }}
                                autoFocus
                            />
                            {loadingCrud && (
                                <div className="flex items-center">
                                    <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                                </div>
                            )}
                            <Button
                                size="lg"
                                onClick={handleAddChapter}
                                disabled={!newChapterTitle.trim() || loadingCrud}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Check className="h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleCancelAdd}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Sort Section */}
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Search chapters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSortToggle}
                        className="flex items-center gap-2 whitespace-nowrap h-10 px-4"
                    >
                        {sortOrder === 'none' && <ArrowUpDown className="h-4 w-4" />}
                        {sortOrder === 'asc' && <ArrowUp className="h-4 w-4" />}
                        {sortOrder === 'desc' && <ArrowDown className="h-4 w-4" />}
                        <span>
                            {sortOrder === 'none' && 'Sort'}
                            {sortOrder === 'asc' && 'A-Z'}
                            {sortOrder === 'desc' && 'Z-A'}
                        </span>
                    </Button>
                </div>
            </div>

            {chapters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No chapters found. Create your first chapter to get started.</p>
                </div>
            ) : filteredAndSortedChapters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No chapters match your search criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedChapters.map((chapter, index) => (
                        <Card
                            key={chapter._id}
                            className="group hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-gray-500 dark:from-gray-800 dark:to-gray-900 animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                                        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {chapter.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${chapter.content ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            {chapter.content ? "Content available" : "No content yet"}
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Link
                                            href={`/subjects/${encodeId(encodeURIComponent(subjectId))}/chapters/${encodeId(encodeURIComponent(chapter._id))}?mode=view`}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-md"
                                        >
                                            <Eye className="h-3 w-3" />
                                            
                                        </Link>
                                        <Link
                                            href={`/subjects/${encodeId(encodeURIComponent(subjectId))}/chapters/${encodeId(encodeURIComponent(chapter._id))}`}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md"
                                        >
                                            <Edit className="h-3 w-3" />

                                        </Link>
                                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 transition-all duration-200 hover:scale-105"
                                                    onClick={() => handleDeleteClick(chapter._id!)}
                                                    disabled={loadingCrud}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete &quot;{chapters.find(ch => ch._id === chapterToDelete)?.title}&quot;?
                                                        This action cannot be undone and will permanently remove the chapter and all its content.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleConfirmDelete}
                                                        className="bg-red-600 hover:bg-red-700"
                                                        disabled={loadingCrud}
                                                    >
                                                        {loadingCrud ? 'Deleting...' : 'Delete'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        </div>
                                    </div>
                                        <div className="text-xs text-gray-700 dark:text-gray-400">
                                            Created: {chapter.createdAt ? new Date(chapter.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                        </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10 h-10 p-0"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
