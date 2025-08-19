import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getDashboard, updateUserDetails } from "@/utils/api/api.dashboard";
import { getUserData } from "@/utils/api/api.user";
import { toast } from "react-toastify";
import { UpdateUserInput, UserProfile } from "@/types/types.dashboard";
import { VEvent } from "@/types/types.events";

type CountField = "subjectsCount" | "examCount" | "routineCount";

interface DashboardState {
    subjectsCount: number;
    examCount: number;
    routineCount: number;
    upcomingEvents: VEvent[];
    user: UserProfile | null;

    form: UpdateUserInput;
    setFormField: (field: keyof DashboardState["form"], value: string) => void;
    updateCounts: (field: CountField, option: "+" | "-") => void;

    // UI
    loadingDashboard: boolean;
    loadingUserUpdate: boolean;
    fetchedDashboard: boolean;
    isUserFetching: boolean;

    // Actions
    fetchDashboard: () => Promise<void>;
    fetchUser: () => Promise<void>;
    updateUser: () => Promise<void>;
    updateUserImage: (image: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
    devtools((set, get) => ({
        subjectsCount: 0,
        examCount: 0,
        routineCount: 0,
        upcomingEvents: [],
        user: null,

        form: {
            name: "",
            image: "",
            currentPassword: "",
            newPassword: "",
        },

        loadingDashboard: false,
        loadingUserUpdate: false,
        fetchedDashboard: false,

        fetchDashboard: async () => {
            if (get().loadingDashboard || get().fetchedDashboard) return; // Only fetch once per session
            set({ loadingDashboard: true });
            try {
                const data = await getDashboard();
                if ("message" in data) {
                    toast.error(data.message);
                } else {
                    set({
                        subjectsCount: data.subjectsCount,
                        examCount: data.examCount,
                        routineCount: data.routineCount,
                        upcomingEvents: data.upcomingEvents,
                        fetchedDashboard: true,
                    });
                }
            } catch (err) {
                toast.error((err as Error).message || "Failed to fetch dashboard");
            } finally {
                set({ loadingDashboard: false });
            }
        },

        fetchUser: async () => {
            set({ isUserFetching: true });
            try {
                const data = await getUserData();
                if ("message" in data) {
                    console.warn(data.message);
                } else {
                    set({
                        user: data,
                        form: {
                            name: data.name ?? "",
                            image: data.image ?? "",
                            currentPassword: "",
                            newPassword: "",
                        },
                    });
                }
            } catch (err) {
                console.log((err as Error)?.message ?? "Can't fetch the user");
            } finally {
                set({ isUserFetching: false });
            }
        },

        updateUser: async () => {
            set({ loadingUserUpdate: true });
            try {
                const result = await updateUserDetails(get().form);
                if ("message" in result) {
                    toast.error(result.message);
                } else {
                    set({
                        user: result,
                        form: { ...get().form, currentPassword: "", newPassword: "" },
                    });
                    toast.success("Profile updated successfully");
                }
            } catch (err) {
                toast.error((err as Error).message || "Failed to update user");
            } finally {
                set({ loadingUserUpdate: false });
            }
        },

        updateUserImage: (image) =>
            set((state) => ({
                user: state.user ? { ...state.user, image } : null,
            })),

        setFormField: (field, value) => {
            set((state) => ({
                form: { ...state.form, [field]: value },
            }));
        },

        updateCounts: (field, option) => {
            set((state) => {
                const change = option === "+" ? 1 : -1;
                const newValue = Math.max(0, state[field] + change); // prevent negative
                return { [field]: newValue };
            });
        },
    }))
);
