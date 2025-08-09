"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    fetchSubjectById,
    updateRoadmap,
    createRoadmap,
} from "@/utils/api/api.subjects";
import { toast } from "react-toastify";
import { Subject, SubjectCounts, SubjectInput } from "@/types/types.subjects";
import { VCourseRoadmap } from "@/types/types.roadmap";

interface SubjectStore {
    subjects: Subject[];
    notes: [];
    externalLinks: [];
    studyMaterials: [];

    selectedSubject: Subject | null;
    selectedRoadmap: VCourseRoadmap | null;
    loadingSelectedSubject: boolean;

    counts: SubjectCounts;

    loadingNotes: boolean;
    loadingExternalLinks: boolean;
    loadingStudyMaterials: boolean;
    loadingSubjects: boolean;

    loadingSubCrud: boolean;

    fetchSubjects: () => Promise<void>;
    addSubject: (input: SubjectInput) => Promise<string | false>;
    editSubject: (id: string, updates: Partial<SubjectInput>) => Promise<void>;
    removeSubject: (id: string) => Promise<void>;

    createRoadmap: (subjectId: string, input: { title: string; description: string }) => Promise<void>;
    editRoadmap: (roadmapId: string, updates: { title: string; description: string }) => Promise<void>;

    fetchSubjectById: (id: string) => Promise<void>;

}

export const useSubjectStore = create<SubjectStore>()(
    devtools((set) => ({
        subjects: [],
        counts: { notes: 0, externalLinks: 0, studyMaterials: 0 },
        loadingSubjects: false,
        loadingSubCrud: false,

        fetchSubjects: async () => {
            set({ loadingSubjects: true });
            try {
                // your API now returns { subjects, counts }
                const data = (await getAllSubjects()) as
                    | { subjects: Subject[]; counts: SubjectCounts }
                    | { message: string };

                if ("message" in data) {
                    set({ loadingSubjects: false });
                    toast.error(data.message);
                    return;
                }

                set({
                    subjects: data.subjects,
                    counts: data.counts,
                    loadingSubjects: false,
                });
            } catch (err) {
                set({ loadingSubjects: false });
                toast.error((err as Error).message);
            }
        },

        addSubject: async (input) => {
            set({ loadingSubCrud: true });
            try {
                const data = await createSubject(input);
                if ("message" in data) {
                    set({ loadingSubCrud: false });
                    toast.error(data.message);
                    return false;
                }
                set((state) => ({
                    subjects: [data, ...state.subjects],
                    loadingSubCrud: false,
                }));
                return data._id;
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
                return false;
            }
        },

        editSubject: async (id, updates) => {
            set({ loadingSubCrud: true });
            try {
                const data = await updateSubject(id, updates);
                if ("message" in data) {
                    set({ loadingSubCrud: false });
                    toast.error(data.message);
                    return;
                }
                set((state) => ({
                    subjects: state.subjects.map((sub) =>
                        sub._id === id ? data : sub
                    ),
                    loadingSubCrud: false,
                }));
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

        removeSubject: async (id) => {
            set({ loadingSubCrud: true });
            try {
                const res = await deleteSubject(id);
                if ("message" in res && res.message !== "Deleted successfully") {
                    set({ loadingSubCrud: false });
                    toast.error(res.message);
                    return;
                }
                set((state) => ({
                    subjects: state.subjects.filter((sub) => sub._id !== id),
                    loadingSubCrud: false,
                }));
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

        fetchSubjectById: async (id) => {
            set({ loadingSelectedSubject: true });
            try {
                const data = await fetchSubjectById(id);
                if ("message" in data) {
                    toast.error(data.message);
                    set({ loadingSelectedSubject: false });
                    return;
                }
                set({
                    selectedSubject: data.subject,
                    selectedRoadmap: data.roadmap,
                    loadingSelectedSubject: false,
                });
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingSelectedSubject: false });
            }
        },

        createRoadmap: async (subjectId, input) => {
            set({ loadingSubCrud: true });
            try {
                const data = await createRoadmap(subjectId, input);
                if ("message" in data) {
                    set({ loadingSubCrud: false });
                    toast.error(data.message);
                    return;
                }
                // Optionally update state here if needed (e.g., refresh roadmap)
                set({ loadingSubCrud: false });
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

        editRoadmap: async (roadmapId, updates) => {
            set({ loadingSubCrud: true });
            try {
                const data = await updateRoadmap(roadmapId, updates);
                if ("message" in data) {
                    set({ loadingSubCrud: false });
                    toast.error(data.message);
                    return;
                }
                // Optionally update state here if needed (e.g., refresh roadmap)
                set({ loadingSubCrud: false });
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

    }))
);
