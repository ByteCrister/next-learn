"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  durationMinutes: z.coerce.number().optional(),

  scheduledStartAt: z.string().nullable().optional(),
  scheduledEndAt: z.string().nullable().optional(),

  allowLateSubmissions: z.boolean().optional(),
  lateWindowMinutes: z.coerce.number().optional(),
  autoSubmitOnEnd: z.boolean().optional(),
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

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: exam.title,
      description: exam.description ?? "",
      subjectCode: exam.subjectCode,
      examCode: exam.examCode,
      isTimed: !!exam.isTimed,
      durationMinutes: exam.durationMinutes ?? 60,
      scheduledStartAt: exam.scheduledStartAt ?? null,
      scheduledEndAt: exam.scheduledEndAt ?? null,
      allowLateSubmissions: !!exam.allowLateSubmissions,
      lateWindowMinutes: exam.lateWindowMinutes ?? 0,
      autoSubmitOnEnd: !!exam.autoSubmitOnEnd,
    },
  });


  const onSubmit = async (values: z.infer<typeof schema>) => {
    const payload = {
      ...values,
      // normalize empties
      scheduledStartAt: values.scheduledStartAt || null,
      scheduledEndAt: values.scheduledEndAt || null,
    };
    await update(exam._id, payload);
    toast.success("Exam updated");
    setOpen(false);
  };

  const Trigger = DialogTrigger as React.FC<React.ComponentProps<typeof DialogTrigger>>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Trigger asChild={asChild}>{children ?? <Button variant="outline">Edit</Button>}</Trigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit exam</DialogTitle>
          <DialogDescription>Update exam details and scheduling.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjectCode">Subject code</Label>
              <Input id="subjectCode" {...form.register("subjectCode")} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="examCode">Exam code</Label>
              <Input id="examCode" {...form.register("examCode")} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" min={0} {...form.register("durationMinutes", { valueAsNumber: true })} />
              <div className="flex items-center gap-2 mt-1">
                <Switch checked={form.watch("isTimed")} onCheckedChange={(v) => form.setValue("isTimed", v)} />
                <span className="text-sm text-muted-foreground">Timed exam</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start">Scheduled start (ISO)</Label>
              <Input id="start" placeholder="2025-08-13T08:00:00Z" {...form.register("scheduledStartAt")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end">Scheduled end (ISO)</Label>
              <Input id="end" placeholder="2025-08-13T10:00:00Z" {...form.register("scheduledEndAt")} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">Allow late submissions</span>
              <Switch checked={!!form.watch("allowLateSubmissions")} onCheckedChange={(v) => form.setValue("allowLateSubmissions", v)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lateWindow">Late window (minutes)</Label>
              <Input id="lateWindow" type="number" min={0} {...form.register("lateWindowMinutes", { valueAsNumber: true })} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">Auto submit on end</span>
              <Switch checked={!!form.watch("autoSubmitOnEnd")} onCheckedChange={(v) => form.setValue("autoSubmitOnEnd", v)} />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
