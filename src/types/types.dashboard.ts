import { VEvent } from "./types.events";

export type UserProfile = {
    _id: string;
    name: string;
    email: string;
    image?: string;
};

export interface DashboardData {
    subjectsCount: number;
    routineCount: number;
    examCount: number;
    upcomingEvents: VEvent[];
}

export interface UpdateUserInput {
    name?: string;
    image?: string;
    currentPassword?: string;
    newPassword?: string;
}