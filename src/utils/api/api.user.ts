import { UserProfile } from "@/types/types.dashboard";
import extractErrorData from "../helpers/extractErrorData";
import api from "./api.client";

const MAIN_ROOT_URL = '/user'

export async function getUserData(): Promise<UserProfile | { message: string }> {
    try {
        const { data } = await api.get<UserProfile>(MAIN_ROOT_URL);
        return data;
    } catch (err) {
        console.error("getUserData error:", err);
        return extractErrorData(err);
    }
}

export async function updateUserImage(imageDataUrl: string): Promise<{ updatedImage: string } | { message: string }> {
    try {
        const { data } = await api.put<{ updatedImage: string }>(`${MAIN_ROOT_URL}/profile-image`, { image: imageDataUrl });
        return data;
    } catch (err) {
        console.error("updateUserImage error:", err);
        return extractErrorData(err);
    }
}