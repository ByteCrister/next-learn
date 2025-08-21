import { VEventOverview } from "./types.events";

export type UserProfile = {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role?: "member" | "admin"
};

export interface DashboardData {
    subjectsCount: number;
    routineCount: number;
    examCount: number;
    upcomingEvents: VEventOverview[];
}

export interface UpdateUserInput {
    name?: string;
    image?: string;
    currentPassword?: string;
    newPassword?: string;
}