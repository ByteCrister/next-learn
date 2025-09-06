// hooks/useRoutineStore.ts

import { create } from 'zustand'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import {
    CreateRoutineDto,
    UpdateRoutineDto,
    RoutineResponseDto,
} from '@/types/types.routine'
import api from '@/utils/api/api.client'

// /api path is already declared in the api object
const MAIN_ROOT = '/routines'

interface RoutineState {
    /** Array of all routines fetched for the current user */
    routines: RoutineResponseDto[]

    /** True while a GET (fetch) request is in progress */
    isFetching: boolean

    /** True while a POST/PUT/DELETE (mutation) request is in progress */
    isMutating: boolean

    lastFetched: number | null // timestamp for caching

    /** Last error message, or null if no error */
    error: string | null

    /** Fetch all routines for the signed-in user */
    fetchRoutines: (force?: boolean) => Promise<void>

    /** Create a new routine on the server and update state */
    createRoutine: (payload: CreateRoutineDto) => Promise<void>

    /**
     * Update an existing routine on the server and update state
     *
     * @param id       – ID of the routine to update
     * @param payload  – Partial fields to modify (title, description, days)
     */
    updateRoutine: (id: string, payload: UpdateRoutineDto) => Promise<void>

    /**
     * Delete a routine on the server and remove it from state
     *
     * @param id – ID of the routine to delete
     */
    deleteRoutine: (id: string) => Promise<void>

    /**
     * Internal helper to call any API endpoint with consistent loading, error, and toast handling
     *
     * @param apiCall      – A function that returns an Axios Response promise
     * @param options      – Controls loading flag and custom success/error messages
     *   • loadingType – 'fetching' sets isFetching; 'mutating' sets isMutating  
     *   • successMsg  – Optional toast.success message on 2xx  
     *   • errorMsg    – Optional prefix for toast.error on failure
     */
    handleApi: <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        options: HandleApiOptions
    ) => Promise<ApiResponse<T> | undefined>
}

interface HandleApiOptions {
    /** Which flag to toggle: fetches (GET) vs. mutations (POST/PUT/DELETE) */
    loadingType: 'fetching' | 'mutating'

    /** Message to show on successful response */
    successMsg?: string

    /** Prefix for the error toast on failure */
    errorMsg?: string
}

type ApiResponse<T> = AxiosResponse<{ data: T }>

export const useRoutineStore = create<RoutineState>((set, get) => ({
    routines: [],
    isFetching: false,
    isMutating: false,
    lastFetched: null,
    error: null,

    handleApi: async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        options: HandleApiOptions
    ): Promise<ApiResponse<T> | undefined> => {
        const { loadingType, successMsg, errorMsg } = options

        // Toggle appropriate loading flag and clear previous error
        if (loadingType === 'fetching') set({ isFetching: true, error: null })
        else set({ isMutating: true, error: null })

        try {
            const result = await apiCall()
            if (successMsg) toast.success(successMsg)
            return result
        } catch (err: unknown) {
            let message = 'Something went wrong'
            let status: number | undefined

            // Extract error details if it's an AxiosError
            if (axios.isAxiosError(err)) {
                status = err.response?.status
                message = err.response?.data?.message || err.message
            }

            // Show contextual toast based on status code
            if (status === 401) {
                toast.error('Unauthorized: Please log in to continue.')
            } else if (status === 404) {
                toast.error('Not found: The requested routine does not exist.')
            } else {
                toast.error(errorMsg ? `${errorMsg}: ${message}` : message)
            }

            // Store the error message in state
            set({ error: message })
        } finally {
            // Reset the appropriate loading flag
            if (loadingType === 'fetching') set({ isFetching: false })
            else set({ isMutating: false })
        }
    },

    fetchRoutines: async (force = false) => {
        const { routines, lastFetched, isFetching } = get();

        //  prevent duplicate in-flight fetch
        if (isFetching) return;

        const CACHE_DURATION = 5 * 60 * 1000;
        const now = Date.now();

        if (!force && routines.length > 0 && lastFetched && now - lastFetched < CACHE_DURATION) {
            return; // serve from cache
        }

        const result = await get().handleApi(
            () => api.get<{ data: RoutineResponseDto[] }>(MAIN_ROOT),
            {
                loadingType: "fetching",
                // successMsg: 'Routines fetched successfully!', // optional, can be noisy
                errorMsg: "Failed to fetch routines",
            }
        );

        console.log(result?.data.data);

        if (result?.data.data) {
            set({
                routines: result.data.data,
                lastFetched: now,
            });
        }
    },

    createRoutine: async (payload) => {
        const result = await get().handleApi(
            () => api.post<{ data: RoutineResponseDto }>(MAIN_ROOT, payload),
            {
                loadingType: 'mutating',
                successMsg: 'Routine created successfully!',
                errorMsg: 'Failed to create routine',
            }
        )
        if (result?.data.data) {
            set((state) => ({
                routines: [result.data.data, ...state.routines],
            }))
        }
    },

    updateRoutine: async (id, payload) => {
        const result = await get().handleApi(
            () =>
                api.put<{ data: RoutineResponseDto }>(MAIN_ROOT, {
                    id,
                    ...payload,
                }),
            {
                loadingType: 'mutating',
                successMsg: 'Routine updated successfully!',
                errorMsg: 'Failed to update routine',
            }
        )
        if (result?.data.data) {
            set((state) => ({
                routines: state.routines.map((r) =>
                    r.id === result.data.data.id ? result.data.data : r
                ),
            }))
        }
    },

    deleteRoutine: async (id) => {
        const result = await get().handleApi(
            () =>
                api.delete<{ data: RoutineResponseDto }>(MAIN_ROOT, {
                    data: { id },
                }),
            {
                loadingType: 'mutating',
                successMsg: 'Routine deleted successfully!',
                errorMsg: 'Failed to delete routine',
            }
        )
        if (result?.data.data) {
            set((state) => ({
                routines: state.routines.filter(
                    (r) => r.id !== result.data.data.id
                ),
            }))
        }
    },
}))
