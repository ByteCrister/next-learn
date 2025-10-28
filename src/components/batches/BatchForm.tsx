// app/components/batches/BatchForm.tsx
"use client";
import React from "react";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as yup from "yup";
import type { CreateBatchPayload, UpdateBatchPayload } from "@/types/types.batch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { FiArchive, FiSave, FiAlertCircle, FiBookOpen, FiCalendar, FiFileText, FiTag } from "react-icons/fi";

/** Server error shapes we support */
type FieldErrorItem = { field: string; message: string };
type ServerErrorShape =
  | { fieldErrors?: FieldErrorItem[]; errors?: Record<string, string> }
  | Record<string, string>
  | { message?: string };

function isFieldErrorArray(obj: unknown): obj is { fieldErrors: FieldErrorItem[] } {
  return typeof obj === "object" && obj !== null && "fieldErrors" in obj && Array.isArray(obj.fieldErrors);
}
function isErrorsRecord(obj: unknown): obj is { errors: Record<string, string> } {
  return typeof obj === "object" && obj !== null && "errors" in obj && typeof obj.errors === "object" && obj.errors !== null;
}
function isPlainRecordOfStrings(obj: unknown): obj is Record<string, string> {
  if (typeof obj !== "object" || obj === null) return false;
  return Object.values(obj).every((v) => typeof v === "string");
}

export type BatchFormValues = {
  name: string;
  program: string;
  year: string;
  notes: string;
};

const validationSchema = yup.object({
  name: yup.string().trim().required("Name is required").max(100),
  program: yup.string().trim().nullable().max(100),
  year: yup
    .string()
    .nullable()
    .test("is-valid-year-or-empty", "Invalid year", (val) => {
      if (val == null || val === "") return true;
      const n = Number(val);
      if (!Number.isFinite(n)) return false;
      return n >= 1900 && n <= new Date().getFullYear() + 5;
    }),
  notes: yup.string().trim().nullable().max(2000),
});

type CommonProps = {
  initialValues: BatchFormValues;
  submitLabel?: string;
  submitting?: boolean;
};

type CreateProps = CommonProps & {
  mode?: "create";
  onSubmit: (payload: CreateBatchPayload) => Promise<void>;
  id?: never;
};

type UpdateProps = CommonProps & {
  mode: "update";
  onSubmit: (payload: UpdateBatchPayload) => Promise<void>;
  id: string;
};

type Props = CreateProps | UpdateProps;

export default function BatchForm(props: Props) {
  const { initialValues, submitLabel = "Save", submitting = false } = props;

  function buildCreatePayload(values: BatchFormValues): CreateBatchPayload {
    const payload: CreateBatchPayload = {
      name: values.name.trim(),
    };
    const program = values.program?.trim();
    if (program) payload.program = program;
    const year = values.year?.trim();
    if (year !== "" && year !== undefined) payload.year = Number(year);
    const notes = values.notes?.trim();
    if (notes) payload.notes = notes;
    return payload;
  }

  function buildUpdatePayload(values: BatchFormValues, id: string): UpdateBatchPayload {
    const base = buildCreatePayload(values);
    const update: UpdateBatchPayload = { _id: id };
    update.name = base.name;
    update.program = typeof base.program !== "undefined" ? base.program : null;
    update.year = typeof base.year !== "undefined" ? base.year : null;
    update.notes = typeof base.notes !== "undefined" ? base.notes : null;
    return update;
  }

  async function handleSubmit(values: BatchFormValues, formikHelpers: FormikHelpers<BatchFormValues>) {
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
      const server = err as ServerErrorShape | null;
      if (server) {
        if (isFieldErrorArray(server)) {
          const mapped: Record<string, string> = {};
          for (const it of server.fieldErrors) {
            if (it && typeof it.field === "string" && typeof it.message === "string") {
              mapped[it.field] = it.message;
            }
          }
          if (Object.keys(mapped).length > 0) setErrors(mapped);
        } else if (isErrorsRecord(server)) {
          setErrors(server.errors);
        } else if (isPlainRecordOfStrings(server)) {
          setErrors(server as Record<string, string>);
        }
      }
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden"
    >
      <div className="p-6 sm:p-8 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {props.mode === "update" ? "Edit Batch" : "Create New Batch"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {props.mode === "update" ? "Update the batch information below" : "Fill in the details to create a new batch"}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <Formik<BatchFormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting, resetForm, values }) => (
            <Form className="space-y-6" noValidate>
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <FiTag className="text-blue-500" />
                  Batch Name <span className="text-red-500">*</span>
                </Label>
                <Field name="name">
                  {({ field }: FieldProps<string>) => (
                    <div className="relative group">
                      <Input
                        {...field}
                        id="name"
                        placeholder="e.g., Spring 2025"
                        className={`
                          h-11 rounded-xl border-2 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50
                          ${errors.name && touched.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                          }
                        `}
                        aria-invalid={Boolean(errors.name && touched.name)}
                        aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                        required
                      />
                    </div>
                  )}
                </Field>
                <AnimatePresence>
                  {errors.name && touched.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle className="flex-shrink-0" />
                      <span id="name-error">{errors.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Program Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="program" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <FiBookOpen className="text-purple-500" />
                  Program
                </Label>
                <Field name="program">
                  {({ field }: FieldProps<string>) => (
                    <div className="relative group">
                      <Input
                        {...field}
                        id="program"
                        placeholder="e.g., Computer Science"
                        className={`
                          h-11 rounded-xl border-2 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50
                          ${errors.program && touched.program
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                          }
                        `}
                        aria-invalid={Boolean(errors.program && touched.program)}
                        aria-describedby={errors.program && touched.program ? "program-error" : undefined}
                      />
                    </div>
                  )}
                </Field>
                <AnimatePresence>
                  {errors.program && touched.program && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle className="flex-shrink-0" />
                      <span id="program-error">{errors.program}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Year Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="year" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <FiCalendar className="text-green-500" />
                  Year
                </Label>
                <Field name="year">
                  {({ field }: FieldProps<string>) => (
                    <div className="relative group">
                      <Input
                        {...field}
                        id="year"
                        type="number"
                        inputMode="numeric"
                        placeholder="2025"
                        className={`
                          h-11 rounded-xl border-2 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50
                          ${errors.year && touched.year
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                          }
                        `}
                        aria-invalid={Boolean(errors.year && touched.year)}
                        aria-describedby={errors.year && touched.year ? "year-error" : undefined}
                      />
                    </div>
                  )}
                </Field>
                <AnimatePresence>
                  {errors.year && touched.year && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle className="flex-shrink-0" />
                      <span id="year-error">{errors.year}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Notes Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                  <FiFileText className="text-orange-500" />
                  Notes
                </Label>
                <Field name="notes">
                  {({ field }: FieldProps<string>) => (
                    <div className="relative group">
                      <Textarea
                        {...field}
                        id="notes"
                        rows={4}
                        placeholder="Add any additional information about this batch..."
                        className={`
                          rounded-xl border-2 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 resize-none
                          ${errors.notes && touched.notes
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                          }
                        `}
                        aria-invalid={Boolean(errors.notes && touched.notes)}
                        aria-describedby={errors.notes && touched.notes ? "notes-error" : undefined}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                        {values.notes?.length || 0} / 2000
                      </div>
                    </div>
                  )}
                </Field>
                <AnimatePresence>
                  {errors.notes && touched.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <FiAlertCircle className="flex-shrink-0" />
                      <span id="notes-error">{errors.notes}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4"
              >
                <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting || submitting}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-xl font-medium text-base transition-all duration-300"
                    aria-disabled={isSubmitting || submitting}
                  >
                    {isSubmitting || submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        {submitLabel}
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resetForm()}
                    disabled={isSubmitting || submitting}
                    className="w-full sm:w-auto h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all duration-300"
                  >
                    <FiArchive className="mr-2" />
                    Reset
                  </Button>
                </motion.div>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
}