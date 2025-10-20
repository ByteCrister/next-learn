"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { StudyMaterial, CreateStudyMaterialInput, UpdateStudyMaterialInput } from "@/types/types.studymaterials";
import { toast } from "react-toastify";

interface StudyMaterialStore {
    studyMaterials: StudyMaterial[];
    loading: boolean;
    loadingCrud: boolean;

    fetchStudyMaterials: (subjectId?: string, roadmapId?: string) => Promise<void>;
    createStudyMaterial: (input: CreateStudyMaterialInput) => Promise<void>;
    updateStudyMaterial: (id: string, updates: UpdateStudyMaterialInput) => Promise<void>;
    deleteStudyMaterial: (id: string) => Promise<void>;
}

export const useStudyMaterialStore = create<StudyMaterialStore>()(
    devtools((set, get) => ({
        studyMaterials: [],
        loading: false,
        loadingCrud: false,

        fetchStudyMaterials: async (subjectId, roadmapId) => {
            set({ loading: true });
            try {
                const params = new URLSearchParams();
                if (subjectId) params.append("subjectId", subjectId);
                if (roadmapId) params.append("roadmapId", roadmapId);

                const response = await fetch(`/api/study-materials?${params.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message);
                    set({ loading: false });
                    return;
                }

                set({ studyMaterials: data, loading: false });
            } catch (err) {
                toast.error((err as Error).message);
                set({ loading: false });
            }
        },

        createStudyMaterial: async (input) => {
            set({ loadingCrud: true });
            try {
                const response = await fetch("/api/study-materials", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(input),
                });
                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message);
                    set({ loadingCrud: false });
                    return;
                }

                set((state) => ({
                    studyMaterials: [data, ...state.studyMaterials],
                    loadingCrud: false,
                }));
                toast.success("Study material created successfully");
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingCrud: false });
            }
        },

        updateStudyMaterial: async (id, updates) => {
            set({ loadingCrud: true });
            try {
                const response = await fetch(`/api/study-materials/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });
                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message);
                    set({ loadingCrud: false });
                    return;
                }

                set((state) => ({
                    studyMaterials: state.studyMaterials.map((sm) =>
                        sm._id === id ? data : sm
                    ),
                    loadingCrud: false,
                }));
                toast.success("Study material updated successfully");
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingCrud: false });
            }
        },

        deleteStudyMaterial: async (id) => {
            set({ loadingCrud: true });
            try {
                const response = await fetch(`/api/study-materials/${id}`, {
                    method: "DELETE",
                });
                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message);
                    set({ loadingCrud: false });
                    return;
                }

                set((state) => ({
                    studyMaterials: state.studyMaterials.filter((sm) => sm._id !== id),
                    loadingCrud: false,
                }));
                toast.success("Study material deleted successfully");
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingCrud: false });
            }
        },
    }))
);
