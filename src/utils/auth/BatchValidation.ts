import * as yup from "yup";
import {
    COURSE_TYPE,
    EXAM_TYPE,
    EXAM_TYPE_CONDITION,
    RESULT_COMPONENT_NAME,
    TeacherSnapshot,
    ResultComponentDef,
    ExamDefinition,
    CoursePart,
    Course,
    Semester,
    Batch,
    CourseResult,
} from "@/types/types.batch";

/* ---------------- ResultComponentDef ---------------- */
const resultComponentSchema: yup.ObjectSchema<ResultComponentDef> = yup
    .object({
        name: yup
            .mixed<RESULT_COMPONENT_NAME>()
            .oneOf(Object.values(RESULT_COMPONENT_NAME))
            .required("Component name is required"),
        maxMarks: yup
            .number()
            .typeError("Max marks must be a number")
            .required("Max marks required")
            .min(0, "Max marks cannot be negative"),
        notes: yup.string().optional(),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
    })
    .noUnknown();

/* ---------------- ExamDefinition ---------------- */
const examDefinitionSchema: yup.ObjectSchema<ExamDefinition> = yup
    .object({
        _id: yup.string().optional(),
        examType: yup
            .mixed<EXAM_TYPE>()
            .oneOf(Object.values(EXAM_TYPE))
            .required("Exam type required"),
        condition: yup
            .mixed<EXAM_TYPE_CONDITION>()
            .oneOf(Object.values(EXAM_TYPE_CONDITION))
            .required("Condition required"),
        totalMarks: yup
            .number()
            .transform((val, orig) => (orig === "" ? undefined : val))
            .typeError("Total marks must be a number")
            .min(0, "Total marks cannot be negative")
            .optional(),
        components: yup
            .array()
            .of(resultComponentSchema)
            .required()
            .min(1, "At least one result component is required")
            .test(
                "sum-leq-total",
                "Sum of component marks cannot exceed total",
                function (components) {
                    const total = this.parent.totalMarks;
                    if (!Array.isArray(components) || total == null) return true;
                    const sum = components.reduce((acc, c) => acc + (c.maxMarks ?? 0), 0);
                    return sum <= total;
                }
            ),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
    })
    .noUnknown();

/* ---------------- TeacherSnapshot ---------------- */
const teacherSchema: yup.ObjectSchema<TeacherSnapshot> = yup
    .object({
        _id: yup.string().optional(),
        name: yup
            .string()
            .trim()
            .required("Teacher name is required")
            .max(150, "Teacher name too long"),
        designation: yup.string().optional(),
        notes: yup.string().optional(),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
    })
    .noUnknown();

const courseResultSchema: yup.ObjectSchema<CourseResult> = yup.object({
    _id: yup.string().optional(),
    student: yup.string().optional(),
    examType: yup.mixed<EXAM_TYPE>().oneOf(Object.values(EXAM_TYPE)).required(),
    condition: yup
        .mixed<EXAM_TYPE_CONDITION>()
        .oneOf(Object.values(EXAM_TYPE_CONDITION))
        .required(),
    components: yup.array().of(resultComponentSchema).required(),
    total: yup.number().optional(),
    grade: yup.string().optional(),
    createdAt: yup.string().optional(),
    updatedAt: yup.string().optional(),
});


/* ---------------- CoursePart ---------------- */
const coursePartSchema: yup.ObjectSchema<CoursePart> = yup
    .object({
        _id: yup.string().optional(),
        courseType: yup
            .mixed<COURSE_TYPE>()
            .oneOf(Object.values(COURSE_TYPE))
            .required("Part type required"),
        credits: yup
            .number()
            .typeError("Credits must be a number")
            .required("Credits required")
            .min(0, "Credits cannot be negative")
            .max(100, "Credits looks too large"),
        teachers: yup.array().of(teacherSchema).required().min(1),
        examDefinitions: yup.array().of(examDefinitionSchema).required().min(1),
        notes: yup.string().optional(),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
        results: yup.array().of(courseResultSchema).optional(),
    })
    .noUnknown();

/* ---------------- Course ---------------- */
const courseSchema: yup.ObjectSchema<Course> = yup
    .object({
        _id: yup.string().optional(),
        courseId: yup.string().optional(),
        code: yup.string().optional(),
        name: yup.string().optional(),
        parts: yup.array().of(coursePartSchema).required().min(1),
        notes: yup.string().optional(),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
    })
    .noUnknown();

/* ---------------- Semester ---------------- */
const semesterSchema: yup.ObjectSchema<Semester> = yup
    .object({
        _id: yup.string().optional(),
        name: yup
            .string()
            .trim()
            .required("Semester name required")
            .max(200, "Semester name too long"),
        index: yup
            .number()
            .typeError("Index must be a number")
            .required("Index required")
            .min(1, "Index must be at least 1"),
        startAt: yup
            .string()
            .transform((v) => (v === "" ? undefined : v))
            .optional()
            .test("is-valid", "Invalid start date", (v) => !v || !Number.isNaN(new Date(v).getTime())),
        endAt: yup
            .string()
            .transform((v) => (v === "" ? undefined : v))
            .optional()
            .test("is-valid", "Invalid end date", (v) => !v || !Number.isNaN(new Date(v).getTime()))
            .test("after-start", "End must be same or after start", function (end) {
                const start = this.parent.startAt;
                if (!start || !end) return true;
                return new Date(start).getTime() <= new Date(end).getTime();
            }),
        courses: yup.array().of(courseSchema).required().min(1),
        notes: yup.string().optional(),
        deletedAt: yup.string().optional(),
        createdAt: yup.string().optional(),
        updatedAt: yup.string().optional(),
    })
    .noUnknown();

/* ---------------- Batch ---------------- */
export const validationSchema: yup.ObjectSchema<
    Omit<Batch, "_id" | "createdAt" | "updatedAt">
> = yup
    .object({
        name: yup.string().trim().required("Name is required").max(100, "Name too long"),
        program: yup.string().optional(),
        year: yup
            .number()
            .transform((v, o) => (o === "" ? undefined : v))
            .optional()
            .test("valid-year", "Invalid year", (val) => {
                if (val == null) return true;
                const y = new Date().getFullYear();
                return val >= 1900 && val <= y + 5;
            }),
        notes: yup.string().optional(),
        semesters: yup.array().of(semesterSchema).required().min(1),
        createdBy: yup.string().optional(),
        updatedBy: yup.string().optional(),
        deletedAt: yup.string().optional(),
    })
    .noUnknown();
