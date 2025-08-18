import api, { ApiError } from './api.client';

/** Request / Response Payloads */
export interface RequestOTPPayload { email: string }
export interface VerifyOTPPayload { email: string; otp: string }
export interface ResetPasswordPayload { email: string; newPassword: string }

/** Helper to get server message or fallback */
export const getMessage = (err: ApiError) =>
    err.response?.data?.message ?? 'Something went wrong'

/** Send OTP */
export async function requestOTP(
    payload: RequestOTPPayload
) {
    try {
        const res = await api.post('/auth/request-otp', payload)
        return res.data
    } catch (err) {
        throw err
    }
}

/** Verify OTP */
export async function verifyOTP(
    payload: VerifyOTPPayload
): Promise<void> {
    try {
        await api.post('/auth/verify-otp', payload)
    } catch (err) {
        throw err
    }
}

/** Resend OTP */
export async function resendOTP(
    payload: RequestOTPPayload
){
    try {
        const res = await api.post('/auth/request-otp', payload)
        return res.data
    } catch (err) {
        throw err
    }
}

/** Reset Password */
export async function resetPassword(
    payload: ResetPasswordPayload
): Promise<void> {
    try {
        await api.post('/auth/reset-password', payload)
    } catch (err) {
        throw err
    }
}
