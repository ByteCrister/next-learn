"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createChapter, updateChapter } from "@/utils/api/api.chapter";
import { toast } from "react-toastify";
import { TStudyMaterial } from "@/types/types.chapter";

interface Chapter {
    _id: string;
    title: string;
    content: string;
    materials: TStudyMaterial[];
}

interface ChapterStore {
    chapters: Chapter[];
    isFetching: boolean;
    loadingCrud: boolean;

    fetchChaptersByRoadmapId: (roadmapId: string) => Promise<void>;
    createChapter: (input: { title: string; roadmapId: string }) => Promise<string | undefined>;
    updateChapter: (updates: {
        roadmapId: string;
        chapterId: string;
        field: 'title' | 'content' | 'materials';
        data: string | TStudyMaterial;
    }) => Promise<void>;
    deleteChapter: (roadmapId: string, chapterId: string) => Promise<void>;
}

export const useChapterStore = create<ChapterStore>()(
    devtools((set, get) => ({
        chapters: [],
        isFetching: false,
        loadingCrud: false,

        fetchChaptersByRoadmapId: async (roadmapId) => {
            set({ isFetching: true });
            try {
                // implement fetch logic if needed, e.g.:
                // const chapters = await fetchChaptersApi(roadmapId);
                // set({ chapters, loading: false });
            } catch (err) {
                toast.error((err as Error).message);
                set({ isFetching: false });
            }
        },

        createChapter: async (input) => {
            set({ loadingCrud: true });
            try {
                const data = await createChapter(input);
                if ("message" in data) {
                    toast.error(data.message);
                    set({ loadingCrud: false });
                    return;
                }
                set((state) => ({
                    chapters: [...state.chapters, data],
                    loadingCrud: false,
                }));
                return data._id;
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingCrud: false });
            }
        },

        updateChapter: async ({ roadmapId, chapterId, field, data }) => {
            set({ loadingCrud: true });
            try {
                const updatedChapter = await updateChapter({ roadmapId, chapterId, field, data });
                if ("message" in updatedChapter) {
                    toast.error(updatedChapter.message);
                    set({ loadingCrud: false });
                    return;
                }
                set((state) => ({
                    chapters: state.chapters.map((ch) =>
                        ch._id === chapterId ? updatedChapter : ch
                    ),
                    loadingCrud: false,
                }));
            } catch (err) {
                toast.error((err as Error).message);
                set({ loadingCrud: false });
            }
        },

        // ! not created yet
        // deleteChapter: async (roadmapId, chapterId) => {
        //     set({ loadingCrud: true });
        //     try {
        //         await deleteChapter(roadmapId, chapterId);
        //         set((state) => ({
        //             chapters: state.chapters.filter(ch => ch._id !== chapterId),
        //             loadingCrud: false,
        //         }));
        //         toast.success("Chapter deleted");
        //     } catch (err) {
        //         toast.error((err as Error).message);
        //         set({ loadingCrud: false });
        //     }
        // }
    }))
);
