"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "react-toastify";
import { SubjectNote, SubjectNoteInput } from "@/types/types.subjectnote";
import { useSubjectStore } from "./useSubjectsStore";
import { getNotesBySubjectId, createNote, updateNote, deleteNote } from "@/utils/api/api.subjectnotes";

type countFieldTypes = 'notes';

interface SubjectNoteStore {
    notes: SubjectNote[];
    selectedNote: SubjectNote | null;
    currentSubjectId: string | null;
    loadingNotes: boolean;
    loadingNoteCrud: boolean;
    currentPage: number;
    totalPages: number;
    totalNotes: number;

    fetchNotesBySubjectId: (subjectId: string, page?: number) => Promise<void>;
    createNote: (subjectId: string, input: SubjectNoteInput) => Promise<string | false>;
    updateNote: (noteId: string, input: Partial<SubjectNoteInput>) => Promise<void>;
    deleteNote: (noteId: string) => Promise<boolean>;
    setSelectedNote: (note: SubjectNote | null) => void;
    setCurrentPage: (page: number) => void;
}

export const useSubjectNoteStore = create<SubjectNoteStore>()(
    devtools((set, get) => ({
        notes: [],
        selectedNote: null,
        currentSubjectId: null,
        loadingNotes: false,
        loadingNoteCrud: false,
        currentPage: 1,
        totalPages: 0,
        totalNotes: 0,

        fetchNotesBySubjectId: async (subjectId: string, page: number = 1) => {
            if (!subjectId) {
                set({ loadingNotes: false });
                return;
            }
            set({ loadingNotes: true, currentSubjectId: subjectId, currentPage: page });
            try {
                const data = await getNotesBySubjectId(subjectId, page);
                if ("message" in data) {
                    toast.error(data.message);
                    set({ loadingNotes: false });
                    return;
                }
                set({
                    notes: data.notes || [],
                    totalNotes: data.total || 0,
                    totalPages: data.totalPages || 0,
                    currentPage: data.page || 1,
                    loadingNotes: false
                });
            } catch (err) {
                set({ loadingNotes: false });
                toast.error((err as Error).message);
            }
        },

        createNote: async (subjectId: string, input: SubjectNoteInput) => {
            set({ loadingNoteCrud: true });
            try {
                const data = await createNote(subjectId, input);
                if ("message" in data) {
                    set({ loadingNoteCrud: false });
                    toast.error(data.message);
                    return false;
                }
                set({ loadingNoteCrud: false });
                // Update subject counts
                const subjectStore = useSubjectStore.getState();
                subjectStore.updateSubjectCounts('notes', '+');
                subjectStore.updateSelectedSubjectCounts('notes', '+');
                toast.success("Note created successfully.");
                // Refetch current page
                const { currentPage } = get();
                await get().fetchNotesBySubjectId(subjectId, currentPage || 1);
                return data._id;
            } catch (err) {
                set({ loadingNoteCrud: false });
                toast.error((err as Error).message);
                return false;
            }
        },

        updateNote: async (noteId: string, input: Partial<SubjectNoteInput>) => {
            const { currentSubjectId } = get();
            if (!currentSubjectId) {
                toast.error("No subject selected for notes.");
                return;
            }
            set({ loadingNoteCrud: true });
            try {
                const data = await updateNote(currentSubjectId, noteId, input);
                if ("message" in data) {
                    set({ loadingNoteCrud: false });
                    toast.error(data.message);
                    return;
                }
                set({ loadingNoteCrud: false });
                set({ selectedNote: data });
                toast.success("Note updated successfully.");
                // Refetch current page
                const { currentPage } = get();
                await get().fetchNotesBySubjectId(currentSubjectId, currentPage);
            } catch (err) {
                set({ loadingNoteCrud: false });
                toast.error((err as Error).message);
            }
        },

        deleteNote: async (noteId: string) => {
            const { currentSubjectId } = get();
            if (!currentSubjectId) {
                toast.error("No subject selected for notes.");
                return false;
            }
            set({ loadingNoteCrud: true });
            try {
                const res = await deleteNote(currentSubjectId, noteId);
                if ("message" in res && res.message !== "Deleted successfully") {
                    set({ loadingNoteCrud: false });
                    toast.error(res.message);
                    return false;
                }
                set({ loadingNoteCrud: false });
                // Update subject counts
                const subjectStore = useSubjectStore.getState();
                subjectStore.updateSubjectCounts('notes', '-');
                subjectStore.updateSelectedSubjectCounts('notes', '-');
                toast.success("Note deleted successfully.");
                // Refetch current page
                const { currentPage } = get();
                await get().fetchNotesBySubjectId(currentSubjectId, currentPage);
                return true;
            } catch (err) {
                set({ loadingNoteCrud: false });
                toast.error((err as Error).message);
                return false;
            }
        },

        setSelectedNote: (note) => set({ selectedNote: note }),

        setCurrentPage: (page: number) => {
            const { currentSubjectId } = get();
            if (currentSubjectId) {
                get().fetchNotesBySubjectId(currentSubjectId, page);
            }
        },
    }))
);
