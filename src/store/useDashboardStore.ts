// src/store/useDashboardStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getDashboard, getUserData, updateUserDetails } from "@/utils/api/api.dashboard";
import { UpdateUserInput, UserProfile } from "@/types/types.dashboard";
import { toast } from "react-toastify";
import { VEvent } from "@/types/types.events";


//
// ————————————————————————————————————————————————————
// Types
type CountFiled = 'subjectsCount' | 'examCount' | 'routineCount'

// ————————————————————————————————————————————————————
// Matches DashboardData from your API client

// Store state + actions
interface DashboardState {
    // data
    subjectsCount: number;
    examCount: number;
    routineCount: number;
    upcomingEvents: VEvent[];
    user: UserProfile | null;

    form: UpdateUserInput;
    setFormField: (field: keyof DashboardState["form"], value: string) => void;
    updateCounts: (countFiled: CountFiled, option: '+' | '-') => void;
    // ui
    loading: boolean;
    userUpdateLoading: boolean

    // actions
    fetchDashboard: () => Promise<void>;
    updateUser: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

//
// ————————————————————————————————————————————————————
// Create Store
// ————————————————————————————————————————————————————
export const useDashboardStore = create<DashboardState>()(
    devtools((set, get) => ({
        // initial state
        subjectsCount: 0,
        examCount: 0,
        roadmapsCount: 0,
        routineCount: 0,
        upcomingEvents: [],
        user: null,

        form: {
            name: "",
            image: "",
            currentPassword: "",
            newPassword: "",
        },

        loading: false,
        userUpdateLoading: false,

        // fetch counts, events, user profile
        fetchDashboard: async () => {
            set({ loading: true });
            try {
                const data = await getDashboard();
                if ("message" in data) {
                    toast.error(data.message);
                } else {
                    console.log(data.upcomingEvents);
                    set({
                        subjectsCount: data.subjectsCount,
                        examCount: data.examCount,
                        routineCount: data.routineCount,
                        upcomingEvents: data.upcomingEvents
                    });
                }
            } catch (err) {
                toast.error((err as Error).message);
            } finally {
                set({ loading: false });
            }
        },

        // update a single form field
        setFormField: (field, value) => {
            set((state) => ({
                form: { ...state.form, [field]: value },
            }));
        },

        // update profile fields
        updateUser: async () => {
            set({ userUpdateLoading: true });
            const { form } = get();
            const result = await updateUserDetails(form);

            try {
                if ("message" in result) {
                    toast.error(result.message);
                } else {
                    set((state) => ({
                        user: result,
                        form: {
                            ...state.form,
                            currentPassword: "",
                            newPassword: "",
                        }
                    }));
                }
            } catch (err) {
                toast.error((err as Error).message);
            } finally {
                set({ userUpdateLoading: false });
            }

        },

        fetchUser: async () => {
            set({ loading: true });
            try {
                const data = await getUserData();
                if ("message" in data) {
                    console.log(data.message);
                    // toast.error(data.message);
                } else {
                    set({
                        user: data,
                        form: {
                            name: data.name,
                            image: data.image ?? "",
                            currentPassword: "",
                            newPassword: "",
                        },
                    });
                }
            } catch (err) {
                console.log((err as Error)?.message??`can't fetch the user!`);
            } finally {
                set({ loading: false });
            }
        },

        updateCounts: (countFiled, option) => {
            const newCount = option === '+' ? 1 : -1;
            set((state) => ({
                [countFiled]: state[countFiled as CountFiled] + newCount,
            }))
        }
    }))
);
