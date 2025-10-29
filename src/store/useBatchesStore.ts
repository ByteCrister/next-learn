import { create } from "zustand";
import { produce } from "immer";
import type {
    ID,
    Batch,
    GetBatchResponse,
    CreateBatchPayload,
    CreateBatchResponse,
    UpdateBatchPayload,
    UpdateBatchResponse,
    DeleteBatchPayload,
    DeleteBatchResponse,
    APIError,
    BatchesState,
} from "@/types/types.batch";
import api, { ApiError } from "@/utils/api/api.client";

export const ROOT_DIRECTORY = "/batches";
type ApiErrorTyped = ApiError;

export const useBatchesStore = create<BatchesState>((set) => {
    const itemCache = new Map<ID, Batch>();
    let fetchAllInFlight: Promise<void> | null = null;

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

    return {
        // state
        batches: [],
        currentBatch: null,
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
                batches: [],
                currentBatch: null,
                total: 0,
                loading: false,
                error: null,
            });
        },

        // fetch all batches (deduped)
        fetchBatches: async () => {
            // short-circuit if cache populated
            if (itemCache.size > 0) {
                set({
                    batches: Array.from(itemCache.values()),
                    total: itemCache.size,
                    loading: false,
                    error: null,
                });
                return;
            }

            // reuse in-flight request if present
            if (fetchAllInFlight) return fetchAllInFlight;

            fetchAllInFlight = (async () => {
                set({ loading: true, error: null });
                try {
                    // call the API that returns all batches
                    const res = await api.get<{ data: Batch[]; total?: number }>(`${ROOT_DIRECTORY}`);
                    const batches = res.data.data ?? [];
                    batches.forEach((b) => itemCache.set(b._id, b));

                    set({
                        batches,
                        total: res.data.total ?? batches.length,
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

        fetchBatchById: async (id: ID) => {
            const cached = itemCache.get(id);
            if (cached) {
                set({ currentBatch: cached, loading: false, error: null });
                return;
            }

            set({ loading: true, error: null });
            try {
                const res = await api.get<GetBatchResponse>(`${ROOT_DIRECTORY}/${id}`);
                const batch = res.data.data;
                itemCache.set(id, batch);

                set(
                    produce((s: BatchesState) => {
                        const idx = s.batches.findIndex((b) => b._id === batch._id);
                        if (idx >= 0) s.batches[idx] = batch;
                        s.currentBatch = batch;
                        s.loading = false;
                        s.error = null;
                        s.total = s.batches.length;
                    })
                );
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        createBatch: async (payload: CreateBatchPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.post<CreateBatchResponse>(`${ROOT_DIRECTORY}`, payload);
                const batch = res.data.data;
                itemCache.set(batch._id, batch);

                set(
                    produce((s: BatchesState) => {
                        s.batches = [batch, ...s.batches];
                        s.total = s.batches.length;
                        s.currentBatch = batch;
                        s.loading = false;
                        s.error = null;
                    })
                );

                return batch;
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        updateBatch: async (payload: UpdateBatchPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.put<UpdateBatchResponse>(`${ROOT_DIRECTORY}/${payload._id}`, payload);
                const updated = res.data.data;
                itemCache.set(updated._id, updated);

                set(
                    produce((s: BatchesState) => {
                        const idx = s.batches.findIndex((b) => b._id === updated._id);
                        if (idx >= 0) s.batches[idx] = updated;
                        if (s.currentBatch && s.currentBatch._id === updated._id) s.currentBatch = updated;
                        s.loading = false;
                        s.error = null;
                        s.total = s.batches.length;
                    })
                );

                return updated;
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        deleteBatch: async (payload: DeleteBatchPayload) => {
            set({ loading: true, error: null });
            try {
                const res = await api.delete<DeleteBatchResponse>(`${ROOT_DIRECTORY}/${payload._id}`, {
                    data: payload,
                });
                const success = res.data.success;

                if (success) {
                    itemCache.delete(payload._id);

                    set(
                        produce((s: BatchesState) => {
                            s.batches = s.batches.filter((b) => b._id !== payload._id);
                            if (s.currentBatch && s.currentBatch._id === payload._id) s.currentBatch = null;
                            s.total = s.batches.length;
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
