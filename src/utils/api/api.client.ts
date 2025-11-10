import axios, { AxiosInstance, AxiosError } from 'axios'

const baseURL = typeof window === 'undefined' 
    ? process.env.NEXTAUTH_URL
    : '';

const api: AxiosInstance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export type ApiError = AxiosError<{ message?: string }>

export default api