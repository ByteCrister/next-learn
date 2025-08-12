import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify"; // 👈 add this
import {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
} from "@/utils/api/api.exams";
import type { ExamOverviewCard, ExamDTO, ExamResultDTO } from "@/types/types.exam";

interface ExamStoreState {
    exams: ExamOverviewCard[];
    selectedExam: ExamDTO | null;
    results: ExamResultDTO[];
    loading: boolean;
    message: string | null;

    fetchExams: () => Promise<void>;
    fetchExamById: (id: string) => Promise<void>;
    fetchResults: (id?: string) => Promise<void>;
    create: (payload: Partial<ExamDTO>) => Promise<void>;
    update: (id: string, payload: Partial<ExamDTO>) => Promise<void>;
    remove: (id: string) => Promise<void>;
    clearSelected: () => void;
}

export const useExamStore = create<ExamStoreState>()(
    immer((set, get) => ({
        exams: [],
        selectedExam: null,
        results: [],
        loading: false,
        message: null,

        fetchExams: async () => {
            set((s) => { s.loading = true; s.message = null });
            const data = await getExams();
            if ("message" in data) {
                toast.error(data.message || "Failed to fetch exams");
                return set((s) => { s.message = data.message });
            }
            set((s) => {
                s.exams = data;
                s.loading = false;
            });
        },

        fetchExamById: async (id: string) => {
            set((s) => { s.loading = true; s.message = null });
            const data = await getExamById(id);
            if ("message" in data) {
                toast.error(data.message || "Failed to fetch exam details");
                return set((s) => { s.message = data.message });
            }
            set((s) => {
                s.selectedExam = data;
                s.results = data ?? [];
                s.loading = false;
            });
        },

        fetchResults: async (id?: string) => {
            const examId = id || get().selectedExam?._id;
            if (!examId) return;
            const selected = get().selectedExam;
            if (selected?.results) {
                set((s) => { s.results = selected.results; });
            }
        },

        create: async (payload) => {
            const newExam = await createExam(payload);
            if ("message" in newExam) {
                toast.error(newExam.message || "Failed to create exam");
                return set((s) => { s.message = newExam.message });
            }
            set((s) => {
                s.exams.unshift({
                    _id: newExam._id,
                    title: newExam.title,
                    description: newExam.description,
                    subjectCode: newExam.subjectCode,
                    examCode: newExam.examCode,
                });
            });
        },

        update: async (id, payload) => {
            const updated = await updateExam(id, payload);
            if ("message" in updated) {
                toast.error(updated.message || "Failed to update exam");
                return set((s) => { s.message = updated.message });
            }
            set((s) => {
                s.selectedExam = updated;
                const index = s.exams.findIndex((e: ExamOverviewCard) => e._id === id);
                if (index !== -1) {
                    s.exams[index] = {
                        _id: updated._id,
                        title: updated.title,
                        description: updated.description,
                        subjectCode: updated.subjectCode,
                        examCode: updated.examCode,
                    };
                }
            });
        },

        remove: async (id) => {
            const deleted = await deleteExam(id);

            if ("message" in deleted) {
                toast.error(deleted.message || "Failed to delete exam");
                return set((s) => { s.message = deleted.message || "Failed to delete."; });
            }

            if (!deleted.success) {
                toast.error("Failed to delete exam");
                return set((s) => { s.message = "Failed to delete."; });
            }

            set((s) => {
                s.exams = s.exams.filter((e: ExamOverviewCard) => e._id !== id);
                if (s.selectedExam?._id === id) s.selectedExam = null;
                s.results = [];
            });
        },

        clearSelected: () => {
            set((s) => {
                s.selectedExam = null;
                s.results = [];
                s.message = null;
            });
        },
    }))
);
