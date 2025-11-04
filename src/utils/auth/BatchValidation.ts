import * as yup from "yup";
import { CourseDelivery, ExamKind, ExamCondition, ComponentName } from "@/types/types.batch";

/* --------- Reusable pieces ---------- */

const nonEmptyString = () =>
    yup
        .string()
        .trim()
        .nullable()
        .transform((v, o) => (o === "" ? null : v));

const optionalNumberFromEmpty = () =>
    yup
        .number()
        .nullable()
        .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? null : value
        );

/* --------- Nested schemas ---------- */

const resultComponentSchema = yup.object({
    _uid: yup.string().nullable(),
    name: yup
        .string()
        .oneOf(
            [
                ComponentName.TT,
                ComponentName.ASSIGNMENTS,
                ComponentName.ATTENDANCE,
                ComponentName.OTHERS,
                ComponentName.PRACTICAL,
                ComponentName.VIVA,
            ],
            "Invalid component"
        )
        .required("Component name is required"),
    maxMarks: yup
        .number()
        .typeError("Max marks must be a number")
        .required("Max marks required")
        .min(0, "Max marks cannot be negative")
        .integer("Max marks must be an integer"),
});

const examDefinitionSchema = yup.object({
    _uid: yup.string().nullable(),
    examType: yup
        .string()
        .oneOf([ExamKind.MID, ExamKind.FINAL], "Invalid exam type")
        .required("Exam type required"),
    condition: yup
        .string()
        .oneOf([ExamCondition.REGULAR, ExamCondition.MAKEUP], "Invalid exam condition")
        .required("Exam condition required"),
    totalMarks: optionalNumberFromEmpty(),
    components: yup
        .array()
        .of(resultComponentSchema)
        .required("Components required")
        .min(1, "At least one component is required"),
});

const teacherSchema = yup.object({
    _uid: yup.string().nullable(),
    name: yup.string().trim().required("Teacher name required"),
    designation: nonEmptyString(),
    notes: nonEmptyString(),
});

const coursePartSchema = yup.object({
    _uid: yup.string().nullable(),
    courseType: yup
        .string()
        .oneOf([CourseDelivery.THEORY, CourseDelivery.LAB], "Invalid part type")
        .required("Part type required"),
    credits: yup
        .number()
        .typeError("Credits must be a number")
        .required("Credits required")
        .min(0, "Credits cannot be negative")
        .integer("Credits must be an integer"),
    teachers: yup
        .array()
        .of(teacherSchema)
        .required("Teachers required")
        .min(1, "At least one teacher is required"),
    examDefinitions: yup
        .array()
        .of(examDefinitionSchema)
        .required("Exam definitions required")
        .min(1, "At least one exam definition is required"),
    notes: nonEmptyString(),
});

const courseSchema = yup.object({
    _uid: yup.string().nullable(),
    code: nonEmptyString(),
    name: nonEmptyString(),
    courseId: nonEmptyString(),
    parts: yup
        .array()
        .of(coursePartSchema)
        .required("Course parts required")
        .min(1, "At least one part is required"),
    notes: nonEmptyString(),
    markDistribution: yup
        .object()
        .nullable()
        .shape({
            totalMarks: optionalNumberFromEmpty(),
            mid: optionalNumberFromEmpty(),
            final: optionalNumberFromEmpty(),
            tt: optionalNumberFromEmpty(),
            assignments: optionalNumberFromEmpty(),
            attendance: optionalNumberFromEmpty(),
            practical: optionalNumberFromEmpty(),
            viva: optionalNumberFromEmpty(),
            others: optionalNumberFromEmpty(),
        })
        .noUnknown(false),
});

const semesterSchema = yup
    .object({
        _uid: yup.string().nullable(),
        name: yup.string().trim().required("Semester name required"),
        index: yup
            .number()
            .typeError("Index must be a number")
            .required("Index required")
            .min(1, "Index must be >= 1")
            .integer("Index must be an integer"),
        startAt: nonEmptyString(), // optional date string ("" -> null)
        endAt: nonEmptyString(),
        courses: yup
            .array()
            .of(courseSchema)
            .required("Courses required")
            .min(1, "At least one course is required"),
        notes: nonEmptyString(),
    })
    .test(
        "end-after-start",
        "End date must be the same or after start date",
        function (value) {
            // `value` is the entire semester object
            if (!value) return true;
            const { startAt, endAt } = value as { startAt?: string | null; endAt?: string | null };

            if (!startAt || !endAt) return true; // if either missing, skip this test

            // parse to Date using YYYY-MM-DD format (works with <input type="date">)
            const s = new Date(startAt);
            const e = new Date(endAt);

            // invalid date values: skip this test (let field-level validators handle format if needed)
            if (!isFinite(s.getTime()) || !isFinite(e.getTime())) return true;

            return e.getTime() >= s.getTime();
        }
    );

/* --------- Root schema ---------- */

export const validationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Name is required")
        .max(100, "Name must be at most 100 characters"),
    program: nonEmptyString().max(100, "Program must be at most 100 characters"),
    year: nonEmptyString().test(
        "is-valid-year-or-empty",
        "Invalid year",
        (val) => {
            if (val == null || val === "") return true;
            const n = Number(val);
            if (!Number.isFinite(n)) return false;
            return n >= 1900 && n <= new Date().getFullYear() + 5;
        }
    ),
    notes: nonEmptyString().max(2000, "Notes must be at most 2000 characters"),
    registrationPrefix: nonEmptyString().max(50, "Prefix must be at most 50 characters"),
    semesters: yup
        .array()
        .of(semesterSchema)
        .required("Semesters required")
        .min(1, "At least one semester is required"),
});
