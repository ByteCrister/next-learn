"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    fetchSubjectById,
} from "@/utils/api/api.subjects";
import { toast } from "react-toastify";
import { Subject, SubjectCounts, SubjectInput } from "@/types/types.subjects";
import { VCourseRoadmap } from "@/types/types.roadmap";
import { createRoadmap, deleteRoadmap, updateRoadmap, updateRoadmapContent } from "@/utils/api/api.roadmap";

type countFiledTypes = 'notes' | 'externalLinks' | 'studyMaterials';

interface SubjectStore {
    subjects: Subject[];

    selectedSubject: Subject | null;
    selectedRoadmap: VCourseRoadmap | null;
    loadingSelectedSubject: boolean;

    subjectCounts: SubjectCounts;
    updateSubjectCounts: (countFiled: countFiledTypes, options: '+' | '-') => void;
    updateSelectedSubjectCounts: (countFiled: countFiledTypes, options: '+' | '-') => void;

    loadingNotes: boolean;
    loadingExternalLinks: boolean;
    loadingStudyMaterials: boolean;
    loadingSubjects: boolean;

    loadingSubCrud: boolean;

    fetchSubjects: () => Promise<void>;
    addSubject: (input: SubjectInput) => Promise<string | false>;
    editSubject: (id: string, updates: Partial<SubjectInput>) => Promise<void>;
    removeSubject: (id: string) => Promise<void>;

    fetchSubjectById: (id: string) => Promise<void>;

    createRoadmap: (subjectId: string, input: { title: string; description: string }) => Promise<void>;
    editRoadmap: (updates: { title: string; description: string, roadmapId: string }) => Promise<void>;
    deleteRoadmap: (roadmapId: string) => Promise<string | undefined>;
}

export const useSubjectStore = create<SubjectStore>()(
    devtools((set, get) => ({
        subjects: [],
        subjectCounts: { notes: 0, externalLinks: 0, studyMaterials: 0 },
        selectedSubject: null,

        loadingSubjects: false,
        loadingNotes: false,
        loadingExternalLinks: false,
        loadingStudyMaterials: false,

        loadingSubCrud: false,

        fetchSubjects: async () => {
            set({ loadingSubjects: true });
            try {
                //  API now returns { subjects, subjectCounts }
                const data = (await getAllSubjects()) as
                    | { subjects: Subject[]; subjectCounts: SubjectCounts }
                    | { message: string };

                if ("message" in data) {
                    set({ loadingSubjects: false });
                    toast.error(data.message);
                    return;
                }

                set({
                    subjects: data.subjects,
                    subjectCounts: data.subjectCounts,
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
            const cache = get().selectedSubject?._id?.toString() === id.toString();
            if (!cache) {
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
                set({
                    selectedRoadmap: data,
                    loadingSubCrud: false
                });
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

        editRoadmap: async (updates) => {
            set({ loadingSubCrud: true });
            try {
                const data = await updateRoadmap(updates);
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

        updateRoadmapContent: async (roadmapId: string, roadmapContent: string) => {
            set({ loadingSubCrud: true });
            try {
                const data = await updateRoadmapContent(roadmapId, roadmapContent);;
                if ("message" in data) {
                    set({ loadingSubCrud: false });
                    toast.error(data.message);
                    return;
                }
                set({
                    selectedRoadmap: data,
                    loadingSubCrud: false
                });
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
            }
        },

        deleteRoadmap: async (roadmapId: string) => {
            set({ loadingSubCrud: true });
            try {
                const res = await deleteRoadmap(roadmapId);
                if ("message" in res && res.message !== "Deleted successfully") {
                    toast.error(res.message);
                    set({ loadingSubCrud: false });
                    return;
                }
                set({ selectedRoadmap: null, loadingSubCrud: false });
                toast.success("Roadmap deleted successfully");
                return roadmapId;
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingSubCrud: false });
            }
        },

        updateSubjectCounts: (countFiled, options) => {
            const newCount = options === '+' ? 1 : -1;
            set((state) => ({
                subjectCounts: {
                    ...state.subjectCounts,
                    [countFiled]: state.subjectCounts[countFiled] + newCount,
                },
            }))
        },

        updateSelectedSubjectCounts: (countField: keyof SubjectCounts, op: "+" | "-") => {
            const delta = op === "+" ? 1 : -1;
            set((state) => ({
                selectedSubject: {
                    ...state.selectedSubject!,
                    selectedSubjectCounts: {
                        ...state.selectedSubject!.selectedSubjectCounts!,
                        [countField]:
                            (state.selectedSubject!.selectedSubjectCounts![countField] || 0) +
                            delta,
                    },
                },
            }));
        },
    }))
);
