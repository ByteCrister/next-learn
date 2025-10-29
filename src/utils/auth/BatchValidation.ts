import * as yup from "yup";

/* --------- Validation schemas ---------- */
const resultComponentSchema = yup.object({
    name: yup.string().required(),
    maxMarks: yup.number().required().min(0),
});

const examDefinitionSchema = yup.object({
    examType: yup.string().required(),
    condition: yup.string().required(),
    totalMarks: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value)),
    components: yup.array().of(resultComponentSchema).required(),
});

const teacherSchema = yup.object({
    name: yup.string().required("Teacher name required"),
    designation: yup.string().nullable(),
    notes: yup.string().nullable(),
});

const coursePartSchema = yup.object({
    courseType: yup.string().required(),
    credits: yup.number().required().min(0),
    teachers: yup.array().of(teacherSchema).required(),
    examDefinitions: yup.array().of(examDefinitionSchema).required(),
    notes: yup.string().nullable(),
});

const courseSchema = yup.object({
    code: yup.string().nullable(),
    name: yup.string().nullable(),
    courseId: yup.string().nullable(),
    parts: yup.array().of(coursePartSchema).required().min(1, "At least one part"),
    notes: yup.string().nullable(),
});

const semesterSchema = yup.object({
    name: yup.string().required("Semester name required"),
    index: yup.number().required().min(1),
    startAt: yup.string().nullable(),
    endAt: yup.string().nullable(),
    courses: yup.array().of(courseSchema).required(),
    notes: yup.string().nullable(),
});

export const validationSchema = yup.object({
    name: yup.string().trim().required("Name is required").max(100),
    program: yup.string().nullable().max(100),
    year: yup
        .string()
        .nullable()
        .test("is-valid-year-or-empty", "Invalid year", (val) => {
            if (val == null || val === "") return true;
            const n = Number(val);
            if (!Number.isFinite(n)) return false;
            return n >= 1900 && n <= new Date().getFullYear() + 5;
        }),
    notes: yup.string().nullable().max(2000),
    semesters: yup.array().of(semesterSchema).required(),
});