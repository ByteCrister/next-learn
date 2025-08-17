import api from "./api.client";
// Base URL for all API requests is preconfigured to `/api`

// Root path for authentication-related signup endpoints
const ROOT_URL = "/auth/signup";

/**
 * Initiates the signup flow by requesting an OTP for the provided email.
 * - Optional `name` can be sent if collected prior to OTP step
 * - Backend sends OTP via email to verify address ownership
 */
export async function requestOTP(data: { email: string; name?: string }) {
    const res = await api.post(`${ROOT_URL}/send-otp`, data);
    return res.data;
}

/**
 * Confirms the OTP sent to the user's email during signup.
 * - Ensures the provided code matches what was sent
 * - Must succeed before account registration
 */
export async function verifyOTP(data: { email: string; otp: string }) {
    const res = await api.post(`${ROOT_URL}/verify-otp`, data);
    return res.data;
}

/**
 * Completes account creation after OTP verification.
 * - Registers the user with their chosen credentials
 * - Assumes OTP verification has already been validated
 */
export async function registerUser(data: { name: string; email: string; password: string }) {
    const res = await api.post(`${ROOT_URL}/register`, data);
    return res.data;
}
