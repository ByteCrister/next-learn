import { COURSE_TYPE, EXAM_TYPE, EXAM_TYPE_CONDITION, RESULT_COMPONENT_NAME } from "@/models/Batch";
import { Types } from "mongoose";

/* --------------------- Helpers and safe parsers --------------------- */

export function toObjectIdIfValid(id?: unknown): Types.ObjectId | undefined {
    if (!id || typeof id !== "string") return undefined;
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined;
}

function parseDateIfValid(v?: unknown): Date | undefined {
    if (!v || typeof v !== "string") return undefined;
    const d = new Date(v);
    return Number.isFinite(d.getTime()) ? d : undefined;
}

function toNumberIfFinite(v?: unknown): number | undefined {
    if (v == null || v === "") return undefined;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
}

export function parseYear(v?: unknown): number | undefined {
    const n = toNumberIfFinite(v);
    if (n == null) return undefined;
    const cur = new Date().getFullYear();
    if (n >= 1900 && n <= cur + 5) return Math.trunc(n);
    return undefined;
}

/* enum membership checks (string-typed sets so .has accepts strings) */
const VALID_COURSE_TYPES = new Set<string>(Object.values(COURSE_TYPE));
const VALID_EXAM_TYPES = new Set<string>(Object.values(EXAM_TYPE));
const VALID_EXAM_CONDITIONS = new Set<string>(Object.values(EXAM_TYPE_CONDITION));
const VALID_RESULT_COMPONENTS = new Set<string>(Object.values(RESULT_COMPONENT_NAME));

function isValidCourseType(s: unknown): s is COURSE_TYPE {
    return typeof s === "string" && VALID_COURSE_TYPES.has(s);
}
function isValidExamType(s: unknown): s is EXAM_TYPE {
    return typeof s === "string" && VALID_EXAM_TYPES.has(s);
}
function isValidExamCondition(s: unknown): s is EXAM_TYPE_CONDITION {
    return typeof s === "string" && VALID_EXAM_CONDITIONS.has(s);
}
function isValidResultComponentName(s: unknown): s is RESULT_COMPONENT_NAME {
    return typeof s === "string" && VALID_RESULT_COMPONENTS.has(s);
}

/* --------------------- Sanitizer with typed return -------------------- */

type SanitizedComponent = {
    name?: RESULT_COMPONENT_NAME;
    maxMarks?: number;
    notes?: string;
};

type SanitizedExamDefinition = {
    examType?: EXAM_TYPE;
    condition?: EXAM_TYPE_CONDITION;
    totalMarks?: number;
    components: SanitizedComponent[];
};

type SanitizedTeacher = {
    name: string;
    designation?: string;
    notes?: string;
};

type SanitizedPart = {
    courseType?: COURSE_TYPE;
    credits?: number;
    teachers: SanitizedTeacher[];
    examDefinitions: SanitizedExamDefinition[];
    notes?: string;
};

type SanitizedCourse = {
    courseId?: Types.ObjectId;
    code?: string;
    name?: string;
    notes?: string;
    parts: SanitizedPart[];
};

type SanitizedSemester = {
    name: string;
    index: number;
    startAt?: Date;
    endAt?: Date;
    notes?: string;
    courses: SanitizedCourse[];
};

export function sanitizeSemesters(rawSemesters: unknown): { value: SanitizedSemester[]; errors: string[] } {
    const errors: string[] = [];
    if (!Array.isArray(rawSemesters)) return { value: [], errors };

    const sanitized = rawSemesters.map((s: unknown, sIdx: number): SanitizedSemester => {
        if (typeof s !== "object" || s === null) {
            errors.push(`semesters[${sIdx}] must be an object`);
            return { name: `Semester ${sIdx + 1}`, index: sIdx + 1, courses: [] };
        }
        const rs = s as Record<string, unknown>;

        const name = typeof rs.name === "string" && rs.name.trim() !== "" ? rs.name.trim() : `Semester ${sIdx + 1}`;
        const index = Number.isFinite(Number(rs.index)) ? Number(rs.index) : sIdx + 1;

        const startAt = parseDateIfValid(rs.startAt);
        if (rs.startAt && !startAt) errors.push(`semesters[${sIdx}].startAt is not a valid date`);

        const endAt = parseDateIfValid(rs.endAt);
        if (rs.endAt && !endAt) errors.push(`semesters[${sIdx}].endAt is not a valid date`);

        const notes = typeof rs.notes === "string" && rs.notes.trim() !== "" ? rs.notes.trim() : undefined;

        const courses: SanitizedCourse[] = Array.isArray(rs.courses)
            ? rs.courses.map((c: unknown, cIdx: number): SanitizedCourse => {
                if (typeof c !== "object" || c === null) {
                    errors.push(`semesters[${sIdx}].courses[${cIdx}] must be an object`);
                    return { parts: [] };
                }
                const rc = c as Record<string, unknown>;
                const courseId = toObjectIdIfValid(typeof rc.courseId === "string" ? rc.courseId : undefined);
                const code = typeof rc.code === "string" && rc.code.trim() !== "" ? rc.code.trim() : undefined;
                const cname = typeof rc.name === "string" && rc.name.trim() !== "" ? rc.name.trim() : undefined;
                const cnotes = typeof rc.notes === "string" && rc.notes.trim() !== "" ? rc.notes.trim() : undefined;

                const parts: SanitizedPart[] = Array.isArray(rc.parts)
                    ? rc.parts.map((p: unknown, pIdx: number): SanitizedPart => {
                        if (typeof p !== "object" || p === null) {
                            errors.push(`semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}] must be an object`);
                            return { teachers: [], examDefinitions: [] };
                        }
                        const rp = p as Record<string, unknown>;

                        const courseType = isValidCourseType(rp.courseType) ? rp.courseType : undefined;
                        if (rp.courseType && !courseType)
                            errors.push(`semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].courseType is invalid`);

                        const credits = toNumberIfFinite(rp.credits);
                        if (rp.credits != null && credits == null)
                            errors.push(`semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].credits is invalid`);

                        const teachers: SanitizedTeacher[] = Array.isArray(rp.teachers)
                            ? rp.teachers.map((t: unknown, tIdx: number): SanitizedTeacher => {
                                if (typeof t !== "object" || t === null) {
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].teachers[${tIdx}] must be an object`
                                    );
                                    return { name: "" };
                                }
                                const rt = t as Record<string, unknown>;
                                const tname = typeof rt.name === "string" && rt.name.trim() !== "" ? rt.name.trim() : "";
                                if (!tname)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].teachers[${tIdx}].name is required`
                                    );
                                return {
                                    name: tname,
                                    designation:
                                        typeof rt.designation === "string" && rt.designation.trim() !== ""
                                            ? rt.designation.trim()
                                            : undefined,
                                    notes: typeof rt.notes === "string" && rt.notes.trim() !== "" ? rt.notes.trim() : undefined,
                                };
                            })
                            : [];

                        const examDefinitions: SanitizedExamDefinition[] = Array.isArray(rp.examDefinitions)
                            ? rp.examDefinitions.map((ed: unknown, edIdx: number): SanitizedExamDefinition => {
                                if (typeof ed !== "object" || ed === null) {
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}] must be an object`
                                    );
                                    return { components: [] };
                                }
                                const red = ed as Record<string, unknown>;
                                const examType = isValidExamType(red.examType) ? red.examType : undefined;
                                if (red.examType && !examType)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].examType is invalid`
                                    );

                                const condition = isValidExamCondition(red.condition) ? red.condition : undefined;
                                if (red.condition && !condition)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].condition is invalid`
                                    );

                                const totalMarks = toNumberIfFinite(red.totalMarks);

                                const components: SanitizedComponent[] = Array.isArray(red.components)
                                    ? red.components.map((comp: unknown, compIdx: number): SanitizedComponent => {
                                        if (typeof comp !== "object" || comp === null) {
                                            errors.push(
                                                `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].components[${compIdx}] must be an object`
                                            );
                                            return {};
                                        }
                                        const rcComp = comp as Record<string, unknown>;
                                        const compName = isValidResultComponentName(rcComp.name) ? rcComp.name : undefined;
                                        if (rcComp.name && !compName)
                                            errors.push(
                                                `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].components[${compIdx}].name is invalid`
                                            );

                                        const maxMarks = toNumberIfFinite(rcComp.maxMarks);
                                        if (rcComp.maxMarks != null && maxMarks == null)
                                            errors.push(
                                                `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].components[${compIdx}].maxMarks is invalid`
                                            );

                                        return {
                                            name: compName,
                                            maxMarks,
                                            notes:
                                                typeof rcComp.notes === "string" && rcComp.notes.trim() !== ""
                                                    ? rcComp.notes.trim()
                                                    : undefined,
                                        };
                                    })
                                    : [];

                                if (!examType)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].examType is required`
                                    );
                                if (!condition)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].condition is required`
                                    );
                                if (!components.length)
                                    errors.push(
                                        `semesters[${sIdx}].courses[${cIdx}].parts[${pIdx}].examDefinitions[${edIdx}].components must be a non-empty array`
                                    );

                                return {
                                    examType,
                                    condition,
                                    totalMarks,
                                    components,
                                };
                            })
                            : [];

                        return {
                            courseType,
                            credits,
                            teachers,
                            examDefinitions,
                            notes: typeof rp.notes === "string" && rp.notes.trim() !== "" ? rp.notes.trim() : undefined,
                        };
                    })
                    : [];

                return {
                    courseId,
                    code,
                    name: cname,
                    notes: cnotes,
                    parts,
                };
            })
            : [];

        return {
            name,
            index,
            startAt,
            endAt,
            notes,
            courses,
        };
    });

    return { value: sanitized, errors };
}