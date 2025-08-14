"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Choice, ExamDTO, QuestionContent } from "@/types/types.exam";
import { useExamStore } from "@/store/useExamStore";
import Image from "next/image";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { EditExamDialog } from "./EditExamDialog";
import { AddQuestionDialog } from "./AddQuestionDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ExamDetailSkeleton } from "./ExamDetailSkeleton";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { UpdateQuestionDialog } from "./UpdateQuestionDialog";

export default function ExamDetailClient() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { examsById, resultsByExamId, fetchExamById, fetching } = useExamStore();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const loadExam = async () => {
      const cached = examsById[examId];
      if (!cached) {
        await fetchExamById(examId);
      }
    };
    loadExam();
  }, [examId, examsById, fetchExamById]);


  React.useEffect(() => {
    setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Exams", href: "/exams" },
      { label: `${examsById[examId]?.title ?? ''} - ${examsById[examId]?.examCode ?? ''}`, href: `/exams/${examId}` },
    ]);
  }, [examId, examsById, setBreadcrumbs]);

  const exam: ExamDTO | undefined = examsById[examId];
  const results = resultsByExamId[examId] ?? [];

  if (fetching) {
    return <ExamDetailSkeleton />;
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Exam not found</CardTitle>
            <CardDescription>The exam you’re looking for does not exist or was removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push("/exams")}>Back to exams</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasQuestions = exam.questions && exam.questions.length > 0;
  const hasRule =
    !!exam.validationRule &&
    (
      (exam.validationRule.startsWith && exam.validationRule.startsWith.length > 0) ||
      exam.validationRule.maxLength ||
      exam.validationRule.minLength);

  const now = new Date();
  const scheduledEnd = exam.scheduledEndAt ? new Date(exam.scheduledEndAt) : null;
  const isEnded = scheduledEnd ? scheduledEnd.getTime() <= now.getTime() : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{exam.title}</h1>
            <p className="text-muted-foreground">
              <span className="font-mono">{exam.examCode}</span> • Subject <span className="font-medium">{exam.subjectCode}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditExamDialog exam={exam} asChild>
              <Button variant="outline">Edit</Button>
            </EditExamDialog>
            <AddQuestionDialog exam={exam} asChild />
            <Button variant="outline" onClick={() => fetchExamById(exam._id, true)}>Refresh</Button>
            <ConfirmDeleteDialog examId={exam._id} asChild />
          </div>
        </div>

        {exam.description && (
          <Card className="border-muted/60">
            <CardContent className="py-4 text-sm text-muted-foreground">
              {exam.description}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-muted/60 lg:col-span-2">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Manage the content participants will see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasQuestions ? (
                <EmptyBlock
                  title="No questions yet"
                  description="Add your first question to get started."
                  cta={<AddQuestionDialog exam={exam} asChild><Button>Add question</Button></AddQuestionDialog>}
                />
              ) : (
                <div className="space-y-3">
                  {exam.questions.map((q, idx) => (
                    <div key={idx} onClick={() => setSelectedQuestionIndex(idx)} className="cursor-pointer" >
                      <QuestionItem index={idx} textBlocks={q.contents} choices={q.choices} />
                    </div>))}
                </div>

              )}
            </CardContent>
          </Card>

          <Card className="border-muted/60 self-start">
            <CardHeader>
              <CardTitle>Exam settings</CardTitle>
              <CardDescription>Timing, rules, and behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetaRow label="Timed">{exam.isTimed ? "Yes" : "No"}</MetaRow>
              {exam.isTimed && <MetaRow label="Duration">{exam.durationMinutes ?? 0} minutes</MetaRow>}
              <MetaRow label="Date">
                {exam.scheduledStartAt ? new Date(exam.scheduledStartAt).toLocaleDateString() : "Not scheduled"}
              </MetaRow>
              <MetaRow label="Start">
                {exam.scheduledStartAt ? new Date(exam.scheduledStartAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not scheduled"}
              </MetaRow>
              <MetaRow label="End">
                {exam.scheduledStartAt
                  && exam.durationMinutes
                  ? new Date(new Date(exam.scheduledStartAt).getTime() + exam.durationMinutes * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "Not scheduled"}
              </MetaRow>
              <Separator />
              <MetaRow label="Allow late">{exam.allowLateSubmissions ? "Yes" : "No"}</MetaRow>
              {exam.allowLateSubmissions && <MetaRow label="Late window">{exam.lateWindowMinutes ?? 0} minutes</MetaRow>}
              <MetaRow label="Auto submit">{exam.autoSubmitOnEnd ? "Enabled" : "Disabled"}</MetaRow>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Validation rule</div>
                {!hasRule ? (
                  <EmptyTiny title="No rule configured" />
                ) : (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {exam.validationRule.startsWith && exam.validationRule.startsWith.length > 0 && (
                      <div>Starts with: <span className="font-mono">{exam.validationRule.startsWith.join(", ")}</span></div>
                    )}
                    {exam.validationRule.minLength && <div>Min length: {exam.validationRule.minLength}</div>}
                    {exam.validationRule.maxLength && <div>Max length: {exam.validationRule.maxLength}</div>}
                  </div>
                )}
                <EditExamDialog exam={exam} asChild>
                  <Button variant="outline" size="sm" className="mt-1">Update settings</Button>
                </EditExamDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-muted/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Results</CardTitle>
                <CardDescription>Participant outcomes and statuses.</CardDescription>
              </div>
              {isEnded ? (
                <Badge variant="secondary">Exam ended</Badge>
              ) : (
                <Badge variant="outline">Ongoing</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <EmptyBlock title="No results yet" description="When participants submit, their results will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Score</TableHead>
                      <TableHead className="hidden lg:table-cell">Started</TableHead>
                      <TableHead className="hidden lg:table-cell">Ended</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell className="font-medium">{r.participantId}</TableCell>
                        <TableCell className="hidden sm:table-cell">{r.participantEmail}</TableCell>
                        <TableCell><ResultStatusBadge status={r.status} /></TableCell>
                        <TableCell className="hidden md:table-cell">{r.score ?? "-"}</TableCell>
                        <TableCell className="hidden lg:table-cell">{new Date(r.startedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      {selectedQuestionIndex !== null && (
        <UpdateQuestionDialog
          exam={exam}
          questionIndex={selectedQuestionIndex}
          open={selectedQuestionIndex !== null}
          onClose={() => setSelectedQuestionIndex(null)}
        />
      )}
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{children}</div>
    </div>
  );
}

function EmptyBlock({
  title,
  description,
  cta,
}: {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-dashed p-6 text-center">
      <div className="font-medium">{title}</div>
      {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
      {cta && <div className="mt-3">{cta}</div>}
    </div>
  );
}

function EmptyTiny({ title }: { title: string }) {
  return <div className="text-sm text-muted-foreground">{title}</div>;
}

interface QuestionContentWithCaption extends QuestionContent {
  caption?: string;
}

interface QuestionItemProps {
  index: number;
  textBlocks?: QuestionContentWithCaption[];
  choices: Choice[];
}

export function QuestionItem({ index, textBlocks = [], choices }: QuestionItemProps) {
  return (
    <div className="rounded-md border p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Q{index + 1}</div>
      </div>

      <div className="space-y-2">
        {textBlocks.map((block, i) =>
          block.type === "text" ? (
            <p key={i} className="text-sm">{block.value}</p>
          ) : (
            <div key={i} className="flex flex-col items-start">
              <Image
                src={block.value}
                alt={`Q${index + 1} image`}
                width={400}
                height={200}
                className="rounded-md border object-contain max-h-40"
              />
              {'caption' in block && block.caption && (
                <span className="text-xs text-muted-foreground mt-1">{block.caption}</span>
              )}
            </div>
          )
        )}
      </div>

      <Separator className="my-3" />

      <ul className="grid sm:grid-cols-2 gap-2">
        {choices.map((choice, i) => (
          <li
            key={i}
            className="text-sm rounded-md border px-3 py-2 bg-card hover:bg-accent transition-colors"
          >
            {choice.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
