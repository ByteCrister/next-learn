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
import type {
  ExamOverviewCard,
  ExamDTO,
  ExamResultDTO,
  Question,
  SendResultsResponse,
  ParticipantSendResult,
  AnswerDTO,
} from "@/types/types.exam";
import extractErrorData from "@/utils/helpers/extractErrorData";
import api from "@/utils/api/api.client";

interface ExamStoreState {
  exams: ExamOverviewCard[];
  examsById: Record<string, ExamDTO>;
  resultsByExamId: Record<string, ExamResultDTO[]>;
  loading: boolean;
  fetching: boolean;
  hasFetchedExams: boolean;
  message: string | null;

  fetchExams: (searchedId?: string) => Promise<void>;
  fetchExamById: (
    id: string,
    forceRefresh?: boolean
  ) => Promise<ExamDTO | void>;
  create: (payload: Partial<ExamDTO>) => Promise<string | boolean>;
  update: (id: string, payload: Partial<ExamDTO>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  updateQuestion: (
    examId: string,
    questionIndex: number,
    question: Question
  ) => Promise<void>;
  deleteQuestion: (examId: string, questionIndex: number) => Promise<void>;
  sendResults: (examId: string, participants: string[]) => Promise<void>;
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
    fetchExams: async (searchedId?: string) => {
      // If a fetch is already in progress, do nothing
      if (get().fetching) return;

      // If we already have exams and no searchedId requested, avoid duplicate fetch
      // (existing logic kept: only fetch once unless store cleared or caller forces)
      if (get().hasFetchedExams && !searchedId && get().exams.length > 0) {
        return;
      }

      // If we have cached exams and a searchedId is provided, prefer local reordering if fresh
      if (searchedId && get().exams.length > 0) {
        // Move matching exam to front if it exists locally
        const idx = get().exams.findIndex((e) => e._id === searchedId);
        if (idx > 0) {
          set((s) => {
            const copy = [...s.exams];
            const [found] = copy.splice(idx, 1);
            copy.unshift(found);
            s.exams = copy;
          });
          // mark we have fetched exams to avoid unnecessary network call
          return;
        }
        // if not found locally, continue to fetch from server with searchedId param
      }

      // Normal fetch path (optionally with searchedId query so server returns prioritized ordering)
      set((s) => {
        s.fetching = true;
        s.message = null;
        s.hasFetchedExams = true;
      });

      const data = await getExams(searchedId);
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
      if ((cache && !forceRefresh) || get().fetching) {
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
      set((s) => {
        s.loading = true;
      });

      const newExam = await createExam(payload);
      if ("message" in newExam) {
        toast.error(newExam.message || "Failed to create exam");
        set((s) => {
          s.message = newExam.message;
          s.loading = false;
        });
        return false;
      }

      set((s) => {
        s.exams.unshift({
          _id: newExam._id,
          title: newExam.title,
          description: newExam.description,
          subjectCode: newExam.subjectCode,
          examCode: newExam.examCode,
          isTimed: newExam.isTimed ?? false,
          durationMinutes: newExam.isTimed ? newExam.durationMinutes ?? 0 : 0,
          scheduledStartAt: newExam.scheduledStartAt ?? null,
          allowLateSubmissions: newExam.allowLateSubmissions ?? false,
          questionCount: newExam.questions?.length ?? 0,
          status: (() => {
            const now = new Date();
            if (!newExam.scheduledStartAt) return "draft";
            const start = new Date(newExam.scheduledStartAt);
            if (start > now) return "scheduled";
            if (newExam.isTimed && newExam.durationMinutes) {
              const end = new Date(
                start.getTime() + newExam.durationMinutes * 60000
              );
              return end > now ? "active" : "completed";
            }
            return "active";
          })(),
          createdAt: newExam.createdAt,
          updatedAt: newExam.updatedAt,
        });

        // prime detailed cache
        s.examsById[newExam._id] = newExam;
        s.resultsByExamId[newExam._id] = newExam.results;
        s.loading = false;
      });
      return newExam._id;
    },

    update: async (id, payload) => {
      set((s) => {
        s.loading = true;
      });
      const updated = await updateExam(id, payload);
      if ("message" in updated) {
        toast.error(updated.message || "Failed to update exam");
        set((s) => {
          s.loading = false;
        });
        return false;
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
            isTimed: updated.isTimed ?? false,
            durationMinutes: updated.isTimed ? updated.durationMinutes ?? 0 : 0,
            scheduledStartAt: updated.scheduledStartAt ?? null,
            allowLateSubmissions: updated.allowLateSubmissions ?? false,
            questionCount: updated.questions?.length ?? 0,
            status: (() => {
              const now = new Date();
              if (!updated.scheduledStartAt) return "draft";
              const start = new Date(updated.scheduledStartAt);
              if (start > now) return "scheduled";
              if (updated.isTimed && updated.durationMinutes) {
                const end = new Date(
                  start.getTime() + updated.durationMinutes * 60000
                );
                return end > now ? "active" : "completed";
              }
              return "active";
            })(),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
          };
        }

        // update detail & results cache
        s.examsById[id] = updated;
        s.resultsByExamId[id] = updated.results;
        s.loading = false;
      });
      return true;
    },

    remove: async (id) => {
      set((s) => {
        s.loading = true;
      });
      const deleted = await deleteExam(id);
      if ("message" in deleted || !deleted.success) {
        const msg =
          "message" in deleted ? deleted.message : "Failed to delete.";
        toast.error(msg);
        set((s) => {
          s.message = msg;
          s.loading = false;
        });
        return false;
      }

      set((s) => {
        s.exams = s.exams.filter((e: ExamOverviewCard) => e._id !== id);
        delete s.examsById[id];
        delete s.resultsByExamId[id];
        s.loading = false;
      });
      return true;
    },

    updateQuestion: async (examId, questionIndex, question) => {
      set((s) => {
        s.loading = true;
      });
      const res = await updateExamQuestion(examId, questionIndex, question);
      if ("message" in res && !("question" in res)) {
        toast.error(res.message || "Failed to update question");
        return set((s) => {
          s.message = res.message;
          s.loading = false;
        });
      }

      set((s) => {
        const exam = s.examsById[examId];
        if (exam) {
          exam.questions[questionIndex] = res.question;
        }
        s.loading = false;
      });

      toast.success(res.message);
    },

    deleteQuestion: async (examId, questionIndex) => {
      set((s) => {
        s.loading = true;
      });
      const res = await deleteExamQuestion(examId, questionIndex);
      if ("message" in res && !("success" in res)) {
        // Here success isn't returned, so just rely on message
        if (!res.message.includes("successfully")) {
          toast.error(res.message || "Failed to delete question");
          return set((s) => {
            s.message = res.message;
            s.loading = false;
          });
        }
      }

      set((s) => {
        const exam = s.examsById[examId];
        if (exam) {
          exam.questions.splice(questionIndex, 1);
        }
        s.loading = false;
      });

      toast.success(res.message);
    },

    sendResults: async (examId: string, participants: string[]) => {
      if (!examId) {
        toast.error("Missing examId");
        return;
      }
      if (!Array.isArray(participants) || participants.length === 0) {
        toast.error("No participants provided");
        return;
      }

      set((s) => {
        s.loading = true;
        s.message = null;
      });

      try {
        const resp = await api.put<SendResultsResponse>(
          `/exams/${encodeURIComponent(examId)}/send-result`,
          { participants }
        );

        const data = resp?.data;
        if (!data || !Array.isArray(data.results)) {
          const msg = "Invalid response from server";
          toast.error(msg);
          set((s) => {
            s.loading = false;
            s.message = msg;
          });
          return;
        }

        // Merge server results into resultsByExamId[examId]
        set((s) => {
          const existing = s.resultsByExamId[examId] ?? [];
          const map = new Map<string, ExamResultDTO>();
          for (const r of existing) map.set(r.participantId, r);

          for (const pr of data.results as ParticipantSendResult[]) {
            const pid = pr.participantId;
            const cur = map.get(pid);

            // normalize resultSentAt to ISO string when present
            const resultSentAtISO =
              pr.resultSentAt instanceof Date
                ? pr.resultSentAt.toISOString()
                : typeof pr.resultSentAt === "string"
                ? pr.resultSentAt
                : pr.resultSentAt == null
                ? undefined
                : String(pr.resultSentAt);

            // build merged ExamResultDTO (favor server fields; fallback to cached)
            const merged: ExamResultDTO = {
              _id: cur?._id ?? `${examId}:${pid}`,
              participantId: pid,
              participantEmail:
                cur?.participantEmail ?? pr.participantEmail ?? "",
              status:
                pr.status === "ok"
                  ? "submitted"
                  : pr.status === "error"
                  ? cur?.status ?? "in-progress"
                  : cur?.status ?? "submitted",
              score: typeof pr.score === "number" ? pr.score : cur?.score ?? 0,
              startedAt:
                cur?.startedAt ??
                (pr.startedAt
                  ? String(pr.startedAt)
                  : new Date().toISOString()),
              endedAt:
                cur?.endedAt ??
                (pr.endedAt ? String(pr.endedAt) : new Date().toISOString()),
              answers: Array.isArray(pr.answers)
                ? (pr.answers as AnswerDTO[])
                : cur?.answers ?? [],
              isResultSent: true,
              resultSentAt: resultSentAtISO ?? cur?.resultSentAt,
            };

            map.set(pid, merged);
          }

          // reconstruct array: preserve existing order, append new
          const updated: ExamResultDTO[] = [];
          const added = new Set<string>();
          for (const e of existing) {
            const m = map.get(e.participantId);
            if (m) {
              updated.push(m);
              added.add(m.participantId);
            }
          }
          for (const [pid, val] of map.entries()) {
            if (!added.has(pid)) updated.push(val);
          }

          s.resultsByExamId[examId] = updated;
        });

        toast.success(data.message || "Results processed");
        set((s) => {
          s.loading = false;
          s.message = data.message ?? null;
        });

        return;
      } catch (err: unknown) {
        const parsed = extractErrorData(err);
        toast.error(parsed.message || "Failed to send results");
        set((s) => {
          s.loading = false;
          s.message = parsed.message ?? "Failed to send results";
        });
        return;
      }
    },

    // Clear all caches
    clearCache: () => {
      set((s) => {
        s.exams = [];
        s.examsById = {};
        s.resultsByExamId = {};
        s.message = null;
        s.loading = false;
      });
    },
  }))
);
