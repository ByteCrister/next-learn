import { VCourseRoadmap } from "@/types/types.roadmap";
import api from "./api.client";
import extractErrorData from "../helpers/extractErrorData";

const BASE_URL = "/roadmaps";

/**
 * Create a new course roadmap for a given subject.
 *
 * @param subjectId - The ID of the subject under which the roadmap should be created.
 * @param input - An object containing:
 *   - title: The title of the new roadmap.
 *   - description: A brief description of the roadmap.
 * @returns The created VCourseRoadmap on success, or an error object with a message on failure.
 */
export async function createRoadmap(
    subjectId: string,
    input: { title: string; description: string }
): Promise<VCourseRoadmap | { message: string }> {
    try {
        const body = { ...input, subjectId };
        const { data } = await api.post<VCourseRoadmap>(`${BASE_URL}`, body);
        return data;
    } catch (err) {
        console.error("createRoadmap error:", err);
        return extractErrorData(err);
    }
}

/**
 * Update the TipTap content of an existing roadmap.
 *
 * @param roadmapId - The ID of the roadmap to update.
 * @param roadmapContent - A JSON string or object representing the new TipTap content.
 * @returns The updated VCourseRoadmap on success, or an error object with a message on failure.
 */
export async function updateRoadmapContent(
    roadmapId: string,
    roadmapContent: string
): Promise<VCourseRoadmap | { message: string }> {
    try {
        const { data } = await api.put<VCourseRoadmap>(BASE_URL, {
            roadmapId,
            roadmapContent,
        });
        return data;
    } catch (err) {
        console.error("updateRoadmapContent error:", err);
        return extractErrorData(err);
    }
}

/**
 * Update the title and description of an existing roadmap.
 *
 * @param updates - An object containing:
 *   - roadmapId: The ID of the roadmap to update.
 *   - title: The new title.
 *   - description: The new description.
 * @returns The updated VCourseRoadmap on success, or an error object with a message on failure.
 */
export async function updateRoadmap(
    updates: { title: string; description: string; roadmapId: string }
): Promise<VCourseRoadmap | { message: string }> {
    try {
        const { data } = await api.patch<VCourseRoadmap>(`${BASE_URL}`, updates);
        return data;
    } catch (err) {
        console.error("updateRoadmap error:", err);
        return extractErrorData(err);
    }
}

/**
 * Delete a roadmap by its ID.
 *
 * @param roadmapId - The ID of the roadmap to delete.
 * @returns An object containing a confirmation message on success, or an error object with a message on failure.
 */
export async function deleteRoadmap(
    roadmapId: string
): Promise<{ message: string }> {
    try {
        const { data } = await api.delete(`${BASE_URL}?id=${roadmapId}`);
        return data;
    } catch (err) {
        console.error("deleteRoadmap error:", err);
        return extractErrorData(err);
    }
}
