import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ObjId = Types.ObjectId;

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

/* ----------------------------- Interfaces -------------------------------- */

export interface TeacherSnapshot {
    _id?: ObjId;
    name: string;
    designation?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MarkDistribution {
    totalMarks?: number;
    mid?: number;
    final?: number;
    tt?: number;
    assignments?: number;
    attendance?: number;
    practical?: number;
    viva?: number;
    others?: number;
}

export interface ComponentDef {
    name: ComponentNameType;
    maxMarks: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ExamConfig {
    _id?: ObjId;
    examKind: ExamKindType;
    condition: ExamConditionType;
    totalMarks?: number; // configured total for this exam entry
    components?: ComponentDef[]; // template of components (maxMarks)
    // createdAt/updatedAt present
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
}

export interface ObtainedComponent {
    name: ComponentNameType;
    obtainedMarks?: number;
    maxMarks?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface StudentExamResult {
    _id?: ObjId;
    student: ObjId;
    examKind: ExamKindType;
    condition: ExamConditionType;
    // components for this student-exam (obtained marks)
    components: ObtainedComponent[];
    totalObtained?: number;
    grade?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CourseSection {
    _id?: ObjId;
    delivery: CourseDeliveryType; // theory | lab
    credits: number;
    teachers: TeacherSnapshot[];
    // templates
    examConfigs: ExamConfig[];
    // per-student results and also other arrays (attendance, assignments, others)
    results?: StudentExamResult[]; // per-student per-exam entries
    attendance?: ObtainedComponent[]; // optional separate arrays if needed
    assignments?: ObtainedComponent[];
    others?: ObtainedComponent[];
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Course {
    _id?: ObjId;
    courseRefId?: ObjId; // reference to course catalog (optional)
    code?: string;
    title?: string;
    parts: CourseSection[]; // sections/parts of the course
    markDistribution?: MarkDistribution; // matches your JSON `markDistributions`
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SemesterDoc {
    _id?: ObjId;
    title: string;
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
    registrationPrefix?: string; // was studentRegistration in JSON
    title: string; // was name
    program?: string;
    admissionYear?: number; // was year
    semesters: SemesterDoc[];
    notes?: string;
    createdBy?: ObjId; // ref User
    updatedBy?: ObjId; // ref User
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/* ---------------------------- Mongoose schemas --------------------------- */

/* Small embedded schemas */

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

const ComponentDefSchema = new Schema<ComponentDef>(
    {
        name: { type: String, required: true, enum: Object.values(ComponentName) },
        maxMarks: { type: Number, required: true, min: 0 },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const ExamConfigSchema = new Schema<ExamConfig>(
    {
        examKind: { type: String, required: true, enum: Object.values(ExamKind) },
        condition: { type: String, required: true, enum: Object.values(ExamCondition) },
        totalMarks: { type: Number },
        components: { type: [ComponentDefSchema], default: [] },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const ObtainedComponentSchema = new Schema<ObtainedComponent>(
    {
        name: { type: String, required: true, enum: Object.values(ComponentName) },
        obtainedMarks: { type: Number },
        maxMarks: { type: Number },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const StudentExamResultSchema = new Schema<StudentExamResult>(
    {
        student: { type: Schema.Types.ObjectId, required: true, index: true },
        examKind: { type: String, required: true, enum: Object.values(ExamKind) },
        condition: { type: String, required: true, enum: Object.values(ExamCondition) },
        components: { type: [ObtainedComponentSchema], default: [] },
        totalObtained: { type: Number },
        grade: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const CourseSectionSchema = new Schema<CourseSection>(
    {
        delivery: { type: String, required: true, enum: Object.values(CourseDelivery) },
        credits: { type: Number, required: true, min: 0 },
        teachers: { type: [TeacherSnapshotSchema], default: [] },
        examConfigs: { type: [ExamConfigSchema], default: [] },
        results: { type: [StudentExamResultSchema], default: [] },
        attendance: { type: [ObtainedComponentSchema], default: [] },
        assignments: { type: [ObtainedComponentSchema], default: [] },
        others: { type: [ObtainedComponentSchema], default: [] },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const MarkDistributionSchema = new Schema<MarkDistribution>(
    {
        totalMarks: { type: Number },
        mid: { type: Number },
        final: { type: Number },
        tt: { type: Number },
        assignments: { type: Number },
        attendance: { type: Number },
        practical: { type: Number },
        viva: { type: Number },
        others: { type: Number },
    },
    { _id: false }
);

const CourseSchema = new Schema<Course>(
    {
        courseRefId: { type: Schema.Types.ObjectId }, // optional link to a course catalog
        code: { type: String, trim: true, index: true },
        title: { type: String, trim: true },
        parts: { type: [CourseSectionSchema], default: [] },
        markDistribution: { type: MarkDistributionSchema, default: {} },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const SemesterSchema = new Schema<SemesterDoc>(
    {
        title: { type: String, required: true, trim: true },
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
        registrationPrefix: { type: String, trim: true }, // maps to studentRegistration
        title: { type: String, required: true, trim: true, index: true }, // maps to name
        program: { type: String, trim: true },
        admissionYear: { type: Number, index: true }, // maps to year
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

    // Helper to safely update createdAt/updatedAt recursively
    const touch = <T extends { createdAt?: Date; updatedAt?: Date }>(obj: T): void => {
        if (!obj.createdAt) obj.createdAt = now;
        obj.updatedAt = now;
    };

    touch(this);

    if (!Array.isArray(this.semesters)) return next();

    for (const sem of this.semesters) {
        touch(sem);

        if (!Array.isArray(sem.courses)) continue;

        for (const course of sem.courses) {
            touch(course);

            if (!Array.isArray(course.parts)) continue;

            for (const part of course.parts) {
                touch(part);

                if (Array.isArray(part.teachers)) {
                    for (const t of part.teachers) touch(t);
                }

                if (Array.isArray(part.examConfigs)) {
                    for (const ed of part.examConfigs) {
                        touch(ed);
                        if (Array.isArray(ed.components)) {
                            for (const c of ed.components) touch(c);
                        }
                    }
                }

                // Strongly typed mapping of array properties on CourseSection
                const sectionArrays: {
                    results?: StudentExamResult[];
                    attendance?: ObtainedComponent[];
                    assignments?: ObtainedComponent[];
                    others?: ObtainedComponent[];
                } = {
                    results: part.results,
                    attendance: part.attendance,
                    assignments: part.assignments,
                    others: part.others,
                };

                for (const key of Object.keys(sectionArrays) as (keyof typeof sectionArrays)[]) {
                    const arr = sectionArrays[key];
                    if (!Array.isArray(arr)) continue;

                    for (const it of arr) {
                        touch(it);

                        // Only StudentExamResult has `components`
                        if ("components" in it && Array.isArray(it.components)) {
                            for (const comp of it.components) touch(comp);
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