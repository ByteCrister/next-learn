import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";
import {
    GetExamResponse,
    ExamDTO,
    ExamOverviewCard,
} from "@/types/types.exam";

const BASE_URL = "/exams";

// Common error shape
export type ApiError = { message: string };

/**
 * Create a new exam
 */
export async function createExam(
    input: Partial<ExamDTO>
): Promise<ExamDTO | ApiError> {
    try {
        const { data } = await api.post<ExamDTO>(BASE_URL, input);
        return data;
    } catch (err) {
        console.error("createExam error:", err);
        return extractErrorData(err);
    }
}

/**
 * Get all exams as cards for the logged-in user
 */
export async function getExams(): Promise<ExamOverviewCard[] | ApiError> {
    try {
        const { data } = await api.get<ExamOverviewCard[]>(BASE_URL);
        return data;
    } catch (err) {
        console.error("getExams error:", err);
        return extractErrorData(err);
    }
}

/**
 * Get one exam by ID (including results)
 */
export async function getExamById(
    examId: string
): Promise<GetExamResponse | ApiError> {
    try {
        const { data } = await api.get<GetExamResponse>(`${BASE_URL}/${examId}`);
        return data;
    } catch (err) {
        console.error(`getExamById error (examId=${examId}):`, err);
        return extractErrorData(err);
    }
}

/**
 * Update an existing exam
 */
export async function updateExam(
    examId: string,
    updates: Partial<ExamDTO>
): Promise<ExamDTO | ApiError> {
    try {
        const { data } = await api.patch<ExamDTO>(
            `${BASE_URL}/${examId}`,
            updates
        );
        return data;
    } catch (err) {
        console.error(`updateExam error (examId=${examId}):`, err);
        return extractErrorData(err);
    }
}

/**
 * Delete an exam by ID
 */
export async function deleteExam(
    examId: string
): Promise<{ success: boolean } | ApiError> {
    try {
        const { data } = await api.delete<{ success: boolean }>(
            `${BASE_URL}/${examId}`
        );
        return data;
    } catch (err) {
        console.error(`deleteExam error (examId=${examId}):`, err);
        return extractErrorData(err);
    }
}
