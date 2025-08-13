import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
    deleteExamQuestion,
    updateExamQuestion,
} from "@/utils/api/api.exams";
import type { ExamOverviewCard, ExamDTO, ExamResultDTO, Question } from "@/types/types.exam";

interface ExamStoreState {
    exams: ExamOverviewCard[];
    examsById: Record<string, ExamDTO>;
    resultsByExamId: Record<string, ExamResultDTO[]>;
    loading: boolean;
    fetching: boolean;
    hasFetchedExams: boolean;
    message: string | null;

    fetchExams: () => Promise<void>;
    fetchExamById: (id: string, forceRefresh?: boolean) => Promise<ExamDTO | void>;
    create: (payload: Partial<ExamDTO>) => Promise<void>;
    update: (id: string, payload: Partial<ExamDTO>) => Promise<void>;
    remove: (id: string) => Promise<void>;
    updateQuestion: (examId: string, questionIndex: number, question: Question) => Promise<void>;
    deleteQuestion: (examId: string, questionIndex: number) => Promise<void>;
    clearCache: () => void;
}


export const useExamStore = create<ExamStoreState>()(
    immer((set, get) => ({
        exams: [],
        examsById: {},
        resultsByExamId: {},
        loading: false,
        fetching: false,
        hasFetchedExams: false,
        message: null,

        // 1. Load overview list (always fetch)
        fetchExams: async () => {
            // If we've already loaded exams and aren't forcing, bail out
            if ((get().hasFetchedExams || get().exams.length > 0)) {
                return;
            }
            set((s) => {
                s.fetching = true;
                s.message = null;
                s.hasFetchedExams = true;
            });

            const data = await getExams();
            if ("message" in data) {
                toast.error(data.message || "Failed to fetch exams");
                return set((s) => {
                    s.fetching = false;
                    s.message = data.message;
                });
            }

            set((s) => {
                s.exams = data;
                // reset caches: overview only
                s.examsById = {};
                s.resultsByExamId = {};
                s.fetching = false;
            });
        },

        // 2. Load or reuse a single exam by ID
        fetchExamById: async (id, forceRefresh = false) => {
            const cache = get().examsById[id];
            if (cache && !forceRefresh) {
                return cache;
            }

            set((s) => {
                s.fetching = true;
                s.message = null;
            });

            const data = await getExamById(id);
            if ("message" in data) {
                toast.error(data.message || "Failed to fetch exam details");
                return set((s) => {
                    s.fetching = false;
                    s.message = data.message;
                });
            }

            set((s) => {
                s.examsById[id] = data;
                // also prime the results cache from the full exam payload
                s.resultsByExamId[id] = data.results;
                s.fetching = false;
            });

            return data;
        },

        // 3. Create, Update, Delete remain mostly the same,
        //    but you should update caches on success:

        create: async (payload) => {
            const newExam = await createExam(payload);
            if ("message" in newExam) {
                toast.error(newExam.message || "Failed to create exam");
                return set((s) => {
                    s.message = newExam.message;
                });
            }

            set((s) => {
                s.exams.unshift({
                    _id: newExam._id,
                    title: newExam.title,
                    description: newExam.description,
                    subjectCode: newExam.subjectCode,
                    examCode: newExam.examCode,
                });
                // prime detailed cache
                s.examsById[newExam._id] = newExam;
                s.resultsByExamId[newExam._id] = newExam.results;
            });
        },

        update: async (id, payload) => {
            const updated = await updateExam(id, payload);
            if ("message" in updated) {
                toast.error(updated.message || "Failed to update exam");
                return set((s) => {
                    s.message = updated.message;
                });
            }

            set((s) => {
                // update overview list
                const idx = s.exams.findIndex((e: ExamOverviewCard) => e._id === id);
                if (idx !== -1) {
                    s.exams[idx] = {
                        _id: updated._id,
                        title: updated.title,
                        description: updated.description,
                        subjectCode: updated.subjectCode,
                        examCode: updated.examCode,
                    };
                }
                // update detail & results cache
                s.examsById[id] = updated;
                s.resultsByExamId[id] = updated.results;
            });
        },

        remove: async (id) => {
            const deleted = await deleteExam(id);
            if ("message" in deleted || !deleted.success) {
                const msg = "message" in deleted ? deleted.message : "Failed to delete.";
                toast.error(msg);
                return set((s) => {
                    s.message = msg;
                });
            }

            set((s) => {
                s.exams = s.exams.filter((e: ExamOverviewCard) => e._id !== id);
                delete s.examsById[id];
                delete s.resultsByExamId[id];
            });
        },

        updateQuestion: async (examId, questionIndex, question) => {
            const res = await updateExamQuestion(examId, questionIndex, question);
            if ("message" in res && !("question" in res)) {
                toast.error(res.message || "Failed to update question");
                return set((s) => {
                    s.message = res.message;
                });
            }

            set((s) => {
                const exam = s.examsById[examId];
                if (exam) {
                    exam.questions[questionIndex] = res.question;
                }
            });

            toast.success(res.message);
        },

        deleteQuestion: async (examId, questionIndex) => {
            const res = await deleteExamQuestion(examId, questionIndex);
            if ("message" in res && !("success" in res)) {
                // Here success isn't returned, so just rely on message
                if (!res.message.includes("successfully")) {
                    toast.error(res.message || "Failed to delete question");
                    return set((s) => {
                        s.message = res.message;
                    });
                }
            }

            set((s) => {
                const exam = s.examsById[examId];
                if (exam) {
                    exam.questions.splice(questionIndex, 1);
                }
            });

            toast.success(res.message);
        },

        // Clear all caches
        clearCache: () => {
            set((s) => {
                s.exams = [];
                s.examsById = {};
                s.resultsByExamId = {};
                s.message = null;
            });
        },
    }))
);
