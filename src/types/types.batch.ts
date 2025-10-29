// types.batch.ts
// Frontend / UI types for Next.js + TypeScript + Zustand (use plain string IDs for ObjectId)

export type ID = string;

/* ------------------------------- Enums ---------------------------------- */

export enum COURSE_TYPE {
    THEORY = "theory",
    LAB = "lab",
}

export enum EXAM_TYPE {
    MID = "mid",
    FINAL = "final",
}

export enum EXAM_TYPE_CONDITION {
    MAKEUP = "makeup",
    REGULAR = "regular",
}

export enum RESULT_COMPONENT_NAME {
    TT = "tt",
    ASSIGNMENTS = "assignments",
    ATTENDANCE = "attendance",
    OTHERS = "others",
    PRACTICAL = "practical",
    VIVA = "viva",
}

/* ----------------------------- Domain types ------------------------------ */

/** Snapshot of a teacher (frontend-friendly) */
export type TeacherSnapshot = {
    _id?: ID;
    name: string;
    designation?: string;
    notes?: string;
    createdAt?: string; // ISO
    updatedAt?: string; // ISO
};

/** Definition of a result component inside an exam (max marks) */
export type ResultComponentDef = {
    name: RESULT_COMPONENT_NAME;
    maxMarks: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Exam definition for a course part (mid / final + condition + distribution) */
export type ExamDefinition = {
    _id?: ID;
    examType: EXAM_TYPE;
    condition: EXAM_TYPE_CONDITION;
    totalMarks?: number;
    components: ResultComponentDef[];
    createdAt?: string;
    updatedAt?: string;
};

/** Individual recorded marks component (actual marks for a student) */
export type ResultComponent = {
    name: RESULT_COMPONENT_NAME;
    marks?: number;
    maxMarks?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Per-student per-exam result (inside a CoursePart) */
export type CourseResult = {
    _id?: ID;
    student?: ID;
    examType: EXAM_TYPE;
    condition: EXAM_TYPE_CONDITION;
    components: ResultComponent[];
    total?: number;
    grade?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Attendance / assignment / other record shape */
export type CourseRecord = {
    _id?: ID;
    student?: ID;
    type: RESULT_COMPONENT_NAME;
    title?: string;
    marks?: number;
    maxMarks?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Aggregated running totals for a student inside a CoursePart (fast UI reads) */
export type StudentSummary = {
    _id?: ID;
    student: ID;
    mid?: number;
    final?: number;
    tt?: number;
    assignments?: number;
    attendance?: number;
    others?: number;
    overall?: number;
    createdAt?: string;
    updatedAt?: string;
};

/** Course part (theory / lab) containing exam definitions and per-part records */
export type CoursePart = {
    _id?: ID;
    courseType: COURSE_TYPE;
    credits: number;
    teachers: TeacherSnapshot[];
    examDefinitions: ExamDefinition[]; // distribution metadata
    results?: CourseResult[]; // recorded exam entries
    attendance?: CourseRecord[];
    assignments?: CourseRecord[];
    others?: CourseRecord[];
    studentSummaries?: StudentSummary[]; // aggregated running totals
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Course assignment within a semester (can contain multiple parts) */
export type Course = {
    _id?: ID;
    courseId?: ID; // optional plain course identifier
    code?: string;
    name?: string;
    parts: CoursePart[]; // usually theory and/or lab
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Semester embedded inside a batch */
export type Semester = {
    _id?: ID;
    name: string; // e.g., "Semester 1"
    index: number; // 1-based order
    startAt?: string;
    endAt?: string;
    courses: Course[];
    notes?: string;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

/** Top-level batch document used by the UI */
export type Batch = {
    _id: ID;
    name: string; // e.g., "Summer-22"
    program?: string;
    year?: number;
    semesters: Semester[];
    notes?: string;
    createdBy?: ID;
    updatedBy?: ID;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

/* ---------------------------- API payload types ------------------------- */

/** Used when creating a batch (frontend -> API) */
export type CreateBatchPayload = {
    name: string;
    program?: string;
    year?: number;
    notes?: string;
    // optionally pre-seed semesters / courses for UI creation flows
    semesters?: Array<{
        name: string;
        index: number;
        startAt?: string;
        endAt?: string;
        notes?: string;
        courses?: Array<{
            courseId?: ID;
            code?: string;
            name?: string;
            notes?: string;
            parts?: Array<{
                courseType: COURSE_TYPE;
                credits: number;
                notes?: string;
                teachers?: Array<{
                    name: string;
                    designation?: string;
                    notes?: string;
                }>;
                examDefinitions?: Array<{
                    examType: EXAM_TYPE;
                    condition: EXAM_TYPE_CONDITION;
                    totalMarks?: number;
                    components?: Array<{ name: RESULT_COMPONENT_NAME; maxMarks: number }>;
                }>;
            }>;
        }>;
    }>;
};

/** Payload to update a batch (partial) */
export type UpdateBatchPayload = Partial<{
    name: string;
    program: string | null;
    year: number | null;
    notes: string | null;
    // For nested edits, prefer dedicated endpoints; allow full replacement arrays when needed:
    semesters?: Semester[] | null; // full replacement of semesters array or explicit null to clear
    updatedBy?: ID;
}> & { _id: ID };

/** Payload to delete (soft) */
export type DeleteBatchPayload = { _id: ID; deletedBy?: ID };

/* ---------------------------- API response types ------------------------ */

/** Generic error response shape */
export type APIError = {
    status: number;
    message: string;
    details?: unknown;
};

/** Response for fetching a single batch */
export type GetBatchResponse = {
    data: Batch;
};

/** Response after create */
export type CreateBatchResponse = {
    data: Batch;
};

/** Response after update */
export type UpdateBatchResponse = {
    data: Batch;
};

/** Response after delete */
export type DeleteBatchResponse = {
    success: boolean;
    _id?: ID;
};

/* --------------------------- UI / Zustand types ------------------------- */

/* Response for list batches (all) */
export type ListBatchesResponse = {
    data: Batch[];
    total: number;
};

/* Zustand state and actions for /batches page (shape only) */
export type BatchesState = {
    // Data
    batches: Batch[]; // cached list of all batches
    currentBatch?: Batch | null;

    // Loading / error
    total: number;
    loading: boolean;
    error?: APIError | null;

    // Actions
    fetchBatches: () => Promise<void>;
    fetchBatchById: (id: ID) => Promise<void>;
    createBatch: (payload: CreateBatchPayload) => Promise<Batch>;
    updateBatch: (payload: UpdateBatchPayload) => Promise<Batch>;
    deleteBatch: (payload: DeleteBatchPayload) => Promise<void>;

    // Helpers
    setError: (err: APIError | null) => void;
    reset: () => void;
};

/* --------------------------- Utility / View types ----------------------- */

/** Minimal summary used on /batches list cards */
export type BatchCard = Pick<Batch, "_id" | "name" | "program" | "year" | "createdAt"> & {
    semesterCount: number;
    studentCount?: number; // optional if available from API
};

/* ---------------------------- Notes for frontend ------------------------ */

/*
 - Use ID (string) everywhere in the frontend; convert to/from ObjectId server-side.
 - Prefer dedicated endpoints for nested edits (add semester, add course, update student summary)
   rather than sending full nested arrays for small changes.
 - StudentSummary exists inside CoursePart.studentSummaries to allow fast UI reads.
 - Use the Zustand store shape BatchesState to implement the client store for /batches page.
 - API responses should match the response types above (ListBatchesResponse, GetBatchResponse).
*/
