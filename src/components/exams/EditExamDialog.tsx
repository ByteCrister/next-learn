"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ExamDTO } from "@/types/types.exam";
import { toast } from "react-toastify";
import { Switch } from "../ui/switch";
import { useExamStore } from "@/store/useExamStore";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  subjectCode: z.string().min(1),
  examCode: z.string().min(1),
  isTimed: z.boolean().optional(),
  durationMinutes: z.number().optional(),
  scheduledStartAt: z.string().nullable().optional(),
  allowLateSubmissions: z.boolean().optional(),
  lateWindowMinutes: z.number().optional(),
  autoSubmitOnEnd: z.boolean().optional(),
  validationRule: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      startsWith: z.array(z.string()).optional(),
    })
    .optional(),
});

export function EditExamDialog({
  exam,
  children,
  asChild,
}: {
  exam: ExamDTO;
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const { update } = useExamStore();

  const [startsWith, setStartsWith] = React.useState<string[]>(
    exam.validationRule?.startsWith || []
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: exam.title,
      description: exam.description ?? "",
      subjectCode: exam.subjectCode,
      examCode: exam.examCode,
      isTimed: !!exam.isTimed,
      durationMinutes: exam.durationMinutes ?? 60,
      scheduledStartAt: exam.scheduledStartAt ?? null,
      allowLateSubmissions: !!exam.allowLateSubmissions,
      lateWindowMinutes: exam.lateWindowMinutes ?? 0,
      autoSubmitOnEnd: !!exam.autoSubmitOnEnd,
      validationRule: {
        minLength: exam.validationRule?.minLength ?? undefined,
        maxLength: exam.validationRule?.maxLength ?? undefined,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    // Check scheduledStartAt
    if (values.scheduledStartAt) {
      const selectedDate = new Date(values.scheduledStartAt);
      const now = new Date();
      if (selectedDate.getTime() < now.getTime()) {
        toast.error("Scheduled start date/time cannot be in the past.");
        return;
      }
    }

    const payload = {
      ...values,
      validationRule: {
        ...values.validationRule,
        startsWith,
      },
      scheduledStartAt: values.scheduledStartAt
        ? new Date(values.scheduledStartAt).toISOString()
        : null,
    };

    const isUpdated = await update(exam._id, payload);
    if (isUpdated) toast.success("Exam updated");
    setOpen(false);
  };


  const Trigger = DialogTrigger as React.FC<
    React.ComponentProps<typeof DialogTrigger>
  >;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Trigger asChild={asChild}>
        {children ?? <Button variant="outline">Edit</Button>}
      </Trigger>

      <DialogContent
        className="
          sm:max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          p-6
          bg-white
          dark:bg-gray-900/60
          backdrop-blur-lg
          border
          border-gray-200
          dark:border-gray-700
          rounded-2xl
          shadow-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Edit Exam
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Update exam details and scheduling.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title + Subject */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="subjectCode">Subject code</Label>
              <Input id="subjectCode" {...form.register("subjectCode")} />
            </div>
          </div>

          {/* Exam code + Duration */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="examCode">Exam code</Label>
              <Input id="examCode" {...form.register("examCode")} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={0}
                {...form.register("durationMinutes", { valueAsNumber: true })}
              />
              <div className="flex items-center gap-2 mt-1">
                <Switch
                  checked={form.watch("isTimed")}
                  onCheckedChange={(v) => form.setValue("isTimed", v)}
                />
                <span className="text-sm text-muted-foreground">Timed exam</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>

          {/* Scheduled start */}
          <div className="space-y-1">
            <Label htmlFor="start">Scheduled start</Label>
            <Input
              id="start"
              type="datetime-local"
              {...form.register("scheduledStartAt")}
              min={new Date().toISOString().slice(0, 16)} // sets min to current date & time
            />
          </div>

          {/* Late + Auto submit */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm">Allow late submissions</span>
              <Switch
                checked={!!form.watch("allowLateSubmissions")}
                onCheckedChange={(v) => form.setValue("allowLateSubmissions", v)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lateWindow">Late window (minutes)</Label>
              <Input
                id="lateWindow"
                type="number"
                min={0}
                {...form.register("lateWindowMinutes", { valueAsNumber: true })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm">Auto submit on end</span>
              <Switch
                checked={!!form.watch("autoSubmitOnEnd")}
                onCheckedChange={(v) => form.setValue("autoSubmitOnEnd", v)}
              />
            </div>
          </div>

          {/* Validation Rules */}
          <div className="space-y-3 border rounded-lg p-4">
            <Label>Validation Rules</Label>

            {/* StartsWith list */}
            <div className="space-y-2">
              <Label className="text-sm">Starts With</Label>
              {startsWith.map((prefix, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prefix}
                    onChange={(e) =>
                      setStartsWith((prev) =>
                        prev.map((p, i) => (i === index ? e.target.value : p))
                      )
                    }
                    placeholder="e.g., 010"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setStartsWith((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStartsWith((prev) => [...prev, ""])}
              >
                Add Prefix
              </Button>
            </div>

            {/* Min / Max length */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Min Length</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("validationRule.minLength", {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Max Length</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("validationRule.maxLength", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
