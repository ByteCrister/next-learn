import { TStudyMaterial } from "@/types/types.chapter";
import api from "./api.client";

const BASE_URL = '/chapters';

export async function createChapter(input: { title: string, roadmapId: string, }) {
    try {
        const { data } = await api.post(`${BASE_URL}`, input);
        return data;
    } catch (err) {
        console.error("createChapter error:", err);
        return { message: "Failed to create chapter" };
    }
}

export async function updateChapter(
    updates: {
        roadmapId: string,
        chapterId: string,
        field: 'title' | 'content' | 'materials',
        data: string | string[] | TStudyMaterial,
    }
) {
    try {
        const { data } = await api.patch(
            `${BASE_URL}`,
            updates
        );
        return data;
    } catch (err) {
        console.error("updateChapter error:", err);
        return { message: "Failed to update chapter" };
    }
}

export async function fetchChapters(roadmapId: string) {
    try {
        const { data } = await api.get(`${BASE_URL}?roadmapId=${roadmapId}`);
        return data;
    } catch (err) {
        console.error("fetchChapters error:", err);
        return { message: "Failed to fetch chapters" };
    }
}

export async function deleteChapter(roadmapId: string, chapterId: string) {
    try {
        const { data } = await api.delete(`${BASE_URL}`, {
            data: { roadmapId, chapterId }
        });
        return data;
    } catch (err) {
        console.error("deleteChapter error:", err);
        return { message: "Failed to delete chapter" };
    }
}
