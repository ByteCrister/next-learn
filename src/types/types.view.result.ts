// src/types/types.view.result.ts
import { z } from "zod";

export const IdString = z.string().min(1).max(256);

export const CanonicalParamsSchema = z.object({
  email: IdString, // obfuscated
  createdBy: IdString, // obfuscated
  examId: IdString, // obfuscated
  participantId: IdString, // obfuscated
  examCode: IdString, // obfuscated
  ts: z.string().regex(/^\d{13}$/), // unix ms timestamp as string
  nonce: z.string().min(8).max(64),
  sig: z.string().min(32).max(256), // hex/base64 HMAC signature
});

export type CanonicalParams = z.infer<typeof CanonicalParamsSchema>;

export const DecodedParamsSchema = z.object({
  email: z.string().email(),
  createdBy: z.string(), // decoded ObjectId string
  examId: z.string(), // decoded ObjectId string
  participantId: z.string(), // raw participant ID (human-entered)
  examCode: z.string().min(4).max(32),
});

export type DecodedParams = z.infer<typeof DecodedParamsSchema>;

export const ChoiceDTO = z.object({
  text: z.string(),
});

export type ChoiceDTO = z.infer<typeof ChoiceDTO>;

export const QuestionDTO = z.object({
  contents: z.array(
    z.object({
      type: z.enum(["text", "image"]),
      value: z.string(),
    })
  ),
  choices: z.array(ChoiceDTO),
});

export type QuestionDTO = z.infer<typeof QuestionDTO>;

export const ExamSummaryDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  subjectCode: z.string(),
  examCode: z.string(),
  isTimed: z.boolean(),
  durationMinutes: z.number().optional(),
  scheduledStartAt: z.string().optional(), // ISO
  allowLateSubmissions: z.boolean(),
  lateWindowMinutes: z.number(),
  totalQuestions: z.number(),
});

export type ExamSummaryDTO = z.infer<typeof ExamSummaryDTO>;

export const AnswerDTO = z.object({
  questionIndex: z.number(),
  selectedChoiceIndex: z.number(),
  isCorrect: z.boolean().optional(),
});

export type AnswerDTO = z.infer<typeof AnswerDTO>;

export const ExamResultDTO = z.object({
  participantEmail: z.string().email(),
  participantId: z.string(),
  startedAt: z.string(), // ISO
  endedAt: z.string().optional(), // ISO
  timeTakenSeconds: z.number().optional(),
  score: z.number().optional(),
  status: z.enum(["in-progress", "submitted", "late", "expired"]),
  totalQuestions: z.number(),
  answers: z.array(AnswerDTO),
});

export type ExamResultDTO = z.infer<typeof ExamResultDTO>;

export const ViewResultResponseDTO = z.object({
  ok: z.boolean(),
  errorCode: z.string().optional(),
  message: z.string().optional(),
  exam: ExamSummaryDTO.optional(),
  result: ExamResultDTO.optional(),
});

export type ViewResultResponseDTO = z.infer<typeof ViewResultResponseDTO>;
