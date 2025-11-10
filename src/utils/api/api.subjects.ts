// src/utils/api/api.subjects.ts

import { Subject, SubjectCounts, SubjectInput, SubjectUpdateRes } from "@/types/types.subjects";
import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";
import { VCourseRoadmap } from "@/types/types.roadmap";

const BASE_URL = "/subjects";

/**
 * Fetches all subjects along with their aggregate counts.
 * Fetches subjects and counts. If `searched` is provided it will be sent as ?searched=<value>
 *
 * @returns A promise that resolves to an object containing:
 *   - subjects: an array of Subject records
 *   - counts: total count metrics for those subjects
 *   Or, on error, an object with a `message` string.
 */
export async function getAllSubjects(
    searched?: string | null
): Promise<
    { subjects: Subject[]; counts: SubjectCounts; matched?: { id: string; originalIndex: number } | null } | { message: string }
> {
    try {
        const url = searched ? `${BASE_URL}?searched=${encodeURIComponent(searched)}` : BASE_URL;
        const { data } = await api.get<{ subjects: Subject[]; counts: SubjectCounts; matched?: { id: string; originalIndex: number } | null }>(url);
        return data;
    } catch (err) {
        console.error("getAllSubjects error:", err);
        return extractErrorData(err);
    }
}

/**
 * Creates a new subject.
 *
 * @param input  The properties required to create a subject,
 *               matching the SubjectInput type.
 * @returns A promise that resolves to the newly created Subject object,
 *          or an error object with a `message` string.
 */
export async function createSubject(
    input: SubjectInput
): Promise<Subject | { message: string }> {
    try {
        const { data } = await api.post<Subject>(BASE_URL, input);
        return data;
    } catch (err) {
        console.error("createSubject error:", err);
        return extractErrorData(err);
    }
}

/**
 * Retrieves a single subject by its unique ID, plus its roadmap.
 *
 * @param id  The unique identifier of the subject to fetch.
 * @returns A promise that resolves to an object containing:
 *   - subject: the Subject record
 *   - roadmap: a VCourseRoadmap instance or null if none
 *   Or, on error, an object with a `message` string.
 */
export async function fetchSubjectById(
    id: string
): Promise<
    | { subject: Subject; roadmap: VCourseRoadmap | null }
    | { message: string }
> {
    try {
        const { data } = await api.get<{ subject: Subject; roadmap: VCourseRoadmap | null }>(
            `${BASE_URL}/${encodeURIComponent(id)}`
        );
        return data;
    } catch (err) {
        console.error("fetchSubjectById error:", err);
        return extractErrorData(err);
    }
}

/**
 * Applies partial updates to an existing subject.
 *
 * @param id       The ID of the subject to update.
 * @param updates  An object containing one or more SubjectInput fields to patch.
 * @returns A promise that resolves to the updated Subject, or an error object.
 */
export async function updateSubject(
    id: string,
    updates: Partial<SubjectInput>
): Promise<SubjectUpdateRes | { message: string }> {
    try {
        const { data } = await api.patch<SubjectUpdateRes>(`${BASE_URL}/${id}`, updates);
        return data;
    } catch (err) {
        console.error("updateSubject error:", err);
        return extractErrorData(err);
    }
}

/**
 * Deletes a subject by its ID.
 *
 * @param id  The ID of the subject to remove.
 * @returns A promise that resolves to an object with a `message` string,
 *          indicating success or the error encountered.
 */
export async function deleteSubject(
    id: string
): Promise<{ message: string }> {
    try {
        const { data } = await api.delete<{ message: string }>(
            `${BASE_URL}/${id}`
        );
        console.log(`Deleted subject ${id}`);
        return data;
    } catch (err) {
        console.error("deleteSubject error:", err);
        return extractErrorData(err);
    }
}
