import api from "./api.client";
import extractErrorData from "../helpers/extractErrorData";
import {
    IntervalUnit,
    StatisticsResponse,
    UsersListResponse,
    UserResponse,
    UserStatsResponse,
} from "@/types/types.users";

const ROOT_URL = "/users";

/**
 * Retrieve aggregated statistics across users, subjects, materials, events, and exams.
 *
 * @param {Object} params - Query parameters for the statistics endpoint.
 * @param {string} params.start - Inclusive start date in `YYYY-MM-DD` or ISO 8601 format.
 * @param {string} params.end - Inclusive end date in `YYYY-MM-DD` or ISO 8601 format.
 * @param {IntervalUnit} [params.interval="day"] - Time unit for bucketing results. One of: `"day" | "week" | "month" | "year"`.
 * @param {number} [params.count=1] - Number of `interval` units per bucket.
 * @returns {Promise<StatisticsResponse | { message: string }>}
 */
export async function getStatistics(params: {
    start: string;
    end: string;
    interval?: IntervalUnit;
    count?: number;
}): Promise<StatisticsResponse | { message: string }> {
    try {
        const { data } = await api.get<StatisticsResponse>(
            `${ROOT_URL}/statistics`,
            { params }
        );
        return data;
    } catch (err) {
        console.error("getStatistics error:", err);
        return extractErrorData(err);
    }
}

/**
 * Fetch a paginated list of users, with optional search, filtering, and sorting.
 *
 * @param {Object} [params] - Optional query parameters.
 * @param {number} [params.page=1] - The page number to retrieve (1-indexed).
 * @param {number} [params.limit=25] - Number of records per page.
 * @param {string} [params.search] - Case-insensitive substring to filter by name or email.
 * @param {"name" | "email" | "createdAt" | "role"} [params.sortField] - Field to sort by.
 * @param {"asc" | "desc"} [params.sortOrder="asc"] - Sort direction: ascending or descending.
 * @param {string} [params.role] - Filter users by role (e.g., `"admin"`, `"user"`).
 * @param {"true" | "false"} [params.restricted] - Filter by restriction status.
 * @returns {Promise<UsersListResponse | { message: string }>}
 */
export async function getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: "name" | "email" | "createdAt" | "role";
    sortOrder?: "asc" | "desc";
    role?: string;
    restricted?: "true" | "false";
}): Promise<UsersListResponse | { message: string }> {
    try {
        const { data } = await api.get<UsersListResponse>(ROOT_URL, { params });
        return data;
    } catch (err) {
        console.error("getAllUsers error:", err);
        return extractErrorData(err);
    }
}

/**
 * Partially update a single restriction entry for a given user.
 *
 * @param {Object} payload - Payload for the restriction update.
 * @param {string} payload.userId - The unique identifier of the user.
 * @param {number} payload.restrictionIndex - Zero-based index of the restriction to update.
 * @param {Partial<UserResponse["restrictions"][number]>} payload.updates - Fields on the restriction to change.
 * @returns {Promise<{ message: string; user?: UserResponse }>}
 */
export async function updateUserRestriction(payload: {
    userId: string;
    restrictionIndex: number;
    updates: Partial<UserResponse["restrictions"][number]>;
}): Promise<{ message: string; user?: UserResponse }> {
    try {
        const { data } = await api.patch<{ message: string; user?: UserResponse }>(
            ROOT_URL,
            payload
        );
        return data;
    } catch (err) {
        console.error("updateUserRestriction error:", err);
        return extractErrorData(err);
    }
}

/**
 * Remove a specific restriction entry from a user's restrictions array.
 *
 * @param {Object} payload - Payload for deletion.
 * @param {string} payload.userId - The unique identifier of the user.
 * @param {number} payload.restrictionIndex - Zero-based index of the restriction to delete.
 * @returns {Promise<{ message: string; user?: UserResponse }>}
 */
export async function deleteUserRestriction(payload: {
    userId: string;
    restrictionIndex: number;
}): Promise<{ message: string; user?: UserResponse }> {
    try {
        const { data } = await api.delete<{ message: string; user?: UserResponse }>(
            ROOT_URL,
            { data: payload }
        );
        return data;
    } catch (err) {
        console.error("deleteUserRestriction error:", err);
        return extractErrorData(err);
    }
}



/**
 * Fetch detailed statistics for a specific user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<UserStatsResponse | { message: string }>}
 */
export async function getUserStatistics(
    userId: string
): Promise<UserStatsResponse | { message: string }> {
    try {
        const { data } = await api.get<UserStatsResponse>(
            `${ROOT_URL}/${userId}`
        );
        return data;
    } catch (err) {
        console.error("getUserStatistics error:", err);
        return extractErrorData(err);
    }
}