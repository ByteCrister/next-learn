// types/types.exam.ts

/** Validation rule for participant IDs */
export interface ValidationRule {
    startsWith?: string[];
    maxLength?: number;
    minLength?: number;
    regex?: string;
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
    questionIndex: number;        // index in the exam.questions array
    selectedChoiceIndex: number;  // index of the chosen option
    isCorrect?: boolean;          // grading flag (optional)
}

/** One participant’s result for an exam */
export interface ExamResultDTO {
    _id: string;
    participantId: string;
    participantEmail: string;
    score?: number;
    status: "in-progress" | "submitted" | "late" | "expired";
    startedAt: string;       // ISO date string
    endedAt?: string;        // ISO date string
    answers: AnswerDTO[];    // newly added field
}


/** An exam returned from GET /api/exams or GET /api/exams/[examId] */
export interface ExamDTO {
    _id: string;
    title: string;
    description?: string;
    subjectCode: string;
    examCode: string;
    validationRule: ValidationRule;
    createdBy: string;             // user ObjectId as string
    questions: Question[];

    isTimed?: boolean;
    durationMinutes?: number;
    scheduledStartAt?: string | null;
    scheduledEndAt?: string | null;
    allowLateSubmissions?: boolean;
    lateWindowMinutes?: number;
    autoSubmitOnEnd?: boolean;

    createdAt: string;             // ISO date string
    updatedAt: string;             // ISO date string

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
}

/** Response payload for listing exams */
export type GetExamOverviewResponse = ExamOverviewCard[];

/** Response from GET /api/exams */
export type GetExamsResponse = ExamDTO[];

/** Response from GET /api/exams/[examId] */
export type GetExamResponse = ExamDTO;
