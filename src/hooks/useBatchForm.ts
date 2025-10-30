"use client";

import {
  COURSE_TYPE,
  CreateBatchPayload,
  EXAM_TYPE,
  EXAM_TYPE_CONDITION,
  RESULT_COMPONENT_NAME,
  UpdateBatchPayload,
} from "@/types/types.batch";
import { v4 as uuidv4 } from "uuid";

/* --------- Component props ---------- */
type CommonProps = {
  initialValues?: Partial<BatchNestedFormValues>;
  submitLabel?: string;
  submitting?: boolean;
};
export type CreateProps = CommonProps & {
  mode?: "create";
  onSubmit: (payload: CreateBatchPayload) => Promise<void>;
};
export type UpdateProps = CommonProps & {
  mode: "update";
  onSubmit: (payload: UpdateBatchPayload) => Promise<void>;
  id: string;
};
export type Props = CreateProps | UpdateProps;

export type BatchNestedFormValues = {
  _uid: string;
  name: string;
  program?: string;
  year?: string;
  notes?: string;
  semesters: SemesterInput[];
};

type TeacherInput = {
  _uid: string;
  name: string;
  designation?: string;
  notes?: string;
};
type ResultComponentDefInput = {
  _uid: string;
  name: RESULT_COMPONENT_NAME;
  maxMarks: number;
};
type ExamDefinitionInput = {
  _uid: string;
  examType: EXAM_TYPE;
  condition: EXAM_TYPE_CONDITION;
  totalMarks?: number | null;
  components: ResultComponentDefInput[];
};
type CoursePartInput = {
  _uid: string;
  courseType: COURSE_TYPE;
  credits: number;
  teachers: TeacherInput[];
  examDefinitions: ExamDefinitionInput[];
  notes?: string;
};
type CourseAssignmentInput = {
  _uid: string;
  code?: string;
  name?: string;
  courseId?: string;
  parts: CoursePartInput[];
  notes?: string;
};
type SemesterInput = {
  _uid: string;
  name: string;
  index: number;
  type?: COURSE_TYPE;
  startAt?: string;
  endAt?: string;
  notes?: string;
  courses: CourseAssignmentInput[];
};

/* --------- Server error guards ---------- */
type ServerFieldError = { field: string; message: string };
export type ServerErrorShape =
  | { fieldErrors?: ServerFieldError[]; errors?: Record<string, string> }
  | Record<string, string>
  | { message?: string };

export default function useBatchForm() {
  /* --------- Default factories ---------- */
  const emptyResultComponent = (): ResultComponentDefInput => ({
    _uid: uuidv4(),
    name: RESULT_COMPONENT_NAME.TT,
    maxMarks: 100,
  });
  const emptyExamDefinition = (): ExamDefinitionInput => ({
    _uid: uuidv4(),
    examType: EXAM_TYPE.MID,
    condition: EXAM_TYPE_CONDITION.REGULAR,
    totalMarks: 0,
    components: [emptyResultComponent()],
  });
  const emptyTeacher = (): TeacherInput => ({
    _uid: uuidv4(),
    name: "",
    designation: "",
    notes: "",
  });
  const emptyCoursePart = (): CoursePartInput => ({
    _uid: uuidv4(),
    courseType: COURSE_TYPE.THEORY,
    credits: 3,
    teachers: [emptyTeacher()],
    examDefinitions: [emptyExamDefinition()],
    notes: "",
  });
  const emptyCourseAssignment = (): CourseAssignmentInput => ({
    _uid: uuidv4(),
    code: "",
    name: "",
    courseId: "",
    parts: [emptyCoursePart()],
    notes: "",
  });
  const emptySemester = (index = 1): SemesterInput => ({
    _uid: uuidv4(),
    name: `Semester ${index}`,
    index,
    startAt: "",
    endAt: "",
    notes: "",
    courses: [emptyCourseAssignment()],
  });

  function isFieldErrors(
    obj: unknown
  ): obj is { fieldErrors: ServerFieldError[] } {
    if (typeof obj !== "object" || obj === null) return false;
    if (!("fieldErrors" in obj)) return false;
    const maybe = (obj as Record<string, unknown>)["fieldErrors"];
    if (!Array.isArray(maybe)) return false;
    return maybe.every((item) => {
      if (typeof item !== "object" || item === null) return false;
      const field = (item as Record<string, unknown>)["field"];
      const message = (item as Record<string, unknown>)["message"];
      return typeof field === "string" && typeof message === "string";
    });
  }

  function isErrorsRecord(
    obj: unknown
  ): obj is { errors: Record<string, string> } {
    if (typeof obj !== "object" || obj === null) return false;
    if (!("errors" in obj)) return false;
    const maybe = (obj as Record<string, unknown>)["errors"];
    if (typeof maybe !== "object" || maybe === null) return false;
    return Object.values(maybe as Record<string, unknown>).every(
      (v) => typeof v === "string"
    );
  }

  function isPlainRecordOfStrings(obj: unknown): obj is Record<string, string> {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj as Record<string, unknown>).every(
      (v) => typeof v === "string"
    );
  }

  /* --------- Payload builders ---------- */
  function buildCreatePayload(
    values: BatchNestedFormValues
  ): CreateBatchPayload {
    console.log("buildCreatePayload start", values);
    try {
      const payload: CreateBatchPayload = {
        name: String(values.name ?? "").trim(),
      };

      if (values.program && String(values.program).trim() !== "")
        payload.program = String(values.program).trim();
      if (values.year && String(values.year).trim() !== "")
        payload.year = Number(String(values.year).trim());
      if (values.notes && String(values.notes).trim() !== "")
        payload.notes = String(values.notes).trim();

      payload.semesters = (values.semesters || []).map((s) => ({
        name: String(s.name ?? "").trim(),
        index: Number(s.index ?? 1),
        startAt: s.startAt ? s.startAt : undefined,
        endAt: s.endAt ? s.endAt : undefined,
        notes: s.notes ? String(s.notes).trim() : undefined,
        courses: (s.courses || []).map((c) => ({
          courseId: c.courseId || undefined,
          code: c.code?.trim() || undefined,
          name: c.name?.trim() || undefined,
          notes: c.notes ? String(c.notes).trim() : undefined,
          parts: (c.parts || []).map((p) => ({
            courseType: p.courseType,
            credits: Number(p.credits ?? 0),
            notes: p.notes ? String(p.notes).trim() : undefined,
            teachers: (p.teachers || []).map((t) => ({
              name: String(t.name ?? "").trim(),
              designation: t.designation?.trim() || undefined,
              notes: t.notes?.trim() || undefined,
            })),
            examDefinitions: (p.examDefinitions || []).map((ed) => ({
              examType: ed.examType,
              condition: ed.condition,
              totalMarks:
                typeof ed.totalMarks === "number" ? ed.totalMarks : undefined,
              components: (ed.components || []).map((comp) => ({
                name: comp.name,
                maxMarks: Number(comp.maxMarks ?? 0),
              })),
            })),
          })),
        })),
      }));

      console.log("buildCreatePayload: ready", payload);
      return payload;
    } catch (err) {
      console.error("buildCreatePayload threw", err);
      throw err;
    }
  }

  function buildUpdatePayload(
    values: BatchNestedFormValues,
    id: string
  ): UpdateBatchPayload {
    const base = buildCreatePayload(values); // reuse normalized version
    const update: UpdateBatchPayload = { _id: id };

    update.name = base.name;
    update.program = typeof base.program !== "undefined" ? base.program : null;
    update.year = typeof base.year !== "undefined" ? base.year : null;
    update.notes = typeof base.notes !== "undefined" ? base.notes : null;

    update.semesters =
      typeof base.semesters !== "undefined"
        ? (base.semesters || []).map((s) => ({
            name: String(s.name ?? "").trim(),
            index: Number(s.index ?? 1),
            startAt: s.startAt ?? undefined,
            endAt: s.endAt ?? undefined,
            notes:
              typeof s.notes !== "undefined"
                ? String(s.notes ?? "").trim()
                : undefined,
            courses:
              (s.courses || []).map((c) => ({
                courseId: c.courseId ?? undefined,
                code: c.code?.trim() || undefined,
                name: c.name?.trim() || undefined,
                notes:
                  typeof c.notes !== "undefined"
                    ? String(c.notes ?? "").trim()
                    : undefined,
                parts:
                  (c.parts || []).map((p) => ({
                    courseType: p.courseType ?? COURSE_TYPE.THEORY,
                    credits: Number(p.credits ?? 0),
                    notes:
                      typeof p.notes !== "undefined"
                        ? String(p.notes ?? "").trim()
                        : undefined,
                    teachers:
                      (p.teachers || []).map((t) => ({
                        name: String(t.name ?? "").trim(),
                        designation: t.designation?.trim() || undefined,
                        notes: t.notes?.trim() || undefined,
                      })) || [],
                    examDefinitions:
                      (p.examDefinitions || []).map((ed) => ({
                        examType: ed.examType,
                        condition: ed.condition,
                        totalMarks:
                          typeof ed.totalMarks === "number"
                            ? ed.totalMarks
                            : undefined,
                        components:
                          (ed.components || []).map((comp) => ({
                            name: comp.name,
                            maxMarks: Number(comp.maxMarks ?? 0),
                          })) || [],
                      })) || [],
                  })) || [],
              })) || [],
          }))
        : undefined;

    return update;
  }

  return {
    buildUpdatePayload,
    buildCreatePayload,
    isPlainRecordOfStrings,
    isErrorsRecord,
    isFieldErrors,
    emptySemester,
    emptyCourseAssignment,
    emptyCoursePart,
    emptyTeacher,
    emptyExamDefinition,
    emptyResultComponent,
  };
}
