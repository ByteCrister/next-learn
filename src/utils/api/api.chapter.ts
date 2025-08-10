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
        data: string | TStudyMaterial,
    }
) {
    try {
        const { data } = await api.patch(
            `${BASE_URL}/chapters`,
            updates
        );
        return data;
    } catch (err) {
        console.error("updateChapter error:", err);
        return { message: "Failed to update chapter" };
    }
}