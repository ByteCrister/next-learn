// src/utils/api/api.dashboard.ts
import { DashboardData, UpdateUserInput, UserProfile } from "@/types/types.dashboard";
import api from "./api.client";
import extractErrorData from "../helpers/extractErrorData";

const MAIN_ROOT_URL = '/dashboard'

export async function getDashboard():
    Promise<DashboardData | { message: string }> {
    try {
        const { data } = await api.get<DashboardData>(MAIN_ROOT_URL);
        return data;
    } catch (err) {
        console.error("getDashboard error:", err);
        return extractErrorData(err);
    }
}

export async function updateUserDetails(
    input: UpdateUserInput
): Promise<UserProfile | { message: string }> {
    try {
        const { data } = await api.patch<UserProfile>(
            MAIN_ROOT_URL,
            input
        );
        return data;
    } catch (err) {
        console.error("updateUserDetails error:", err);
        return extractErrorData(err);
    }
}