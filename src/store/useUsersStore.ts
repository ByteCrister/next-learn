// lib/store/users.store.ts
"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "react-toastify";

import {
    UsersListResponse,
    UserStatsResponse,
    StatisticsResponse,
    IntervalUnit,
    UserResponse,
} from "@/types/types.users";

import {
    getAllUsers,
    getStatistics,
    getUserStatistics,
    updateUserRestriction,
    deleteUserRestriction,
} from "@/utils/api/api.users";

type DateRange = { start: string; end: string };

type FetchState = {
    loading: boolean;
    error: string | null;
};

interface UsersStore {
    // data
    users: UsersListResponse["users"];
    pagination: UsersListResponse["pagination"];
    userStatisticsById: Record<string, UserStatsResponse>;
    aggregates: StatisticsResponse | null;

    // filters
    range: DateRange;
    interval: IntervalUnit;
    query: string;
    limit: number;

    // meta/caching
    lastFetchedAt: number | null;
    cacheTTL: number;

    // fetch states
    listState: FetchState;
    aggregatesState: FetchState;
    perUserState: Record<string, FetchState>;

    // actions
    setRange: (range: DateRange) => void;
    setInterval: (interval: IntervalUnit) => void;
    setQuery: (q: string) => void;
    setLimit: (limit: number) => void;

    fetchUsers: (page?: number) => Promise<void>;
    fetchAggregates: () => Promise<void>;
    fetchUserStatistics: (userId: string) => Promise<void>;
    patchRestriction: (payload: {
        userId: string;
        restrictionIndex: number;
        updates: Partial<UserResponse["restrictions"][number]>;
    }) => Promise<boolean>;
    removeRestriction: (payload: {
        userId: string;
        restrictionIndex: number;
    }) => Promise<void>;
}

export const useUsersStore = create<UsersStore>()(
    devtools(
        persist(
            (set, get) => ({
                // defaults
                users: [],
                pagination: { total: 0, page: 1, limit: 10 },
                userStatisticsById: {},
                aggregates: null,

                range: {
                    start: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
                    end: new Date().toISOString(),
                },
                interval: "day",
                query: "",
                limit: 10,

                lastFetchedAt: null,
                cacheTTL: 1000 * 60 * 5, // 5 minutes

                listState: { loading: false, error: null },
                aggregatesState: { loading: false, error: null },
                perUserState: {},

                setRange: (range) => set({ range }),
                setInterval: (interval) => set({ interval }),
                setQuery: (q) => set({ query: q }),
                setLimit: (limit) =>
                    set((s) => ({ limit, pagination: { ...s.pagination, limit } })),

                fetchUsers: async (page = get().pagination.page) => {
                    const { limit, query } = get();
                    set({ listState: { loading: true, error: null } });

                    const res = await getAllUsers({
                        page,
                        limit,
                        search: query || undefined,
                    });

                    if ("message" in res) {
                        toast.error(res.message);
                        set({ listState: { loading: false, error: res.message } });
                        return;
                    }

                    set({
                        users: res.users,
                        pagination: res.pagination,
                        listState: { loading: false, error: null },
                    });
                },

                fetchAggregates: async () => {
                    const { range, interval } = get();
                    set({ aggregatesState: { loading: true, error: null } });

                    const res = await getStatistics({
                        start: range.start,
                        end: range.end,
                        interval,
                    });

                    if ("message" in res) {
                        toast.error(res.message);
                        set({
                            aggregatesState: { loading: false, error: res.message },
                        });
                        return;
                    }

                    set({
                        aggregates: res,
                        aggregatesState: { loading: false, error: null },
                    });
                },

                fetchUserStatistics: async (userId: string) => {
                    const { userStatisticsById, lastFetchedAt, cacheTTL, perUserState } =
                        get();

                    // cache check
                    if (
                        userStatisticsById[userId] &&
                        lastFetchedAt &&
                        Date.now() - lastFetchedAt < cacheTTL
                    ) {
                        return;
                    }

                    set({
                        perUserState: {
                            ...perUserState,
                            [userId]: { loading: true, error: null },
                        },
                    });

                    const res = await getUserStatistics(userId);

                    if ("message" in res) {
                        toast.error(res.message);
                        set({
                            perUserState: {
                                ...get().perUserState,
                                [userId]: { loading: false, error: res.message },
                            },
                        });
                        return;
                    }

                    set((state) => ({
                        userStatisticsById: { ...state.userStatisticsById, [userId]: res },
                        lastFetchedAt: Date.now(),
                        perUserState: {
                            ...state.perUserState,
                            [userId]: { loading: false, error: null },
                        },
                    }));
                },

                patchRestriction: async (payload) => {
                    const res = await updateUserRestriction(payload);
                    if ("message" in res && !res.user) {
                        toast.error(res.message);
                        return false;
                    }

                    set((state) => {
                        const updatedUsers = state.users.map((u) =>
                            u._id === res.user?._id ? res.user! : u
                        );
                        return { users: updatedUsers };
                    });
                    toast.success("Restriction updated");
                    return true;
                },

                removeRestriction: async (payload) => {
                    const res = await deleteUserRestriction(payload);
                    if ("message" in res && !res.user) {
                        toast.error(res.message);
                        return;
                    }

                    set((state) => {
                        const updatedUsers = state.users.map((u) =>
                            u._id === res.user?._id ? res.user! : u
                        );
                        return { users: updatedUsers };
                    });
                    toast.success("Restriction removed");
                },
            }),
            { name: "admin-users-store" }
        )
    )
);
