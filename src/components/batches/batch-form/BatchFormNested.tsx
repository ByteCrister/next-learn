"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useFormik, FormikErrors, getIn } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSave,
  FiRotateCcw,
  FiPlus,
  FiX,
  FiAlertCircle,
  FiCalendar,
  FiBook,
  FiUsers,
  FiFileText,
  FiHash,
  FiFile,
  FiTag,
  FiClock,
  FiInfo,
  FiKey,
} from "react-icons/fi";
import {
  COURSE_TYPE,
  EXAM_TYPE,
  EXAM_TYPE_CONDITION,
  RESULT_COMPONENT_NAME,
} from "@/types/types.batch";
import { validationSchema } from "@/utils/auth/BatchValidation";
import { Button, Input, Label, Select, Textarea } from "../modern-ui-components";
import useBatchForm, {
  BatchNestedFormValues,
  CreateProps,
  Props,
  ServerErrorShape,
  UpdateProps,
} from "@/hooks/useBatchForm";
import { v4 as uuidv4 } from "uuid";
import { fromInputDate, toInputDate } from "@/utils/helpers/batch-form";

export default function BatchFormNested(props: Props) {
  const { initialValues = {}, submitLabel = "Save", submitting = false } = props;

  const {
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
  } = useBatchForm();

  const defaultValues = useMemo<BatchNestedFormValues>(() => {
    const seedSemesters =
      initialValues.semesters && initialValues.semesters.length > 0
        ? initialValues.semesters.map((s, i) => ({
          _uid: s._uid ?? uuidv4(),
          name: s.name ?? `Semester ${i + 1}`,
          index: s.index ?? i + 1,
          startAt: s.startAt ?? "",
          endAt: s.endAt ?? "",
          notes: s.notes ?? "",
          courses:
            s.courses && s.courses.length
              ? s.courses.map((c) => ({
                _uid: c._uid ?? uuidv4(),
                code: c.code ?? "",
                name: c.name ?? "",
                courseId: c.courseId ?? "",
                parts:
                  c.parts && c.parts.length
                    ? c.parts.map((p) => ({
                      _uid: p._uid ?? uuidv4(),
                      courseType: p.courseType ?? COURSE_TYPE.THEORY,
                      credits: p.credits ?? 3,
                      teachers:
                        p.teachers && p.teachers.length
                          ? p.teachers.map((t) => ({
                            _uid: t._uid ?? uuidv4(),
                            name: t.name ?? "",
                            designation: t.designation ?? "",
                            notes: t.notes ?? "",
                          }))
                          : [emptyTeacher()],
                      examDefinitions:
                        p.examDefinitions && p.examDefinitions.length
                          ? p.examDefinitions.map((ed) => ({
                            _uid: ed._uid ?? uuidv4(),
                            examType: ed.examType ?? EXAM_TYPE.MID,
                            condition:
                              ed.condition ?? EXAM_TYPE_CONDITION.REGULAR,
                            totalMarks:
                              typeof ed.totalMarks === "number"
                                ? ed.totalMarks
                                : 0,
                            components:
                              ed.components?.map((c) => ({
                                _uid: c._uid ?? uuidv4(),
                                name: c.name,
                                maxMarks: c.maxMarks,
                              })) ?? [emptyResultComponent()],
                          }))
                          : [emptyExamDefinition()],
                      notes: p.notes ?? "",
                    }))
                    : [emptyCoursePart()],
              }))
              : [emptyCourseAssignment()],
        }))
        : [emptySemester(1)];

    return {
      _uid: uuidv4(),
      name: initialValues.name ?? "",
      program: initialValues.program ?? "",
      year: initialValues.year ?? "",
      registrationID: initialValues.registrationID ?? "",
      notes: initialValues.notes ?? "",
      semesters: seedSemesters,
    };
  }, [
    initialValues,
    emptyTeacher,
    emptyCoursePart,
    emptyExamDefinition,
    emptyCourseAssignment,
    emptyResultComponent,
    emptySemester,
  ]);

  const initialShared = useMemo(() => {
    const courseNames = Array.from(
      new Set(
        (initialValues.semesters ?? [])
          .flatMap((s) => s.courses ?? [])
          .map((c) => c.name)
          .filter((v): v is string => Boolean(v))
      )
    );

    const courseCodes = Array.from(
      new Set(
        (initialValues.semesters ?? [])
          .flatMap((s) => s.courses ?? [])
          .map((c) => c.code)
          .filter((v): v is string => Boolean(v))
      )
    );

    const teacherNames = Array.from(
      new Set(
        (initialValues.semesters ?? [])
          .flatMap((s) => s.courses ?? [])
          .flatMap((c) => c.parts ?? [])
          .flatMap((p) => p.teachers ?? [])
          .map((t) => t.name)
          .filter(Boolean)
      )
    );

    const credits = Array.from(
      new Set(
        (initialValues.semesters ?? [])
          .flatMap((s) => s.courses ?? [])
          .flatMap((c) => c.parts ?? [])
          .map((p) => p.credits)
          .filter((v) => typeof v === "number")
      )
    ).sort((a: number, b: number) => a - b);

    return { courseNames, courseCodes, teacherNames, credits };
  }, [initialValues]);

  const [shared, setShared] = useState(() => initialShared);

  const addCourseName = useCallback((v: string) => {
    const val = v?.trim();
    if (!val) return;
    setShared((s) => {
      const next = Array.from(new Set([val, ...s.courseNames.filter(Boolean)]));
      return { ...s, courseNames: next };
    });
  }, []);

  const updateCourseName = useCallback((idx: number, v: string) => {
    setShared((s) => {
      const arr = [...s.courseNames];
      arr[idx] = String(v ?? "").trim();
      const next = Array.from(new Set(arr.map((x) => x.trim()).filter(Boolean)));
      return { ...s, courseNames: next };
    });
  }, []);

  const removeCourseName = useCallback((idx: number) => {
    setShared((s) => ({ ...s, courseNames: s.courseNames.filter((_, i) => i !== idx) }));
  }, []);

  const addCourseCode = useCallback((v: string) => {
    const val = v?.trim();
    if (!val) return;
    setShared((s) => ({ ...s, courseCodes: Array.from(new Set([val, ...s.courseCodes])) }));
  }, []);

  const updateCourseCode = useCallback((idx: number, v: string) => {
    setShared((s) => {
      const arr = [...s.courseCodes];
      arr[idx] = String(v ?? "").trim();
      return { ...s, courseCodes: Array.from(new Set(arr.map((x) => x.trim()).filter(Boolean))) };
    });
  }, []);

  const removeCourseCode = useCallback((idx: number) => {
    setShared((s) => ({ ...s, courseCodes: s.courseCodes.filter((_, i) => i !== idx) }));
  }, []);

  const addTeacherName = useCallback((v: string) => {
    const val = v?.trim();
    if (!val) return;
    setShared((s) => ({ ...s, teacherNames: Array.from(new Set([val, ...s.teacherNames])) }));
  }, []);

  const updateTeacherName = useCallback((idx: number, v: string) => {
    setShared((s) => {
      const arr = [...s.teacherNames];
      arr[idx] = String(v ?? "").trim();
      return { ...s, teacherNames: Array.from(new Set(arr.map((x) => x.trim()).filter(Boolean))) };
    });
  }, []);

  const removeTeacherName = useCallback((idx: number) => {
    setShared((s) => ({ ...s, teacherNames: s.teacherNames.filter((_, i) => i !== idx) }));
  }, []);

  const addCredit = useCallback((v: number) => {
    if (!Number.isFinite(v)) return;
    setShared((s) => ({ ...s, credits: Array.from(new Set([v, ...s.credits])).sort((a, b) => a - b) }));
  }, []);

  const updateCredit = useCallback((idx: number, v: number) => {
    setShared((s) => {
      const arr = [...s.credits];
      arr[idx] = Number(v);
      return { ...s, credits: Array.from(new Set(arr.filter((n) => Number.isFinite(n)))).sort((a, b) => a - b) };
    });
  }, []);

  const removeCredit = useCallback((idx: number) => {
    setShared((s) => ({ ...s, credits: s.credits.filter((_, i) => i !== idx) }));
  }, []);

  const [tempCourseName, setTempCourseName] = useState("");
  const [tempCourseCode, setTempCourseCode] = useState("");
  const [tempTeacherName, setTempTeacherName] = useState("");
  const [tempCredit, setTempCredit] = useState<number | "">("");

  const formik = useFormik<BatchNestedFormValues>({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const { setSubmitting, setErrors } = formikHelpers;
      setSubmitting(true);
      try {
        if (props.mode === "update") {
          const p = props as UpdateProps;
          const payload = buildUpdatePayload(values, p.id);
          await p.onSubmit(payload);
        } else {
          const p = props as CreateProps;
          const payload = buildCreatePayload(values);
          await p.onSubmit(payload);
        }
      } catch (err: unknown) {
        const formErrors: Partial<Record<string, string>> = {};
        const srv = err as ServerErrorShape | null;
        if (srv) {
          if (isFieldErrors(srv) && Array.isArray(srv.fieldErrors)) {
            for (const item of srv.fieldErrors) {
              if (item && typeof item.field === "string" && typeof item.message === "string") {
                formErrors[item.field] = item.message;
              }
            }
          } else if (isErrorsRecord(srv) && srv.errors && typeof srv.errors === "object") {
            for (const [k, v] of Object.entries(srv.errors)) {
              if (typeof v === "string") formErrors[k] = v;
            }
          } else if (isPlainRecordOfStrings(srv)) {
            for (const [k, v] of Object.entries(srv)) {
              formErrors[k] = v;
            }
          }
        }
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors as unknown as FormikErrors<BatchNestedFormValues>);
        }
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    // enable live validation so the UI shows errors as user types or selects
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: false,
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    getFieldProps,
  } = formik;

  // helpers to set nested fields and add to shared lists while touching fields
  const setAndAddCourseName = useCallback(
    (path: string, value: string) => {
      setFieldValue(path, value);
      setFieldTouched(path, true, false);
      if (value && !shared.courseNames.includes(value)) addCourseName(value);
    },
    [addCourseName, setFieldTouched, setFieldValue, shared.courseNames]
  );

  const setAndAddCourseCode = useCallback(
    (path: string, value: string) => {
      setFieldValue(path, value);
      setFieldTouched(path, true, false);
      if (value && !shared.courseCodes.includes(value)) addCourseCode(value);
    },
    [addCourseCode, setFieldTouched, setFieldValue, shared.courseCodes]
  );

  // small helper for rendering nested errors
  const renderFieldError = (path: string) => {
    const err = getIn(errors, path);
    const t = getIn(touched, path);
    if (err && t) {
      return (
        <div className="flex items-center gap-2 text-rose-600 text-xs mt-2 font-medium">
          <FiAlertCircle className="w-3.5 h-3.5" />
          <span>{String(err)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1 tracking-tight">
            {props.mode === "update" ? "Update Batch" : "Create Batch"}
          </h1>
          <p className="text-sm text-gray-600">Configure batch details, semesters, courses, and exam definitions</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Batch Name */}
              <div className="md:col-span-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <FiHash className="w-4 h-4" />
                  </span>
                  <span className="font-medium">Batch Name *</span>
                </Label>

                <div className="mt-2 relative">
                  <Input
                    {...getFieldProps("name")}
                    id="name"
                    placeholder="e.g., Summer-22"
                    required
                    className="pl-3"
                  />
                </div>

                {renderFieldError("name")}
              </div>

              {/* Year */}
              <div>
                <Label htmlFor="year" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                    <FiCalendar className="w-4 h-4" />
                  </span>
                  <span className="font-medium">Year</span>
                </Label>

                <div className="mt-2">
                  <Input {...getFieldProps("year")} id="year" type="number" placeholder="2024" />
                </div>

                {renderFieldError("year")}
              </div>
            </div>

            {/* Registration Number */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registration_number" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white">
                    <FiKey className="w-4 h-4" />
                  </span>
                  <span className="font-medium">Registration ID *</span>
                </Label>
                <div className="mt-2">
                  <Input
                    {...getFieldProps("registrationID")}
                    id="registrationID"
                    placeholder="e.g., REG-2024-001"
                    required
                  />
                </div>
                {renderFieldError("registrationID")}
              </div>

              {/* Program */}
              <div>
                <Label htmlFor="program" className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <FiTag className="w-4 h-4" />
                  </span>
                  <span className="font-medium">Program</span>
                </Label>
                <div className="mt-2">
                  <Input
                    {...getFieldProps("program")}
                    id="program"
                    placeholder="e.g., Computer Science & Engineering"
                  />
                </div>
                {renderFieldError("program")}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-5">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <FiInfo className="w-4 h-4" />
                </span>
                <span className="font-medium">Notes</span>
              </Label>
              <div className="mt-2">
                <Textarea
                  {...getFieldProps("notes")}
                  id="notes"
                  rows={3}
                  placeholder="Additional information about this batch..."
                />
              </div>
              {renderFieldError("notes")}
            </div>
          </motion.div>


          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

          {/* Shared lists manager */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                  <FiUsers className="w-4 h-4" />
                </span>
                Shared lists
              </h2>
              <p className="text-sm text-gray-500">Manage reusable options for course names, codes, teachers and credits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course names */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="!mb-0">Course names</Label>
                  <div className="flex items-center gap-2">
                    <Input value={tempCourseName} onChange={(e) => setTempCourseName(e.target.value)} placeholder="Add course name" />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        addCourseName(tempCourseName);
                        setTempCourseName("");
                      }}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {shared.courseNames.length === 0 && <div className="text-xs text-gray-400">No course names yet</div>}
                  {shared.courseNames.map((cn, i) => (
                    <div key={`${cn}-${i}`} className="flex items-center gap-2">
                      <Input value={cn} onChange={(e) => updateCourseName(i, e.target.value)} />
                      <Button type="button" variant="destructive" onClick={() => removeCourseName(i)} className="!p-2">
                        <FiX />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course codes */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="!mb-0">Course codes</Label>
                  <div className="flex items-center gap-2">
                    <Input value={tempCourseCode} onChange={(e) => setTempCourseCode(e.target.value)} placeholder="Add course code" />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        addCourseCode(tempCourseCode);
                        setTempCourseCode("");
                      }}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {shared.courseCodes.length === 0 && <div className="text-xs text-gray-400">No course codes yet</div>}
                  {shared.courseCodes.map((cc, i) => (
                    <div key={`${cc}-${i}`} className="flex items-center gap-2">
                      <Input value={cc} onChange={(e) => updateCourseCode(i, e.target.value)} />
                      <Button type="button" variant="destructive" onClick={() => removeCourseCode(i)} className="!p-2">
                        <FiX />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher names */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="!mb-0">Teacher names</Label>
                  <div className="flex items-center gap-2">
                    <Input value={tempTeacherName} onChange={(e) => setTempTeacherName(e.target.value)} placeholder="Add teacher name" />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        addTeacherName(tempTeacherName);
                        setTempTeacherName("");
                      }}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {shared.teacherNames.length === 0 && <div className="text-xs text-gray-400">No teachers yet</div>}
                  {shared.teacherNames.map((tn, i) => (
                    <div key={`${tn}-${i}`} className="flex items-center gap-2">
                      <Input value={tn} onChange={(e) => updateTeacherName(i, e.target.value)} />
                      <Button type="button" variant="destructive" onClick={() => removeTeacherName(i)} className="!p-2">
                        <FiX />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credits */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="!mb-0">Credits</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempCredit === "" ? "" : String(tempCredit)}
                      onChange={(e) => setTempCredit(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Add credit e.g. 3"
                      type="number"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (tempCredit !== "") addCredit(Number(tempCredit));
                        setTempCredit("");
                      }}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {shared.credits.length === 0 && <div className="text-xs text-gray-400">No credits yet</div>}
                  {shared.credits.map((cr, i) => (
                    <div key={`${cr}-${i}`} className="flex items-center gap-2">
                      <Input value={String(cr)} onChange={(e) => updateCredit(i, Number(e.target.value))} type="number" />
                      <Button type="button" variant="destructive" onClick={() => removeCredit(i)} className="!p-2">
                        <FiX />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

          {/* Semesters */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <FiCalendar className="w-4 h-4" />
                </span>
                Semesters
              </h2>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const next = [...values.semesters, emptySemester(values.semesters.length + 1)];
                  setFieldValue("semesters", next);
                }}
                className="flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" /> Add Semester
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              {values.semesters.map((sem, sIdx) => (
                <motion.div
                  key={sem._uid}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mt-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Semester {sIdx + 1}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{sem.courses.length} course(s)</p>
                      </div>
                    </div>

                    {values.semesters.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const next = values.semesters.filter((_, i) => i !== sIdx);
                          setFieldValue("semesters", next);
                        }}
                        className="!p-2"
                      >
                        <FiX className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                          <FiFile className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="font-medium">Name</span>
                      </Label>

                      <div className="mt-2">
                        <Input {...getFieldProps(`semesters.${sIdx}.name`)} placeholder="Semester name" />
                      </div>

                      {renderFieldError(`semesters.${sIdx}.name`)}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                          <FiHash className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="font-medium">Index</span>
                      </Label>

                      <div className="mt-2">
                        <Input {...getFieldProps(`semesters.${sIdx}.index`)} type="number" />
                      </div>

                      {renderFieldError(`semesters.${sIdx}.index`)}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                          <FiClock className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="font-medium">Start Date</span>
                      </Label>

                      <div className="mt-2">
                        <Input
                          name={`semesters.${sIdx}.startAt`}
                          type="date"
                          value={toInputDate(values.semesters[sIdx].startAt) ?? ""}
                          onChange={(e) => {
                            const iso = fromInputDate(e.target.value);
                            setFieldValue(`semesters.${sIdx}.startAt`, iso ?? "");
                          }}
                          onBlur={() => setFieldTouched(`semesters.${sIdx}.startAt`, true, false)}
                        />
                      </div>

                      {renderFieldError(`semesters.${sIdx}.startAt`)}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                          <FiClock className="w-4 h-4 text-gray-600" />
                        </span>
                        <span className="font-medium">End Date</span>
                      </Label>

                      <div className="mt-2">
                        <Input
                          name={`semesters.${sIdx}.endAt`}
                          type="date"
                          value={toInputDate(values.semesters[sIdx].endAt) ?? ""}
                          onChange={(e) => {
                            const iso = fromInputDate(e.target.value);
                            setFieldValue(`semesters.${sIdx}.endAt`, iso ?? "");
                          }}
                          onBlur={() => setFieldTouched(`semesters.${sIdx}.startAt`, true, false)}
                        />
                      </div>

                      {renderFieldError(`semesters.${sIdx}.endAt`)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                        <FiInfo className="w-4 h-4 text-gray-600" />
                      </span>
                      <span className="font-medium">Notes</span>
                    </Label>

                    <div className="mt-2">
                      <Textarea {...getFieldProps(`semesters.${sIdx}.notes`)} rows={2} placeholder="Semester notes..." />
                    </div>

                    {renderFieldError(`semesters.${sIdx}.notes`)}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

                  {/* Courses list */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                          <FiBook className="w-3.5 h-3.5" />
                        </span>
                        Courses
                      </h4>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const next = [...values.semesters];
                          next[sIdx] = {
                            ...next[sIdx],
                            courses: [...(next[sIdx].courses ?? []), emptyCourseAssignment()],
                          };
                          setFieldValue("semesters", next);
                        }}
                        className="flex items-center gap-2"
                      >
                        <FiPlus className="w-3.5 h-3.5" /> Add Course
                      </Button>
                    </div>

                    {values.semesters[sIdx].courses.map((course, cIdx) => {
                      const courseBase = `semesters.${sIdx}.courses.${cIdx}`;

                      return (
                        <div key={course._uid} className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100 mb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="flex items-center gap-2">
                                  <FiBook className="text-gray-500" />
                                  <span className="font-medium">Course Name</span>
                                </Label>

                                <div className="mt-2 flex gap-2">
                                  <Select
                                    {...getFieldProps(`${courseBase}.name`)}
                                    onChange={(e) => setAndAddCourseName(`${courseBase}.name`, e.target.value)}
                                    className="flex-1"
                                  >
                                    <option value="">— select / type —</option>
                                    {shared.courseNames.map((cn) => (
                                      <option key={cn} value={cn}>
                                        {cn}
                                      </option>
                                    ))}
                                  </Select>
                                </div>

                                {renderFieldError(`${courseBase}.name`)}
                              </div>

                              <div>
                                <Label className="flex items-center gap-2">
                                  <FiHash className="text-gray-500" />
                                  <span className="font-medium">Course Code</span>
                                </Label>

                                <div className="mt-2 flex gap-2">
                                  <Select
                                    {...getFieldProps(`${courseBase}.code`)}
                                    onChange={(e) => setAndAddCourseCode(`${courseBase}.code`, e.target.value)}
                                    className="flex-1"
                                  >
                                    <option value="">— select / type —</option>
                                    {shared.courseCodes.map((cc) => (
                                      <option key={cc} value={cc}>
                                        {cc}
                                      </option>
                                    ))}
                                  </Select>
                                </div>

                                {renderFieldError(`${courseBase}.code`)}
                              </div>

                              <div>
                                <Label className="flex items-center gap-2">
                                  <FiFile className="text-gray-500" />
                                  <span className="font-medium">Course Notes</span>
                                </Label>

                                <div className="mt-2">
                                  <Input {...getFieldProps(`${courseBase}.notes`)} placeholder="Optional notes about this course" />
                                </div>

                                {renderFieldError(`${courseBase}.notes`)}
                              </div>
                            </div>

                            {values.semesters[sIdx].courses.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const nextSem = [...values.semesters];
                                  nextSem[sIdx] = { ...nextSem[sIdx], courses: nextSem[sIdx].courses.filter((_, i) => i !== cIdx) };
                                  setFieldValue("semesters", nextSem);
                                }}
                                className="!p-2 ml-3"
                              >
                                <FiX className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {/* Parts */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="!mb-0">Course Parts</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  const next = [...values.semesters];
                                  const parts = next[sIdx].courses[cIdx].parts ?? [];
                                  parts.push(emptyCoursePart());
                                  next[sIdx].courses[cIdx] = { ...next[sIdx].courses[cIdx], parts };
                                  setFieldValue("semesters", next);
                                }}
                                className="!py-1 !px-2.5 text-xs flex items-center gap-2"
                              >
                                <FiPlus className="w-3 h-3" /> Add Part
                              </Button>
                            </div>

                            {(values.semesters[sIdx].courses[cIdx].parts ?? []).map((part, pIdx) => {
                              const partBase = `${courseBase}.parts.${pIdx}`;

                              return (
                                <div key={part._uid} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-1">
                                      <Label className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gray-100">
                                          <FiTag className="w-4 h-4 text-gray-600" />
                                        </span>
                                        <span className="font-medium">Part Type</span>
                                      </Label>

                                      <Select {...getFieldProps(`${partBase}.courseType`)} className="mt-2">
                                        <option value={COURSE_TYPE.THEORY}>Theory</option>
                                        <option value={COURSE_TYPE.LAB}>Lab</option>
                                      </Select>

                                      {renderFieldError(`${partBase}.courseType`)}
                                    </div>

                                    <div className="w-28">
                                      <Label className="flex items-center gap-2">
                                        <FiHash className="text-gray-500" />
                                        <span className="font-medium">Credits</span>
                                      </Label>

                                      <div className="mt-2 flex gap-2">
                                        <Select
                                          {...getFieldProps(`${partBase}.credits`)}
                                          onChange={(e) => {
                                            const nv = e.target.value === "" ? undefined : Number(e.target.value);
                                            setFieldValue(`${partBase}.credits`, nv);
                                            setFieldTouched(`${partBase}.credits`, true, false);
                                            if (nv !== undefined && Number.isFinite(nv) && !shared.credits.includes(nv)) addCredit(nv);
                                          }}
                                          className="w-full"
                                        >
                                          <option value="">—</option>
                                          {shared.credits.map((cr) => (
                                            <option key={cr} value={cr}>
                                              {cr}
                                            </option>
                                          ))}
                                        </Select>
                                      </div>

                                      {renderFieldError(`${partBase}.credits`)}
                                    </div>

                                    {values.semesters[sIdx].courses[cIdx].parts.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                          const next = [...values.semesters];
                                          const parts = next[sIdx].courses[cIdx].parts.filter((_, i) => i !== pIdx);
                                          next[sIdx].courses[cIdx] = { ...next[sIdx].courses[cIdx], parts };
                                          setFieldValue("semesters", next);
                                        }}
                                        className="!p-2 mt-6"
                                      >
                                        <FiX className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="mb-3">
                                    <Label className="flex items-center gap-2">
                                      <FiInfo className="text-gray-500" />
                                      <span className="font-medium">Part Notes</span>
                                    </Label>
                                    <Textarea {...getFieldProps(`${partBase}.notes`)} rows={2} placeholder="Part notes..." className="mt-2" />
                                    {renderFieldError(`${partBase}.notes`)}
                                  </div>

                                  <div className="h-px bg-gray-200 my-4" />

                                  {/* Teachers */}
                                  <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <Label className="!mb-0 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                          <FiUsers className="text-white w-3 h-3" />
                                        </span>
                                        Teachers
                                      </Label>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                          const next = [...values.semesters];
                                          const teachers = next[sIdx].courses[cIdx].parts[pIdx].teachers ?? [];
                                          teachers.push(emptyTeacher());
                                          next[sIdx].courses[cIdx].parts[pIdx] = { ...next[sIdx].courses[cIdx].parts[pIdx], teachers };
                                          setFieldValue("semesters", next);
                                        }}
                                        className="!py-1 !px-2.5 text-xs flex items-center gap-2"
                                      >
                                        <FiPlus className="w-3 h-3" /> Add
                                      </Button>
                                    </div>

                                    {(values.semesters[sIdx].courses[cIdx].parts[pIdx].teachers ?? []).map((t, tIdx) => {
                                      const teacherBase = `${partBase}.teachers.${tIdx}`;
                                      return (
                                        <div key={t._uid} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                          <div className="flex gap-2">
                                            <Select
                                              {...getFieldProps(`${teacherBase}.name`)}
                                              onChange={(e) => {
                                                setFieldValue(`${teacherBase}.name`, e.target.value);
                                                setFieldTouched(`${teacherBase}.name`, true, false);
                                                if (e.target.value && !shared.teacherNames.includes(e.target.value)) addTeacherName(e.target.value);
                                              }}
                                            >
                                              <option value="">— select / type —</option>
                                              {shared.teacherNames.map((tn) => (
                                                <option key={tn} value={tn}>
                                                  {tn}
                                                </option>
                                              ))}
                                            </Select>
                                            {renderFieldError(`${teacherBase}.name`)}
                                          </div>

                                          <Input
                                            {...getFieldProps(`${teacherBase}.designation`)}
                                            placeholder="Designation"
                                          />
                                          <div className="flex gap-2">
                                            <Input {...getFieldProps(`${teacherBase}.notes`)} placeholder="Notes" />
                                            {values.semesters[sIdx].courses[cIdx].parts[pIdx].teachers.length > 1 && (
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                  const next = [...values.semesters];
                                                  const teachers = next[sIdx].courses[cIdx].parts[pIdx].teachers.filter((_, i) => i !== tIdx);
                                                  next[sIdx].courses[cIdx].parts[pIdx] = { ...next[sIdx].courses[cIdx].parts[pIdx], teachers };
                                                  setFieldValue("semesters", next);
                                                }}
                                                className="!p-2"
                                              >
                                                <FiX className="w-4 h-4" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="h-px bg-gray-200 my-4" />

                                  {/* Exam Definitions */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <Label className="!mb-0 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                          <FiFileText className="text-white w-3 h-3" />
                                        </span>
                                        Exam Definitions
                                      </Label>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                          const next = [...values.semesters];
                                          const examDefinitions = next[sIdx].courses[cIdx].parts[pIdx].examDefinitions ?? [];
                                          examDefinitions.push(emptyExamDefinition());
                                          next[sIdx].courses[cIdx].parts[pIdx] = { ...next[sIdx].courses[cIdx].parts[pIdx], examDefinitions };
                                          setFieldValue("semesters", next);
                                        }}
                                        className="!py-1 !px-2.5 text-xs flex items-center gap-2"
                                      >
                                        <FiPlus className="w-3 h-3" /> Add
                                      </Button>
                                    </div>

                                    {(values.semesters[sIdx].courses[cIdx].parts[pIdx].examDefinitions ?? []).map((ed, edIdx) => {
                                      const edBase = `${partBase}.examDefinitions.${edIdx}`;

                                      return (
                                        <div key={ed._uid} className="bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-lg p-3 mb-2 border border-gray-100">
                                          <div className="flex gap-2 mb-3 flex-wrap">
                                            <div className="flex-1 min-w-[120px]">
                                              <Select
                                                {...getFieldProps(`${edBase}.examType`)}
                                                onChange={(e) => {
                                                  setFieldValue(`${edBase}.examType`, e.target.value);
                                                  setFieldTouched(`${edBase}.examType`, true, false);
                                                }}
                                              >
                                                <option value={EXAM_TYPE.MID}>Mid</option>
                                                <option value={EXAM_TYPE.FINAL}>Final</option>
                                              </Select>
                                              {renderFieldError(`${edBase}.examType`)}
                                            </div>

                                            <div className="flex-1 min-w-[120px]">
                                              <Select
                                                {...getFieldProps(`${edBase}.condition`)}
                                                onChange={(e) => {
                                                  setFieldValue(`${edBase}.condition`, e.target.value);
                                                  setFieldTouched(`${edBase}.condition`, true, false);
                                                }}
                                              >
                                                <option value={EXAM_TYPE_CONDITION.REGULAR}>Regular</option>
                                                <option value={EXAM_TYPE_CONDITION.MAKEUP}>Makeup</option>
                                              </Select>
                                              {renderFieldError(`${edBase}.condition`)}
                                            </div>

                                            <div className="w-28">
                                              <Input
                                                {...getFieldProps(`${edBase}.totalMarks`)}
                                                type="number"
                                                placeholder="Total"
                                                onChange={(e) => {
                                                  const nv = e.target.value === "" ? undefined : Number(e.target.value);
                                                  setFieldValue(`${edBase}.totalMarks`, nv);
                                                  setFieldTouched(`${edBase}.totalMarks`, true, false);
                                                  // also touch components to force array-level validation message visibility
                                                  setFieldTouched(`${edBase}.components`, true, false);
                                                }}
                                              />
                                              {renderFieldError(`${edBase}.totalMarks`)}
                                            </div>

                                            {(values.semesters[sIdx].courses[cIdx].parts[pIdx].examDefinitions ?? []).length > 1 && (
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                  const next = [...values.semesters];
                                                  const eds = next[sIdx].courses[cIdx].parts[pIdx].examDefinitions.filter((_, i) => i !== edIdx);
                                                  next[sIdx].courses[cIdx].parts[pIdx] = { ...next[sIdx].courses[cIdx].parts[pIdx], examDefinitions: eds };
                                                  setFieldValue("semesters", next);
                                                }}
                                                className="!p-2"
                                              >
                                                <FiX className="w-4 h-4" />
                                              </Button>
                                            )}
                                          </div>

                                          <div className="space-y-2">
                                            {(values.semesters[sIdx].courses[cIdx].parts[pIdx].examDefinitions ?? [])[edIdx]?.components?.map(
                                              (comp, compIdx) => {
                                                const compBase = `${edBase}.components.${compIdx}`;

                                                return (
                                                  <div key={comp._uid} className="grid grid-cols-2 gap-2">
                                                    <Select
                                                      {...getFieldProps(`${compBase}.name`)}
                                                      onChange={(e) => {
                                                        setFieldValue(`${compBase}.name`, e.target.value);
                                                        setFieldTouched(`${compBase}.name`, true, false);
                                                      }}
                                                    >
                                                      <option value={RESULT_COMPONENT_NAME.TT}>TT</option>
                                                      <option value={RESULT_COMPONENT_NAME.ASSIGNMENTS}>Assignments</option>
                                                      <option value={RESULT_COMPONENT_NAME.ATTENDANCE}>Attendance</option>
                                                      <option value={RESULT_COMPONENT_NAME.OTHERS}>Others</option>
                                                      <option value={RESULT_COMPONENT_NAME.PRACTICAL}>Practical</option>
                                                      <option value={RESULT_COMPONENT_NAME.VIVA}>Viva</option>
                                                    </Select>
                                                    <div className="flex gap-2">
                                                      <Input
                                                        {...getFieldProps(`${compBase}.maxMarks`)}
                                                        type="number"
                                                        placeholder="Max marks"
                                                        onChange={(e) => {
                                                          const nv = e.target.value === "" ? undefined : Number(e.target.value);
                                                          setFieldValue(`${compBase}.maxMarks`, nv);
                                                          // touch component and parent total to show validation
                                                          setFieldTouched(`${compBase}.maxMarks`, true, false);
                                                          setFieldTouched(`${edBase}.totalMarks`, true, false);
                                                          setFieldTouched(`${edBase}.components`, true, false);
                                                        }}
                                                      />
                                                      {((values.semesters[sIdx].courses[cIdx].parts[pIdx].examDefinitions ?? [])[edIdx]
                                                        ?.components?.length ?? 0) > 1 && (
                                                          <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                              const next = [...values.semesters];
                                                              const comps =
                                                                next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx].components.filter(
                                                                  (_: unknown, i: number) => i !== compIdx
                                                                );
                                                              next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx] = {
                                                                ...next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx],
                                                                components: comps,
                                                              };
                                                              setFieldValue("semesters", next);
                                                              // touch examDefinition components & total to re-run validation
                                                              setFieldTouched(`${edBase}.components`, true, false);
                                                              setFieldTouched(`${edBase}.totalMarks`, true, false);
                                                            }}
                                                            className="!p-2"
                                                          >
                                                            <FiX className="w-4 h-4" />
                                                          </Button>
                                                        )}
                                                    </div>

                                                    {renderFieldError(`${compBase}.maxMarks`)}
                                                  </div>
                                                );
                                              }
                                            )}

                                            <Button
                                              type="button"
                                              variant="ghost"
                                              onClick={() => {
                                                const next = [...values.semesters];
                                                const comps = next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx].components ?? [];
                                                comps.push(emptyResultComponent());
                                                next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx] = {
                                                  ...next[sIdx].courses[cIdx].parts[pIdx].examDefinitions[edIdx],
                                                  components: comps,
                                                };
                                                setFieldValue("semesters", next);
                                                // touch to show validation if needed
                                                setFieldTouched(`${edBase}.components`, true, false);
                                              }}
                                              className="w-full !py-1.5 text-xs flex items-center justify-center gap-2"
                                            >
                                              <FiPlus className="w-3 h-3" /> Add Component
                                            </Button>

                                            {renderFieldError(`${edBase}.components`)}

                                            {/* show examDefinition level error (sum-leq-total) */}
                                            {renderFieldError(`${edBase}`)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex gap-3">
            <Button type="submit" disabled={isSubmitting || submitting} variant="primary" className="flex-1 !py-3 text-base font-semibold flex items-center justify-center gap-3">
              <FiSave className="w-5 h-5" />
              {isSubmitting || submitting ? "Saving..." : submitLabel}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleReset(e as unknown as React.SyntheticEvent)}
              className="!py-3 flex items-center gap-2"
            >
              <FiRotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
