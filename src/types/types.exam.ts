// types/types.exam.ts

/** Input for checking an existing exam */
export interface CheckExamInput {
  participantId: string;
  subjectCode: string;
  examCode: string;
  createdBy: string; // user ObjectId as string
}

/** Response from checking an existing exam */
export interface ExamCheckResponse {
  exam?: ExamDTO; // optional, present if check passes
}

/** Validation rule for participant IDs */
export interface ValidationRule {
  startsWith?: string[];
  maxLength?: number;
  minLength?: number;
}

/** A piece of question content (text or image) */
export interface QuestionContent {
  type: "text" | "image";
  value: string;
}

/** A single choice in a question */
export interface Choice {
  text: string;
  /** only present on the server for grading, not typically exposed to takers */
  isCorrect?: boolean;
}

/** A question with its contents and choices */
export interface Question {
  contents?: QuestionContent[];
  choices: Choice[];
}

/** One answer in a participant’s result */
export interface AnswerDTO {
  questionIndex: number; // index in the exam.questions array
  selectedChoiceIndex: number; // index of the chosen option
  isCorrect?: boolean; // grading flag (optional)
}

/** One participant’s result for an exam */
export interface ExamResultDTO {
  _id: string;
  participantId: string;
  participantEmail: string;
  status: "in-progress" | "submitted" | "late" | "expired";
  score: number;
  startedAt: string; // ISO date string
  endedAt: string; // ISO date string
  answers: AnswerDTO[]; // newly added field
}

/** An exam returned from GET /api/exams or GET /api/exams/[examId] */
export interface ExamDTO {
  _id: string;
  title: string;
  description?: string;
  subjectCode: string;
  examCode: string;
  validationRule: ValidationRule;
  createdBy: string; // user ObjectId as string
  questions: Question[];

  isTimed?: boolean;
  durationMinutes?: number;
  scheduledStartAt?: string | null;
  allowLateSubmissions?: boolean;
  lateWindowMinutes?: number;
  autoSubmitOnEnd?: boolean;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  /** All results associated with this exam */
  results: ExamResultDTO[];
}

/** Exam Card type to show all exams in card form with view exam and result button */
export interface ExamOverviewCard {
  _id: string;
  title: string;
  description?: string;
  subjectCode: string;
  examCode: string;

  // New fields
  isTimed: boolean;
  durationMinutes?: number;
  scheduledStartAt?: string | null;
  allowLateSubmissions: boolean;

  questionCount: number;
  status: "draft" | "scheduled" | "active" | "completed";
  createdAt: string;
  updatedAt: string;
}

/** Timing info for an exam relative to the current time */
interface Time {
  /** Whether the exam has a scheduled start time */
  hasSchedule: boolean;

  /** True if the current time is before the scheduled start time */
  beforeSchedule: boolean;

  /** Milliseconds remaining until the exam's scheduled start (0 if already started) */
  beforeStartCountdownMs: number;

  /** True if the exam has a time limit */
  isTimed: boolean;

  /** True if the exam is untimed (no limit) */
  unlimited: boolean;

  /** True if late submissions are allowed */
  allowLate: boolean;

  /** Late submission window in milliseconds (0 if not allowed) */
  lateWindowMs: number;

  /** True if the participant has started the exam */
  started: boolean;

  /** Timestamp (ms) when the main exam period ends, null if not started or untimed */
  mainEnd: number | null;

  /** Timestamp (ms) when the absolute cut-off (including late window) ends, null if not started or untimed */
  hardEnd: number | null;

  /** Remaining milliseconds in the main exam period, null if not started or untimed */
  remainingMainMs: number | null;

  /** Remaining milliseconds in the late submission window, null if not applicable */
  remainingLateMs: number | null;

  /** True if currently in the main exam period */
  inMainTime: boolean;

  /** True if currently in the late submission window */
  inLateWindow: boolean;

  /** True if the exam time has fully expired (main + late window) */
  isExpired: boolean;
}

/** Complete timing info for an exam, or null if exam data is not available */
export type ExamTiming = Time | null;

/** Response payload for listing exams */
export type GetExamOverviewResponse = ExamOverviewCard[];

/** Response from GET /api/exams */
export type GetExamsResponse = ExamDTO[];

/** Response from GET /api/exams/[examId] */
export type GetExamResponse = ExamDTO;

export type SubmitResult = Omit<ExamResultDTO, "score">
