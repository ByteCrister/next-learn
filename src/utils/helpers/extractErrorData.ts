import { AxiosError } from "axios";

function extractErrorData(error: unknown) {
    if ((error as AxiosError).isAxiosError) {
        const axiosErr = error as AxiosError<{ message: string }>;
        return axiosErr.response?.data ?? { message: axiosErr.message };
    }
    return { message: "Unknown error" };
}

export default extractErrorData;