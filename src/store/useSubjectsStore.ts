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
    subjectCache: Record<string, { subject: Subject; roadmap: VCourseRoadmap | null }>;

    selectedSubject: Subject | null;
    selectedRoadmap: VCourseRoadmap | null;
    loadingSelectedSubject: boolean;

    // * Total counts for all subjects
    subjectCounts: SubjectCounts;
    updateSubjectCounts: (countFiled: countFiledTypes, options: '+' | '-') => void;
    updateSelectedSubjectCounts: (countFiled: countFiledTypes, options: '+' | '-') => void;

    loadingNotes: boolean;
    loadingExternalLinks: boolean;
    loadingStudyMaterials: boolean;
    loadingSubjects: boolean;

    loadingSubCrud: boolean;
    subjectsFetched: boolean,

    fetchSubjects: () => Promise<void>;
    addSubject: (input: SubjectInput) => Promise<string | false>;
    editSubject: (id: string, updates: Partial<SubjectInput>) => Promise<void>;
    removeSubject: (id: string) => Promise<boolean>;

    fetchSubjectById: (id: string) => Promise<void>;

    createRoadmap: (subjectId: string, input: { title: string; description: string }) => Promise<void>;
    editRoadmap: (updates: { title: string; description: string, roadmapId: string }) => Promise<void>;
    updateRoadmapContent: (roadmapId: string, roadmapContent: string) => Promise<void>;
    deleteRoadmap: (roadmapId: string) => Promise<string | undefined>;
}

export const useSubjectStore = create<SubjectStore>()(
    devtools((set, get) => ({
        subjects: [],
        subjectCounts: { notes: 0, externalLinks: 0, studyMaterials: 0, chapters: 0 },
        selectedSubject: null,
        selectedRoadmap: null,
        subjectCache: {},

        loadingSubjects: false,
        loadingNotes: false,
        loadingExternalLinks: false,
        loadingStudyMaterials: false,

        loadingSubCrud: false,
        subjectsFetched: false,

        fetchSubjects: async () => {
            const { subjectsFetched, subjects } = get();
            if (subjectsFetched && subjects.length > 0) return; // use cache

            set({ loadingSubjects: true });
            try {
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
                    subjectsFetched: true, // mark as fetched
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
                toast.success('Subject updated successfully.')
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
                    return false;
                }
                set((state) => ({
                    subjects: state.subjects.filter((sub) => sub._id !== id),
                    loadingSubCrud: false,
                }));
                return true;
            } catch (err) {
                set({ loadingSubCrud: false });
                toast.error((err as Error).message);
                return false;
            }
        },

        fetchSubjectById: async (id) => {
            const cache = get().subjectCache[id];
            if (cache) {
                set({
                    selectedSubject: cache.subject,
                    selectedRoadmap: cache.roadmap,
                    loadingSelectedSubject: false,
                });
                return;
            }

            set({ loadingSelectedSubject: true });

            try {
                const data = await fetchSubjectById(id);
                if ("message" in data) {
                    toast.error(data.message);
                    set({ loadingSelectedSubject: false });
                    return;
                }

                // Update cache
                set((state) => ({
                    selectedSubject: data.subject,
                    selectedRoadmap: data.roadmap,
                    subjectCache: {
                        ...state.subjectCache,
                        [id]: { subject: data.subject, roadmap: data.roadmap },
                    },
                    loadingSelectedSubject: false,
                }));
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
            set((state) => {
                if (!state.selectedSubject || !state.selectedSubject.selectedSubjectCounts) {
                    return state;
                }
                return {
                    selectedSubject: {
                        ...state.selectedSubject,
                        selectedSubjectCounts: {
                            ...state.selectedSubject.selectedSubjectCounts,
                            [countField]:
                                (state.selectedSubject.selectedSubjectCounts[countField] || 0) +
                                delta,
                        },
                    },
                };
            });
        },
    }))
);
