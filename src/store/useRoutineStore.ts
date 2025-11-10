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

    fetchingById: Record<string, boolean>;

    /** Last error message, or null if no error */
    error: string | null

    /** Fetch all routines for the signed-in user */
    fetchRoutines: (force?: boolean, searchedId?: string) => Promise<void>

    fetchById: (id: string, force?: boolean) => Promise<RoutineResponseDto | undefined>

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
    fetchingById: {},
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

    /**
  * Fetch all routines for the signed-in user.
  * If searchedId is provided and routines are already cached, reorder locally.
  * If routines are not cached (or force=true) call API with ?searchedId=... to
  * let server place the searched routine first.
  */
    fetchRoutines: async (force = false, searchedId?: string) => {
        const { routines, lastFetched, isFetching } = get();

        // prevent duplicate in-flight fetch
        if (isFetching) return;

        const CACHE_DURATION = 5 * 60 * 1000;
        const now = Date.now();

        // If we have cached items and no forced refetch, try to satisfy locally
        if (!force && routines.length > 0 && lastFetched && now - lastFetched < CACHE_DURATION) {
            // If searchedId present, move it to front if exists in cache
            if (searchedId) {
                const idx = routines.findIndex((r) => r.id === searchedId);
                if (idx > 0) {
                    const copy = [...routines];
                    const [found] = copy.splice(idx, 1);
                    copy.unshift(found);
                    set({ routines: copy });
                }
            }
            return; // served from cache (possibly re-ordered)
        }

        // Build endpoint with optional searchedId param so server can return prioritized order
        const url = searchedId ? `${MAIN_ROOT}?searchedId=${encodeURIComponent(searchedId)}` : MAIN_ROOT;

        const result = await get().handleApi(
            () => api.get<{ data: RoutineResponseDto[] }>(url),
            {
                loadingType: "fetching",
                errorMsg: "Failed to fetch routines",
            }
        );

        if (result?.data.data) {
            // Server already returns searched-first order when searchedId was present in query
            set({
                routines: result.data.data,
                lastFetched: now,
            });
        }
    },

    /**
  * Fetch a single routine by id.
  * - If present in cache and force !== true, return cached item.
  * - Otherwise call GET /routines/:id, insert/replace the routine in cache, and return it.
  */
    fetchById: async (id, force = false) => {
        const { routines, fetchingById } = get();
        if (!id) return undefined;

        // Avoid duplicate fetch for same id
        if (fetchingById[id]) return undefined;

        // Check cache first
        if (!force) {
            const cached = routines.find((r) => r.id === id);
            if (cached) return cached;
        }

        // Mark this ID as fetching
        set((state) => ({
            fetchingById: { ...state.fetchingById, [id]: true },
        }));

        try {
            const result = await get().handleApi(
                () => api.get<{ data: RoutineResponseDto }>(`${MAIN_ROOT}/${encodeURIComponent(id)}`),
                { loadingType: 'fetching', errorMsg: `Failed to fetch routine ${id}` }
            );

            const routine = result?.data.data;
            if (routine) {
                set((state) => {
                    const existsIdx = state.routines.findIndex((r) => r.id === routine.id);
                    if (existsIdx === -1) {
                        return { routines: [routine, ...state.routines] };
                    } else {
                        const copy = [...state.routines];
                        copy[existsIdx] = routine;
                        return { routines: copy };
                    }
                });
                return routine;
            }
        } finally {
            // Always clear fetching flag for this id
            set((state) => {
                const copy = { ...state.fetchingById };
                delete copy[id];
                return { fetchingById: copy };
            });
        }

        return undefined;
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
