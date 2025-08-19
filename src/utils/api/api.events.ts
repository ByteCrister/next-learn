// src/utils/api/api.events.ts
import api from "./api.client";
import extractErrorData from "../helpers/extractErrorData";
import { VEvent } from "@/types/types.events";

const MAIN_ROOT = '/events'
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

export async function updateEvent(
    id: string,
    values: VEvent
): Promise<VEvent | { message: string }> {
    try {
        const payload = {
            ...values,
            start: values.start,
            end: values.end,
        };
        const { data } = await api.put<VEvent>(`${MAIN_ROOT}/${id}`, payload);
        return data;
    } catch (err) {
        console.error("updateEvent error:", err);
        return extractErrorData(err);
    }
}

export async function getEvents(): Promise<VEvent[] | { message: string }> {
    try {
        const { data } = await api.get<VEvent[]>(MAIN_ROOT);
        return data;
    } catch (err) {
        console.error("getEvents error:", err);
        return extractErrorData(err);
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean } | { message: string }> {
    try {
        const { data } = await api.delete<{ success: boolean }>(`${MAIN_ROOT}/${id}`);
        return data;
    } catch (err) {
        console.error("deleteEvent error:", err);
        return extractErrorData(err);
    }
}
