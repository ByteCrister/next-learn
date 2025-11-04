"use client";

import {
  CourseDelivery,
  CreateCohortPayload,
  ExamKind,
  ExamCondition,
  ComponentName,
  UpdateCohortPayload,
} from "@/types/types.batch";
import { v4 as uuidv4 } from "uuid";

/* --------- Component props ---------- */
type CommonProps = {
  initialValues?: Partial<CohortFormValues>;
  submitLabel?: string;
  submitting?: boolean;
};
export type CreateProps = CommonProps & {
  mode?: "create";
  onSubmit: (payload: CreateCohortPayload) => Promise<void>;
};
export type UpdateProps = CommonProps & {
  mode: "update";
  onSubmit: (payload: UpdateCohortPayload) => Promise<void>;
  id: string;
};
export type Props = CreateProps | UpdateProps;

/* --------- Form-local types (UI friendly) ---------- */

export type CohortFormValues = {
  _uid: string;
  registrationPrefix?: string;
  name: string; // maps -> title
  program?: string;
  year?: string; // maps -> admissionYear
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
  name: ComponentName;
  maxMarks: number;
};

type ExamDefinitionInput = {
  _uid: string;
  examType: ExamKind; // maps -> examKind
  condition: ExamCondition;
  totalMarks?: number | null;
  components: ResultComponentDefInput[];
};

type CoursePartInput = {
  _uid: string;
  courseType: CourseDelivery; // maps -> delivery
  credits: number;
  teachers: TeacherInput[];
  examDefinitions: ExamDefinitionInput[]; // maps -> examConfigs
  notes?: string;
};

type MarkDistributionInput = {
  _uid: string;
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

type CourseAssignmentInput = {
  _uid: string;
  code?: string;
  name?: string; // maps -> title
  courseId?: string; // maps -> courseRefId
  parts: CoursePartInput[];
  notes?: string;
  markDistribution?: MarkDistributionInput;
};

type SemesterInput = {
  _uid: string;
  name: string; // maps -> title
  index: number;
  type?: CourseDelivery;
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

/* --------- Hook implementation ---------- */

export default function useBatchForm() {
  /* --------- Default factories ---------- */

  const emptyResultComponent = (): ResultComponentDefInput => ({
    _uid: uuidv4(),
    name: ComponentName.TT,
    maxMarks: 100,
  });

  const emptyExamDefinition = (): ExamDefinitionInput => ({
    _uid: uuidv4(),
    examType: ExamKind.MID,
    condition: ExamCondition.REGULAR,
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
    courseType: CourseDelivery.THEORY,
    credits: 3,
    teachers: [emptyTeacher()],
    examDefinitions: [emptyExamDefinition()],
    notes: "",
  });

  const emptyMarkDistribution = (): MarkDistributionInput => ({
    _uid: uuidv4(),
    totalMarks: undefined,
    mid: undefined,
    final: undefined,
    tt: undefined,
    assignments: undefined,
    attendance: undefined,
    practical: undefined,
    viva: undefined,
    others: undefined,
  });

  const emptyCourseAssignment = (): CourseAssignmentInput => ({
    _uid: uuidv4(),
    code: "",
    name: "",
    courseId: "",
    parts: [emptyCoursePart()],
    notes: "",
    markDistribution: emptyMarkDistribution(),
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

  /* --------- Server error guards (type predicates) ---------- */

  function isFieldErrors(obj: unknown): obj is { fieldErrors: ServerFieldError[] } {
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

  function isErrorsRecord(obj: unknown): obj is { errors: Record<string, string> } {
    if (typeof obj !== "object" || obj === null) return false;
    if (!("errors" in obj)) return false;
    const maybe = (obj as Record<string, unknown>)["errors"];
    if (typeof maybe !== "object" || maybe === null) return false;
    return Object.values(maybe as Record<string, unknown>).every((v) => typeof v === "string");
  }

  function isPlainRecordOfStrings(obj: unknown): obj is Record<string, string> {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj as Record<string, unknown>).every((v) => typeof v === "string");
  }

  /* --------- Payload mappers (small helpers) ---------- */

  function mapComponent(comp: ResultComponentDefInput) {
    return {
      name: comp.name,
      maxMarks: Number(comp.maxMarks ?? 0),
    };
  }

  function mapExamConfig(ed: ExamDefinitionInput) {
    return {
      examKind: ed.examType,
      condition: ed.condition,
      totalMarks: typeof ed.totalMarks === "number" ? ed.totalMarks : undefined,
      components: (ed.components || []).map(mapComponent),
    };
  }

  function mapTeacher(t: TeacherInput) {
    return {
      name: String(t.name ?? "").trim(),
      designation: t.designation?.trim() || undefined,
      notes: t.notes?.trim() || undefined,
    };
  }

  function mapPart(p: CoursePartInput) {
    return {
      delivery: p.courseType,
      credits: Number(p.credits ?? 0),
      notes: p.notes ? String(p.notes).trim() : undefined,
      teachers: (p.teachers || []).map(mapTeacher),
      examConfigs: (p.examDefinitions || []).map(mapExamConfig),
    };
  }

  function mapMarkDistribution(md?: MarkDistributionInput) {
    if (!md) return undefined;
    // only include numeric fields if present
    const obj: Record<string, number> = {};
    if (typeof md.totalMarks === "number") obj.totalMarks = md.totalMarks;
    if (typeof md.mid === "number") obj.mid = md.mid;
    if (typeof md.final === "number") obj.final = md.final;
    if (typeof md.tt === "number") obj.tt = md.tt;
    if (typeof md.assignments === "number") obj.assignments = md.assignments;
    if (typeof md.attendance === "number") obj.attendance = md.attendance;
    if (typeof md.practical === "number") obj.practical = md.practical;
    if (typeof md.viva === "number") obj.viva = md.viva;
    if (typeof md.others === "number") obj.others = md.others;
    return Object.keys(obj).length > 0 ? obj : undefined;
  }

  function mapCourse(c: CourseAssignmentInput) {
    return {
      courseRefId: c.courseId ? c.courseId : undefined,
      code: c.code?.trim() || undefined,
      title: c.name?.trim() || undefined,
      notes: c.notes ? String(c.notes).trim() : undefined,
      markDistribution: mapMarkDistribution(c.markDistribution),
      parts: (c.parts || []).map(mapPart),
    };
  }

  /* --------- Payload builders ---------- */

  function buildCreatePayload(values: CohortFormValues): CreateCohortPayload {
    const payload: CreateCohortPayload = {
      title: String(values.name ?? "").trim(),
    };

    if (values.registrationPrefix && String(values.registrationPrefix).trim() !== "")
      payload.registrationPrefix = String(values.registrationPrefix).trim();

    if (values.program && String(values.program).trim() !== "") payload.program = String(values.program).trim();

    if (values.year && String(values.year).trim() !== "") payload.admissionYear = Number(String(values.year).trim());

    if (values.notes && String(values.notes).trim() !== "") payload.notes = String(values.notes).trim();

    payload.semesters = (values.semesters || []).map((s) => ({
      title: String(s.name ?? "").trim(),
      index: Number(s.index ?? 1),
      startAt: s.startAt,
      endAt: s.endAt,
      notes: s.notes ? String(s.notes).trim() : undefined,
      courses: (s.courses || []).map(mapCourse),
    }));

    return payload;
  }

  function buildUpdatePayload(values: CohortFormValues, id: string): UpdateCohortPayload {
    const base = buildCreatePayload(values);
    const update: UpdateCohortPayload = { _id: id };

    update.title = base.title;
    update.registrationPrefix = typeof base.registrationPrefix !== "undefined" ? base.registrationPrefix : null;
    update.program = typeof base.program !== "undefined" ? base.program : null;
    update.admissionYear = typeof base.admissionYear !== "undefined" ? base.admissionYear : null;
    update.notes = typeof base.notes !== "undefined" ? base.notes : null;

    update.semesters =
      typeof base.semesters !== "undefined"
        ? (base.semesters || []).map((s) => ({
          title: String(s.title ?? "").trim(),
          index: Number(s.index ?? 1),
          startAt: String(s.startAt ?? ""),
          endAt: String(s.endAt ?? ""),
          notes: typeof s.notes !== "undefined" ? String(s.notes ?? "").trim() : undefined,
          courses:
            (s.courses || []).map((c) => ({
              courseRefId: c.courseRefId ?? undefined,
              code: c.code?.trim() || undefined,
              title: c.title?.trim() || undefined,
              notes: typeof c.notes !== "undefined" ? String(c.notes ?? "").trim() : undefined,
              markDistribution: typeof c.markDistribution !== "undefined" ? c.markDistribution : undefined,
              parts:
                (c.parts || []).map((p) => ({
                  delivery: p.delivery ?? CourseDelivery.THEORY,
                  credits: Number(p.credits ?? 0),
                  notes: typeof p.notes !== "undefined" ? String(p.notes ?? "").trim() : undefined,
                  teachers:
                    (p.teachers || []).map((t) => ({
                      name: String(t.name ?? "").trim(),
                      designation: t.designation?.trim() || undefined,
                      notes: t.notes?.trim() || undefined,
                    })) || [],
                  examConfigs:
                    (p.examConfigs || []).map((ed) => ({
                      examKind: ed.examKind,
                      condition: ed.condition,
                      totalMarks: typeof ed.totalMarks === "number" ? ed.totalMarks : undefined,
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
