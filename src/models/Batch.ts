/**
 * models/batch.ts
 *
 * Batch schema implementing:
 * - Batch -> Semesters -> Course -> CoursePart
 * - Per CoursePart: examDefinitions, results, attendance, assignments, others
 * - Per CoursePart: studentSummaries storing running totals and overall
 * - Only createdBy/updatedBy reference User
 *
 * Helper functions:
 * - createBatchWithCourses(Batch, userId, studentIds) => creates example batch with zeros
 * - recordExamMarksTransaction(Batch, batchId, semId, courseId, partId, studentId, examType, condition, components) =>
 *   pushes CourseResult and updates studentSummary overall atomically using a transaction
 */

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ObjId = Types.ObjectId;

/* ------------------------------- Enums ---------------------------------- */

export enum COURSE_TYPE {
    THEORY = "theory",
    LAB = "lab",
}
export type CourseType = `${COURSE_TYPE}`;

export enum EXAM_TYPE {
    MID = "mid",
    FINAL = "final",
}
export type ExamType = `${EXAM_TYPE}`;

export enum EXAM_TYPE_CONDITION {
    MAKEUP = "makeup",
    REGULAR = "regular",
}
export type ExamTypeCondition = `${EXAM_TYPE_CONDITION}`;

export enum RESULT_COMPONENT_NAME {
    TT = "tt",
    ASSIGNMENTS = "assignments",
    ATTENDANCE = "attendance",
    OTHERS = "others",
    PRACTICAL = "practical",
    VIVA = "viva",
}
export type ResultComponentName = `${RESULT_COMPONENT_NAME}`;

/* ----------------------------- Types / Interfaces ------------------------ */

export interface TeacherSnapshot {
    _id?: ObjId;
    name: string;
    designation?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ResultComponentDef {
    name: ResultComponentName;
    maxMarks: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
}

export interface ExamDefinition {
    _id?: ObjId;
    examType: ExamType;
    condition: EXAM_TYPE_CONDITION;
    totalMarks?: number;
    components: ResultComponentDef[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ResultComponent {
    name: ResultComponentName;
    marks?: number;
    maxMarks?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
}

export interface CourseResult {
    _id?: ObjId;
    student?: ObjId;
    examType: ExamType;
    condition: EXAM_TYPE_CONDITION;
    components: ResultComponent[];
    total?: number;
    grade?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CourseRecord {
    _id?: ObjId;
    student?: ObjId;
    type: ResultComponentName;
    title?: string;
    marks?: number;
    maxMarks?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
}

export interface CoursePart {
    _id?: ObjId;
    courseType: CourseType;
    credits: number;
    teachers: TeacherSnapshot[];
    examDefinitions: ExamDefinition[];
    results?: CourseResult[];     // per-student per-exam entries (mid/final)
    attendance?: CourseRecord[];  // per-part attendance
    assignments?: CourseRecord[]; // per-part assignments
    others?: CourseRecord[];      // per-part other records
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
}

export interface Course {
    _id?: ObjId;
    courseId?: ObjId;
    code?: string;
    name?: string;
    parts: CoursePart[];
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SemesterDoc {
    _id?: ObjId;
    name: string;
    index: number;
    startAt?: Date;
    endAt?: Date;
    courses: Course[];
    notes?: string;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BatchDoc extends Document {
    name: string;
    program?: string;
    year?: number;
    semesters: SemesterDoc[];
    notes?: string;
    createdBy?: ObjId; // ref User
    updatedBy?: ObjId; // ref User
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/* ---------------------------- Mongoose schemas --------------------------- */

/* Embedded small schemas */
const TeacherSnapshotSchema = new Schema<TeacherSnapshot>(
    {
        _id: { type: Schema.Types.ObjectId, required: false },
        name: { type: String, required: true, trim: true },
        designation: { type: String, trim: true },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const ResultComponentDefSchema = new Schema<ResultComponentDef>(
    {
        name: { type: String, required: true, enum: Object.values(RESULT_COMPONENT_NAME) },
        maxMarks: { type: Number, required: true, min: 0 },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const ExamDefinitionSchema = new Schema<ExamDefinition>(
    {
        examType: { type: String, required: true, enum: Object.values(EXAM_TYPE) },
        condition: { type: String, required: true, enum: Object.values(EXAM_TYPE_CONDITION) },
        totalMarks: { type: Number },
        components: { type: [ResultComponentDefSchema], default: [] },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const ResultComponentSchema = new Schema<ResultComponent>(
    {
        name: { type: String, required: true, enum: Object.values(RESULT_COMPONENT_NAME) },
        marks: { type: Number },
        maxMarks: { type: Number },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const CourseResultSchema = new Schema<CourseResult>(
    {
        student: { type: Schema.Types.ObjectId, index: true },
        examType: { type: String, required: true, enum: Object.values(EXAM_TYPE) },
        condition: { type: String, required: true, enum: Object.values(EXAM_TYPE_CONDITION) },
        components: { type: [ResultComponentSchema], default: [] },
        total: { type: Number },
        grade: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const CourseRecordSchema = new Schema<CourseRecord>(
    {
        student: { type: Schema.Types.ObjectId, index: true },
        type: { type: String, required: true, enum: Object.values(RESULT_COMPONENT_NAME) },
        title: { type: String, trim: true },
        marks: { type: Number },
        maxMarks: { type: Number },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const CoursePartSchema = new Schema<CoursePart>(
    {
        courseType: { type: String, required: true, enum: Object.values(COURSE_TYPE) },
        credits: { type: Number, required: true, min: 0 },
        teachers: { type: [TeacherSnapshotSchema], default: [] },
        examDefinitions: { type: [ExamDefinitionSchema], default: [] },
        results: { type: [CourseResultSchema], default: [] },
        attendance: { type: [CourseRecordSchema], default: [] },
        assignments: { type: [CourseRecordSchema], default: [] },
        others: { type: [CourseRecordSchema], default: [] },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const CourseSchema = new Schema<Course>(
    {
        courseId: { type: Schema.Types.ObjectId }, // plain id, no ref
        code: { type: String, trim: true },
        name: { type: String, trim: true },
        parts: { type: [CoursePartSchema], default: [] },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const SemesterSchema = new Schema<SemesterDoc>(
    {
        name: { type: String, required: true, trim: true },
        index: { type: Number, required: true },
        startAt: { type: Date },
        endAt: { type: Date },
        courses: { type: [CourseSchema], default: [] },
        notes: { type: String },
        deletedAt: { type: Date, default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const BatchSchema = new Schema<BatchDoc>(
    {
        name: { type: String, required: true, trim: true, index: true },
        program: { type: String, trim: true },
        year: { type: Number, index: true },
        semesters: { type: [SemesterSchema], default: [] },
        notes: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        deletedAt: { type: Date, default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

/* ------------------------ Middleware to maintain updatedAt ---------------- */

BatchSchema.pre("save", function (this: mongoose.Document & BatchDoc, next) {
    const now = new Date();
    if (!this.createdAt) this.createdAt = now;
    this.updatedAt = now;

    if (!Array.isArray(this.semesters)) return next();

    for (const sem of this.semesters) {
        if (!sem.createdAt) sem.createdAt = now;
        sem.updatedAt = now;

        if (Array.isArray(sem.courses)) {
            for (const course of sem.courses) {
                if (!course.createdAt) course.createdAt = now;
                course.updatedAt = now;

                if (Array.isArray(course.parts)) {
                    for (const part of course.parts) {
                        if (!part.createdAt) part.createdAt = now;
                        part.updatedAt = now;

                        if (Array.isArray(part.teachers)) {
                            for (const t of part.teachers) {
                                if (!t.createdAt) t.createdAt = now;
                                t.updatedAt = now;
                            }
                        }

                        if (Array.isArray(part.examDefinitions)) {
                            for (const ed of part.examDefinitions) {
                                if (!ed.createdAt) ed.createdAt = now;
                                ed.updatedAt = now;

                                if (Array.isArray(ed.components)) {
                                    for (const c of ed.components) {
                                        if (!c.createdAt) c.createdAt = now;
                                        c.updatedAt = now;
                                    }
                                }
                            }
                        }

                        const partArrays = ["results", "attendance", "assignments", "others", "studentSummaries"] as const;
                        for (const arrName of partArrays) {
                            const arr = (part as unknown as Record<string, unknown>)[arrName] as
                                | CourseResult[]
                                | CourseRecord[]
                                | undefined;
                            if (!Array.isArray(arr)) continue;
                            for (const it of arr) {
                                if (!it.createdAt) it.createdAt = now;
                                it.updatedAt = now;
                                const comps = (it as CourseResult).components;
                                if (Array.isArray(comps)) {
                                    for (const comp of comps) {
                                        if (!comp.createdAt) comp.createdAt = now;
                                        comp.updatedAt = now;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    next();
});

/* ----------------------------- Model export ------------------------------ */

export const Batch: Model<BatchDoc> = (mongoose.models.Batch as Model<BatchDoc>) || mongoose.model<BatchDoc>("Batch", BatchSchema);