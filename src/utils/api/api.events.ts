/**
 * Event API utilities
 * -------------------
 * Provides strongly-typed client-side wrappers for CRUD operations
 * on the `/events` endpoint. All functions catch API errors and return
 * either the expected data type or a `{ message: string }` error object
 * for unified error handling in state/actions.
 */

import api from "./api.client";
import extractErrorData from "../helpers/extractErrorData";
import { VEvent } from "@/types/types.events";

/** Base API path for event resources */
const MAIN_ROOT = "/events";

/**
 * Fetch all events for the current user/session.
 *
 * @returns Promise resolving to:
 *  - `VEvent[]` on success
 *  - `{ message: string }` if an error occurs
 *
 * Notes:
 * - Dates are returned as ISO strings; conversion to Date objects
 *   should be handled at state/action level if needed.
 */
export async function getEvents(): Promise<VEvent[] | { message: string }> {
    try {
        const { data } = await api.get<VEvent[]>(MAIN_ROOT);
        return data;
    } catch (err) {
        console.error("getEvents error:", err);
        return extractErrorData(err);
    }
}

/**
 * Create a new event.
 *
 * @param values - A complete `VEvent` object (server may ignore certain fields like `_id`)
 * @returns Promise resolving to:
 *  - `VEvent` of the newly created event
 *  - `{ message: string }` if creation fails
 */
export async function createEvent(
    values: VEvent
): Promise<VEvent | { message: string }> {
    try {
        const { data } = await api.post<VEvent>(MAIN_ROOT, values);
        return data;
    } catch (err) {
        console.error("createEvent error:", err);
        return extractErrorData(err);
    }
}

/**
 * Update an existing event by ID.
 *
 * @param id - MongoDB ObjectId string of the event to update
 * @param values - Partial or full `VEvent` object containing the updates
 * @returns Promise resolving to:
 *  - The updated `VEvent` object
 *  - `{ message: string }` if update fails
 *
 * Implementation detail:
 * - Sends `{ id, updates }` in body for flexibility on server-side parsing.
 */
export async function updateEvent(
    id: string,
    values: VEvent
): Promise<VEvent | { message: string }> {
    try {
        const payload = { id, updates: values }; // include id in body
        const { data } = await api.put<VEvent>(MAIN_ROOT, payload);
        return data;
    } catch (err) {
        console.error("updateEvent error:", err);
        return extractErrorData(err);
    }
}

/**
 * Delete an event by ID.
 *
 * @param id - MongoDB ObjectId string of the event to delete
 * @returns Promise resolving to:
 *  - `{ success: boolean }` if the deletion was processed
 *  - `{ message: string }` if deletion fails
 *
 * Notes:
 * - Uses DELETE with `data` payload because some servers/frameworks
 *   don't accept body-less DELETE requests when extra identifiers are needed.
 */
export async function deleteEvent(
    id: string
): Promise<{ success: boolean } | { message: string }> {
    try {
        const { data } = await api.delete<{ success: boolean }>(MAIN_ROOT, {
            data: { id }, // send id in body
        });
        return data;
    } catch (err) {
        console.error("deleteEvent error:", err);
        return extractErrorData(err);
    }
}
