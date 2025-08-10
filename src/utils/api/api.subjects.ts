// src/utils/api/api.subjects.ts
import { Subject, SubjectCounts, SubjectInput } from "@/types/types.subjects";
import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";
import { VCourseRoadmap } from "@/types/types.roadmap";

const BASE_URL = "/subjects";

export async function getAllSubjects(): Promise<{ subjects: Subject[]; counts: SubjectCounts } | { message: string }> {
    try {
        const { data } = await api.get<{ subjects: Subject[]; counts: SubjectCounts }>(BASE_URL);
        console.log(data);
        return data;
    } catch (err) {
        console.error("getAllSubjects error:", err);
        return extractErrorData(err);
    }
}

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

export async function fetchSubjectById(id: string): Promise<
    | { subject: Subject; roadmap: VCourseRoadmap | null }
    | { message: string }
> {
    try {
        const { data } = await api.get(`${BASE_URL}/${id}`);
        return data;
    } catch (err) {
        console.error("fetchSubjectById error:", err);
        return { message: "Failed to fetch subject by id" };
    }
}

export async function updateSubject(
    id: string,
    updates: Partial<SubjectInput>
): Promise<Subject | { message: string }> {
    try {
        const { data } = await api.patch<Subject>(`${BASE_URL}/${id}`, updates);
        return data;
    } catch (err) {
        console.error("updateSubject error:", err);
        return extractErrorData(err);
    }
}

export async function deleteSubject(
    id: string
): Promise<{ message: string }> {
    try {
        const { data } = await api.delete<{ message: string }>(`${BASE_URL}/${id}`);
        return data;
    } catch (err) {
        console.error("deleteSubject error:", err);
        // we know the API returns { message: string } on error
        return extractErrorData(err);
    }
}
