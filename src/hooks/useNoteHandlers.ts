import { useEffect, useState, useMemo } from "react";
import { useSubjectNoteStore } from "@/store/useSubjectNoteStore";
import { SubjectNote } from "@/types/types.subjectnote";

interface UseNoteHandlersProps {
    subjectId: string;
}

export const useNoteHandlers = ({ subjectId }: UseNoteHandlersProps) => {
    const { notes, loadingNotes, fetchNotesBySubjectId, setSelectedNote, currentPage, totalPages, setCurrentPage } = useSubjectNoteStore();
    const safeNotes = notes || [];
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedViewNote, setSelectedViewNote] = useState<SubjectNote | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewedNotes, setViewedNotes] = useState<string[]>([]);

    useEffect(() => {
        if (!subjectId) return;
        fetchNotesBySubjectId(subjectId);
    }, [subjectId, fetchNotesBySubjectId]);

    useEffect(() => {
        const viewed = localStorage.getItem('viewedNotes');
        if (viewed) {
            setViewedNotes(JSON.parse(viewed));
        }
    }, []);

    // Filter and sort notes
    const filteredAndSortedNotes = useMemo(() => {
        let filtered = safeNotes.filter(note =>
            note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content?.replace(/<[^>]*>/g, '').toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [safeNotes, searchQuery, sortOrder]);

    const handleCreateNew = () => {
        setSelectedNote(null); // Clear selected note for new
        setIsEditorOpen(true);
    };

    const handleEdit = (note: SubjectNote) => {
        setSelectedNote(note);
        setIsEditorOpen(true);
    };

    const handleView = (note: SubjectNote) => {
        setSelectedViewNote(note);
        setIsViewOpen(true);
        if (!viewedNotes.includes(note._id)) {
            const updatedViewed = [...viewedNotes, note._id];
            setViewedNotes(updatedViewed);
            localStorage.setItem('viewedNotes', JSON.stringify(updatedViewed));
        }
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
    };

    const handleCloseView = () => {
        setIsViewOpen(false);
    };

    return {
        notes: safeNotes,
        loadingNotes,
        filteredAndSortedNotes,
        isEditorOpen,
        setIsEditorOpen,
        isViewOpen,
        setIsViewOpen,
        selectedViewNote,
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        currentPage,
        totalPages,
        setCurrentPage,
        viewedNotes,
        handleCreateNew,
        handleEdit,
        handleView,
        handleCloseEditor,
        handleCloseView
    };
};
