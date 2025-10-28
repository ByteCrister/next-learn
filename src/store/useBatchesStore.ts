// store.batch.ts
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
} from "../types/types.batch";
import api, { ApiError } from "@/utils/api/api.client";

export const ROOT_DIRECTORY = "/batches";

type ApiErrorTyped = ApiError;

/**
 * Simplified store for a small project: fetch all batches at once (no pagination cache).
 * - fetchBatches() requests GET /batches?all=true (server should return all)
 * - fetchBatchById(id) requests GET /batches/:id
 * - create/update/delete map to REST endpoints under ROOT_DIRECTORY
 *
 * The store keeps a simple item cache (Map) to avoid redundant refetches during a session.
 */

export const useBatchesStore = create<BatchesState>((set, get) => {
    const itemCache = new Map<ID, Batch>();

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
        page: 1,
        pageSize: 0,
        loading: false,
        error: null,

        // actions
        setPage(page: number) {
            set(
                produce((s: BatchesState) => {
                    s.page = page;
                })
            );
        },

        setPageSize(size: number) {
            set(
                produce((s: BatchesState) => {
                    s.pageSize = size;
                })
            );
        },

        setError(err: APIError | null) {
            set({ error: err });
        },

        reset() {
            itemCache.clear();
            set({
                batches: [],
                currentBatch: null,
                total: 0,
                page: 1,
                pageSize: 0,
                loading: false,
                error: null,
            });
        },

        // fetch all batches (server endpoint should support returning all entries)
        fetchBatches: async () => {
            set({ loading: true, error: null });
            try {
                // request server to return all records; adjust query param if your API differs
                const res = await api.get<{ data: Batch[] }>(`${ROOT_DIRECTORY}`, {
                    params: { all: true },
                });
                const batches = res.data.data ?? [];

                // update simple cache
                batches.forEach((b) => itemCache.set(b._id, b));

                set({
                    batches,
                    total: batches.length,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                const e = await handleError(err);
                set({ loading: false, error: e });
                throw e;
            }
        },

        fetchBatchById: async (id: ID) => {
            // use simple in-memory item cache to avoid refetching within the session
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

                // also update list if present
                set(
                    produce((s: BatchesState) => {
                        const idx = s.batches.findIndex((b) => b._id === batch._id);
                        if (idx >= 0) s.batches[idx] = batch;
                        s.currentBatch = batch;
                        s.loading = false;
                        s.error = null;
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
