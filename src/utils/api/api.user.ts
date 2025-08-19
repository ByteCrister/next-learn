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