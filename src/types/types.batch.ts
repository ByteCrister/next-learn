// types.batch.ts
// Frontend / UI types for Next.js + TypeScript + Zustand
// Use string IDs for ObjectId (ID)

export type ID = string;

/* ------------------------------- Enums ---------------------------------- */

export enum CourseDelivery {
    THEORY = "theory",
    LAB = "lab",
}
export type CourseDeliveryType = `${CourseDelivery}`;

export enum ExamKind {
    MID = "mid",
    FINAL = "final",
}
export type ExamKindType = `${ExamKind}`;

export enum ExamCondition {
    MAKEUP = "makeup",
    REGULAR = "regular",
}
export type ExamConditionType = `${ExamCondition}`;

export enum ComponentName {
    TT = "tt",
    ASSIGNMENTS = "assignments",
    ATTENDANCE = "attendance",
    OTHERS = "others",
    PRACTICAL = "practical",
    VIVA = "viva",
}
export type ComponentNameType = `${ComponentName}`;

/* ----------------------------- Domain types -------------------------------- */

/** Snapshot of a teacher (frontend-friendly) */
export type TeacherSnapshot = {
    _id?: ID;
    name: string;
    designation?: string;
    notes?: string;
    createdAt?: string; // ISO
    updatedAt?: string; // ISO
};

/** Mark distribution for a course (matches server markDistribution) */
export type MarkDistribution = {
    totalMarks?: number;
    mid?: number;
    final?: number;
    tt?: number;
    assignments?: number;
    attendance?: number;
    practical?: number;
    viva?: number;
    others?: number;
};

/** Component template that defines max marks for an exam component */
export type ComponentDef = {
    name: ComponentNameType;
    maxMarks: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Exam configuration (template) for a CourseSection */
export type ExamConfig = {
    _id?: ID;
    examKind: ExamKindType;
    condition: ExamConditionType;
    totalMarks?: number;
    components?: ComponentDef[]; // template (maxMarks)
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Component marks recorded for a student (obtained marks) */
export type ObtainedComponent = {
    name: ComponentNameType;
    obtainedMarks?: number;
    maxMarks?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Per-student exam result entry */
export type StudentExamResult = {
    _id?: ID;
    student: ID;
    examKind: ExamKindType;
    condition: ExamConditionType;
    components: ObtainedComponent[]; // obtained marks per component
    totalObtained?: number;
    grade?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Course section (was CoursePart / CourseSection on server) */
export type CourseSection = {
    _id?: ID;
    delivery: CourseDeliveryType; // theory | lab
    credits: number;
    teachers: TeacherSnapshot[];
    examConfigs: ExamConfig[]; // templates for exams
    results?: StudentExamResult[]; // per-student per-exam entries
    attendance?: ObtainedComponent[]; // optional arrays for other records
    assignments?: ObtainedComponent[];
    others?: ObtainedComponent[];
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Course entry inside a semester */
export type Course = {
    _id?: ID;
    courseRefId?: ID | null; // optional link to course catalog
    code?: string;
    title?: string;
    parts: CourseSection[]; // sections/parts of the course
    markDistribution?: MarkDistribution;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};

/** Semester embedded inside a cohort */
export type Semester = {
    _id?: ID;
    title: string; // e.g., "5th Semester"
    index: number; // 1-based order
    startAt: string;
    endAt: string;
    courses: Course[];
    notes?: string;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

/** Top-level Cohort document (was Cohort on server; formerly Batch) */
export type Cohort = {
    _id: ID;
    registrationPrefix?: string; // optional mapping from previous studentRegistration
    title: string; // cohort name
    program?: string;
    admissionYear?: number;
    semesters: Semester[];
    notes?: string;
    createdBy?: ID;
    updatedBy?: ID;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

/* ---------------------------- API payload types ------------------------- */

/** Payload to create a cohort */
export type CreateCohortPayload = {
    registrationPrefix?: string;
    title: string;
    program?: string;
    admissionYear?: number;
    notes?: string;
    semesters?: Array<{
        title: string;
        index: number;
        startAt?: string;
        endAt?: string;
        notes?: string;
        courses?: Array<{
            courseRefId?: ID | null;
            code?: string;
            title?: string;
            markDistribution?: MarkDistribution;
            notes?: string;
            parts?: Array<{
                delivery: CourseDeliveryType;
                credits: number;
                notes?: string;
                teachers?: Array<{
                    name: string;
                    designation?: string;
                    notes?: string;
                }>;
                examConfigs?: Array<{
                    examKind: ExamKindType;
                    condition: ExamConditionType;
                    totalMarks?: number;
                    components?: Array<{ name: ComponentNameType; maxMarks: number }>;
                }>;
            }>;
        }>;
    }>;
};

/** Partial update payload for Cohort */
export type UpdateCohortPayload = Partial<{
    _id: ID;
    registrationPrefix: string | null;
    title: string | null;
    program: string | null;
    admissionYear: number | null;
    notes: string | null;
    semesters: Semester[] | null; // full replacement or null to clear
    updatedBy?: ID;
}> & { _id: ID };

/** Soft delete payload */
export type DeleteCohortPayload = { _id: ID; deletedBy?: ID };

/* ---------------------------- API response types ------------------------ */

export type APIError = {
    status: number;
    message: string;
    details?: unknown;
};

export type GetCohortResponse = { data: Cohort };
export type CreateCohortResponse = { data: Cohort };
export type UpdateCohortResponse = { data: Cohort };
export type DeleteCohortResponse = { success: boolean; _id?: ID };

export type ListCohortsResponse = { data: Cohort[]; total: number };

/* --------------------------- UI / Zustand types ------------------------- */

/** Minimal card used on cohort lists */
export type CohortCard = Pick<Cohort, "_id" | "title" | "program" | "admissionYear" | "createdAt"> & {
    semesterCount: number;
};

/** Zustand state shape for cohorts page */
export type CohortsState = {
    cohorts: Cohort[];
    currentCohort?: Cohort | null;
    total: number;
    loading: boolean;
    error?: APIError | null;

    fetchCohorts: () => Promise<void>;
    fetchCohortById: (id: ID) => Promise<void>;
    createCohort: (payload: CreateCohortPayload) => Promise<Cohort>;
    updateCohort: (payload: UpdateCohortPayload) => Promise<Cohort>;
    deleteCohort: (payload: DeleteCohortPayload) => Promise<void>;

    setError: (err: APIError | null) => void;
    reset: () => void;
};