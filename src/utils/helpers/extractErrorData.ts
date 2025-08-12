import { AxiosError } from "axios";

function extractErrorData(error: unknown) {
    // Handle Axios errors
    if (error && typeof error === "object" && (error as AxiosError).isAxiosError) {
        const axiosErr = error as AxiosError<{ message?: string }>;

        // Try server-provided message first
        if (axiosErr.response?.data?.message) {
            return { message: axiosErr.response.data.message };
        }

        // Try Axios' own message
        if (axiosErr.message) {
            return { message: axiosErr.message };
        }

        // Fallback for weird Axios cases
        return { message: "Request failed" };
    }

    // Handle plain Error objects
    if (error instanceof Error) {
        return { message: error.message };
    }

    // Handle strings
    if (typeof error === "string") {
        return { message: error };
    }

    // Final fallback
    return { message: "Unknown error" };
}

export default extractErrorData;
