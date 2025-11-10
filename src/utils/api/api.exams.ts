import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";
import {
    GetExamResponse,
    ExamDTO,
    ExamOverviewCard,
    Question,
    ExamCheckResponse,
    CheckExamInput,
    SubmitResult,
} from "@/types/types.exam";

const ROOT_URL = "/exams";

// Common error shape
export type ApiError = { message: string };

/**
 * Create a new exam
 */
export async function createExam(
    input: Partial<ExamDTO>
): Promise<ExamDTO | ApiError> {
    try {
        const { data } = await api.post<ExamDTO>(ROOT_URL, input);
        return data;
    } catch (err) {
        console.error("createExam error:", err);
        return extractErrorData(err);
    }
}

/**
 * Get all exams as cards for the logged-in user
 */
export async function getExams(
    searchedId?: string
): Promise<ExamOverviewCard[] | ApiError> {
    try {
        const url = searchedId
            ? `${ROOT_URL}?searchedId=${encodeURIComponent(searchedId)}`
            : ROOT_URL;
        const { data } = await api.get<ExamOverviewCard[]>(url);
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
        const { data } = await api.get<GetExamResponse>(`${ROOT_URL}/${examId}`);
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
        const { data } = await api.patch<ExamDTO>(`${ROOT_URL}/${examId}`, updates);
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
            `${ROOT_URL}/${examId}`
        );
        return data;
    } catch (err) {
        console.error(`deleteExam error (examId=${examId}):`, err);
        return extractErrorData(err);
    }
}

/**
 * Update a specific question in an exam
 */
export async function updateExamQuestion(
    examId: string,
    questionIndex: number,
    question: Question
): Promise<{ message: string; question: Question } | ApiError> {
    try {
        const { data } = await api.put<{ message: string; question: Question }>(
            `${ROOT_URL}/questions`,
            { examId, questionIndex, question }
        );
        return data;
    } catch (err) {
        console.error("updateExamQuestion error:", err);
        return extractErrorData(err);
    }
}

/**
 * Delete a specific question from an exam
 */
export async function deleteExamQuestion(
    examId: string,
    questionIndex: number
): Promise<{ message: string } | ApiError> {
    try {
        const { data } = await api.delete<{ message: string }>(
            `${ROOT_URL}/questions`,
            { data: { examId, questionIndex } }
        );
        return data;
    } catch (err) {
        console.error("deleteExamQuestion error:", err);
        return extractErrorData(err);
    }
}

/**
 * Fetches exam check data for a specific exam created by a given user.
 *
 * @param createdBy - The ID of the user who created the exam.
 * @param examId - The unique identifier of the exam to be checked.
 * @returns The response data from the API if successful, or extracted error details if the request fails.
 */
export async function getCheckExam(
    createdBy: string,
    examId: string
): Promise<ExamCheckResponse | ApiError> {
    try {
        // Send a GET request to the /check endpoint with query parameters
        const { data } = await api.get(`${ROOT_URL}/check`, {
            params: { createdBy, examId },
        });

        // Return the retrieved data from the API
        return data;
    } catch (err) {
        // Log the error for debugging purposes
        console.error("getCheckExam error:", err);
        // Extract and return a user-friendly error message or structure
        return extractErrorData(err);
    }
}

/**
 * Sends a POST request to check the availability or status of an exam.
 *
 * @param input - An object containing the necessary exam check parameters (e.g., createdBy, examId).
 * @returns A successful exam check response or a structured API error.
 */
export async function getCheckExamForm(
    input: CheckExamInput
): Promise<ExamCheckResponse | ApiError> {
    try {
        // Send POST request to /check endpoint with input payload
        const { data } = await api.post(`${ROOT_URL}/check`, input);

        // Return the parsed response data
        return data;
    } catch (err) {
        console.error("getCheckExam error:", err);

        // Extract and return a meaningful error response from the caught exception
        return extractErrorData(err);
    }
}

/**
 * Fetches join exam data for a specific exam, validating participant and exam code.
 *
 * @param createdBy - The ID of the user who created the exam.
 * @param examId - The ID of the exam to join.
 * @param participantId - The participant's ID.
 * @param examCode - The hashed exam code to validate.
 * @returns The response data from the API if successful, or extracted error details if the request fails.
 */
export async function getJoinExam(
    createdBy: string,
    examId: string,
    participantId: string,
    examCode: string
): Promise<ExamDTO | ApiError> {
    try {
        // Send a GET request to the /join endpoint with query parameters
        const { data } = await api.get(`${ROOT_URL}/join`, {
            params: { createdBy, examId, participantId, examCode },
        });

        // Return the retrieved exam data
        return data;
    } catch (err) {
        console.error("getJoinExam error:", err);
        return extractErrorData(err);
    }
}

/**
 * Submit participant answers for an exam
 * @param result ExamResultDTO object containing answers and participant info
 * @returns Promise resolving to submitted result
 */
export const submitExamAnswers = async (
    result: SubmitResult
): Promise<{ success: boolean } | ApiError> => {
    try {
        const { data } = await api.post(`${ROOT_URL}/join`, result);
        return data;
    } catch (err) {
        console.error("submitExamAnswers error:", err);
        return extractErrorData(err);
    }
};
