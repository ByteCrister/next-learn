// stores/useBatchesStore.ts
import { create } from "zustand";
import { produce } from "immer";


import api, { ApiError } from "@/utils/api/api.client";
import { APIError, Cohort, CohortsState, CreateCohortPayload, CreateCohortResponse, DeleteCohortPayload, DeleteCohortResponse, GetCohortResponse, ID, UpdateCohortPayload, UpdateCohortResponse } from "@/types/types.batch";

export const ROOT_DIRECTORY = "/batches";

type ApiErrorTyped = ApiError;

async function handleError(err: unknown): Promise<APIError> {
    const apiErr = err as ApiErrorTyped | unknown;
    if ((apiErr as ApiErrorTyped)?.isAxiosError) {
        const a = apiErr as ApiErrorTyped;
        return {
            status: a.response?.status ?? 500,
            message: a.response?.data?.message ?? a.message,
            details: a.response?.data ?? undefined,
        };
    }
    return { status: 500, message: (err as Error)?.message ?? "Unknown error" };
}

export const useBatchesStore = create<CohortsState>((set) => {
    const itemCache = new Map<ID, Cohort>();
    let fetchAllInFlight: Promise<void> | null = null;

    return {
        // state
        cohorts: [],
        currentCohort: null,
        total: 0,
        loading: false,
        error: null,

        // helpers
        setError(err: APIError | null) {
            set({ error: err });
        },

        reset() {
            itemCache.clear();
            set({
                cohorts: [],
                currentCohort: null,
                total: 0,
                loading: false,
                error: null,
            });
        },

        // actions
        fetchCohorts: async () => {
            // if we already have cache, return cached list
            if (itemCache.size > 0) {
                set({
                    cohorts: Array.from(itemCache.values()),
                    total: itemCache.size,
                    loading: false,
                    error: null,
                });
                return;
            }

            // reuse in-flight request
            if (fetchAllInFlight) return fetchAllInFlight;

            fetchAllInFlight = (async () => {
                set({ loading: true, error: null });
                try {
                    const res = await api.get<{ data: Cohort[]; total?: number }>(`${ROOT_DIRECTORY}`);
                    const cohorts = res.data.data ?? [];
                    cohorts.forEach((c) => itemCache.set(c._id, c));
                    set({
                        cohorts,
                        total: res.data.total ?? cohorts.length,
                        loading: false,
                        error: null,
                    });
                } catch (err) {
                    const e = await handleError(err);
                    set({ loading: false, error: e });
                    throw e;
                } finally {
                    fetchAllInFlight = null;
                }
            })();

            return fetchAllInFlight;
        },

        fetchCohortById: async (id: ID) => {
            const cached = itemCache.get(id);
            if (cached) {
                set({ currentCohort: cached, loading: false, error: null });
                return;
            }

            set({ loading: true, error: null });
            try {
                const res = await api.get<GetCohortResponse>(`${ROOT_DIRECTORY}/${id}`);
                const cohort = res.data.data;
                itemCache.set(id, cohort);

                set(
                    produce((s: CohortsState) => {
                        const idx = s.cohorts.findIndex((c) => c._id === cohort._id);
                        if (idx >= 0) s.cohorts[idx] = cohort;
                        else s.cohorts = [cohort, ...s.cohorts];
                        s.currentCohort = cohort;
                        s.loading = false;
                        s.error = null;
                        s.total = s.cohorts.length;
                    })
                );
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        createCohort: async (payload: CreateCohortPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.post<CreateCohortResponse>(`${ROOT_DIRECTORY}`, payload);
                const cohort = res.data.data;
                itemCache.set(cohort._id, cohort);

                set(
                    produce((s: CohortsState) => {
                        s.cohorts = [cohort, ...s.cohorts];
                        s.total = s.cohorts.length;
                        s.currentCohort = cohort;
                        s.loading = false;
                        s.error = null;
                    })
                );

                return cohort;
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        updateCohort: async (payload: UpdateCohortPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.put<UpdateCohortResponse>(`${ROOT_DIRECTORY}/${payload._id}`, payload);
                const updated = res.data.data;
                itemCache.set(updated._id, updated);

                set(
                    produce((s: CohortsState) => {
                        const idx = s.cohorts.findIndex((c) => c._id === updated._id);
                        if (idx >= 0) s.cohorts[idx] = updated;
                        else s.cohorts = [updated, ...s.cohorts];
                        if (s.currentCohort && s.currentCohort._id === updated._id) s.currentCohort = updated;
                        s.loading = false;
                        s.error = null;
                        s.total = s.cohorts.length;
                    })
                );

                return updated;
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        deleteCohort: async (payload: DeleteCohortPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.delete<DeleteCohortResponse>(`${ROOT_DIRECTORY}/${payload._id}`, {
                    data: payload,
                });
                const success = res.data.success;
                if (success) {
                    itemCache.delete(payload._id);
                    set(
                        produce((s: CohortsState) => {
                            s.cohorts = s.cohorts.filter((c) => c._id !== payload._id);
                            if (s.currentCohort && s.currentCohort._id === payload._id) s.currentCohort = null;
                            s.total = s.cohorts.length;
                            s.loading = false;
                            s.error = null;
                        })
                    );
                } else {
                    set({ loading: false });
                }
                return;
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },
    };
});
