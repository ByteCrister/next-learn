import axios, { AxiosInstance, AxiosError } from 'axios'

const api: AxiosInstance = axios.create({
    baseURL: `/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export type ApiError = AxiosError<{ message?: string }>

export default api