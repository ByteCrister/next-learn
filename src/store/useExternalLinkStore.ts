"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IExternalLink } from "@/models/ExternalLink";

export interface ExternalLinkInput {
    subjectId?: string;
    url: string;
    title: string;
    description?: string;
    category: string;
    visibility?: "private" | "public";
}
import { useSubjectStore } from "./useSubjectsStore";
import { toast } from "react-toastify";

interface ExternalLinkStore {
    externalLinks: IExternalLink[];
    loading: boolean;

    fetchExternalLinks: (subjectId?: string) => Promise<void>;
    addExternalLink: (link: ExternalLinkInput) => Promise<void>;
    editExternalLink: (id: string, updates: Partial<IExternalLink>) => Promise<void>;
    deleteExternalLink: (id: string) => Promise<void>;
    markAsViewed: (id: string) => Promise<void>;
}

export const useExternalLinkStore = create<ExternalLinkStore>()(
    devtools((set) => ({
        externalLinks: [],
        loading: false,

        fetchExternalLinks: async (subjectId) => {
            set({ loading: true });
            try {
                const params = subjectId ? `?subjectId=${subjectId}` : "";
                const response = await fetch(`/api/external-links${params}`);
                if (!response.ok) throw new Error("Failed to fetch external links");
                const data = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                set({ externalLinks: data.map((link: any) => ({ ...link, _id: link._id.toString() })), loading: false });
            } catch (error) {
                set({ loading: false });
                toast.error((error as Error).message);
            }
        },

        addExternalLink: async (link) => {
            set({ loading: true });
            try {
                const response = await fetch("/api/external-links", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(link),
                });
                if (!response.ok) throw new Error("Failed to add external link");
                const newLink = await response.json();
                set((state) => ({ externalLinks: [newLink, ...state.externalLinks], loading: false }));
                useSubjectStore.getState().updateSubjectCounts("externalLinks", "+");
                useSubjectStore.getState().updateSelectedSubjectCounts("externalLinks", "+");
                toast.success("External link added successfully");
            } catch (error) {
                set({ loading: false });
                toast.error((error as Error).message);
            }
        },

        editExternalLink: async (id, updates) => {
            set({ loading: true });
            try {
                const response = await fetch(`/api/external-links/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });
                if (!response.ok) throw new Error("Failed to update external link");
                const updatedLink = await response.json();
                set((state) => ({
                    externalLinks: state.externalLinks.map((link) =>
                        link._id === id ? updatedLink : link
                    ),
                    loading: false,
                }));
                toast.success("External link updated successfully");
            } catch (error) {
                set({ loading: false });
                toast.error((error as Error).message);
            }
        },

        deleteExternalLink: async (id) => {
            set({ loading: true });
            try {
                const response = await fetch(`/api/external-links/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to delete external link");
                set((state) => ({
                    externalLinks: state.externalLinks.filter((link) => link._id !== id),
                    loading: false,
                }));
                useSubjectStore.getState().updateSubjectCounts("externalLinks", "-");
                useSubjectStore.getState().updateSelectedSubjectCounts("externalLinks", "-");
                toast.success("External link deleted successfully");
            } catch (error) {
                set({ loading: false });
                toast.error((error as Error).message);
            }
        },

        markAsViewed: async (id) => {
            try {
                const response = await fetch(`/api/external-links/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isNew: false }),
                });
                if (!response.ok) throw new Error("Failed to mark link as viewed");
                const updatedLink = await response.json();
                set((state) => ({
                    externalLinks: state.externalLinks.map((link) =>
                        link._id === id ? updatedLink : link
                    ),
                }));
            } catch (error) {
                toast.error((error as Error).message);
            }
        },
    }))
);
