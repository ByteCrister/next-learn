"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Choice, ExamDTO, ExamResultDTO, QuestionContent } from "@/types/types.exam";
import { useExamStore } from "@/store/useExamStore";
import Image from "next/image";
import { ResultStatusBadge } from "./ResultStatusBadge";
import { EditExamDialog } from "./EditExamDialog";
import { AddQuestionDialog } from "./AddQuestionDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ExamDetailSkeleton } from "./ExamDetailsSkeleton";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { UpdateQuestionDialog } from "./UpdateQuestionDialog";
import { ShareButton } from "./ShareButton";
import { useDashboardStore } from "@/store/useDashboardStore";
import { rearrangeObjectId } from "@/utils/helpers/rearrangeObjectId";
import { ResultDetailDialog } from "./ResultDetailDialog";
import { FiUser, FiMail, FiCheckCircle, FiAward, FiClock, FiBarChart2, FiActivity, FiCalendar, FiFlag, FiAlertTriangle, FiSettings } from "react-icons/fi"

interface MetaRowProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export default function ExamDetails() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { examsById, resultsByExamId, fetchExamById, fetching } = useExamStore();
  const { user } = useDashboardStore();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | null>(null);
  const [selectedResult, setSelectedResult] = React.useState<ExamResultDTO | null>(null);

  React.useEffect(() => {
    const loadExam = async () => {
      const cached = examsById[examId];
      if (!cached) {
        await fetchExamById(examId);
      }
    };
    loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const handleShare = () => {
    if (!user?._id || !exam?._id) return;

    const createdBy = rearrangeObjectId(user._id); // split every 6 chars
    const examId = rearrangeObjectId(exam._id);

    const examLink = `${window.location.origin}/join-exam/${createdBy}-join-${examId}`;
    navigator.clipboard.writeText(examLink);
  };

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Exam not found</CardTitle>
            <CardDescription>The exam you&apos;re looking for does not exist or was removed.</CardDescription>
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

  const isEnded =
    exam.scheduledStartAt && exam.durationMinutes
      ? Date.now() >
      new Date(exam.scheduledStartAt).getTime() +
      exam.durationMinutes * 60 * 1000 +
      (!exam.isTimed ? (exam.lateWindowMinutes ?? 0) * 60 * 1000 : 0)
      : false;


  const hasResults = results.length > 0;
  const isEditable = !(isEnded && hasResults);


  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              {exam.title}
              {isEnded && (
                <Badge variant="secondary" className="text-xs">Ended</Badge>
              )}
              <ShareButton onShare={() => handleShare()} isEditable={isEditable} />
            </h1>

            <p className="text-muted-foreground">
              <span className="font-mono">{exam.examCode}</span> • Subject <span className="font-medium">{exam.subjectCode}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditExamDialog exam={exam} asChild>
              <Button variant="outline" disabled={!isEditable} >Edit</Button>
            </EditExamDialog>
            <AddQuestionDialog exam={exam} asChild />
            <Button variant="outline" disabled={!isEditable} onClick={() => fetchExamById(exam._id, true)}>Refresh</Button>
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
                  cta={<AddQuestionDialog exam={exam} asChild><Button disabled={!isEditable} >Add question</Button></AddQuestionDialog>}
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                <FiSettings className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                Exam settings
              </CardTitle>
              <CardDescription className="mt-0.5 text-slate-600 dark:text-slate-400">
                Timing, rules, and behavior
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              {/* Timed */}
              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiClock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Timed
                  </span>
                }
              >
                {exam.isTimed ? "Yes" : "No"}
              </MetaRow>

              {exam.isTimed && (
                <MetaRow
                  label={
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <FiClock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      Duration
                    </span>
                  }
                >
                  {exam.durationMinutes ?? 0} minutes
                </MetaRow>
              )}

              {/* Date & Time */}
              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiCalendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Date
                  </span>
                }
              >
                {exam.scheduledStartAt
                  ? new Date(exam.scheduledStartAt).toLocaleDateString()
                  : "Not scheduled"}
              </MetaRow>

              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiFlag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Start
                  </span>
                }
              >
                {exam.scheduledStartAt
                  ? new Date(exam.scheduledStartAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "Not scheduled"}
              </MetaRow>

              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiFlag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    End
                  </span>
                }
              >
                {exam.scheduledStartAt && exam.durationMinutes
                  ? new Date(
                    new Date(exam.scheduledStartAt).getTime() +
                    exam.durationMinutes * 60 * 1000
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Not scheduled"}
              </MetaRow>

              <Separator />

              {/* Late submission */}
              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiAlertTriangle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Allow late
                  </span>
                }
              >
                {exam.allowLateSubmissions ? "Yes" : "No"}
              </MetaRow>

              {exam.allowLateSubmissions && (
                <MetaRow
                  label={
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <FiClock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      Late window
                    </span>
                  }
                >
                  {exam.lateWindowMinutes ?? 0} minutes
                </MetaRow>
              )}

              {/* Auto submit */}
              <MetaRow
                label={
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FiCheckCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Auto submit
                  </span>
                }
              >
                {exam.autoSubmitOnEnd ? "Enabled" : "Disabled"}
              </MetaRow>

              <Separator />

              {/* Validation rule */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiSettings className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  Validation rule
                </div>

                {!hasRule ? (
                  <EmptyTiny title="No rule configured" />
                ) : (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {exam?.validationRule?.startsWith && exam?.validationRule?.startsWith?.length > 0 && (
                      <div>
                        Starts with:{" "}
                        <span className="font-mono">
                          {exam.validationRule.startsWith.join(", ")}
                        </span>
                      </div>
                    )}
                    {exam.validationRule.minLength && (
                      <div>Min length: {exam.validationRule.minLength}</div>
                    )}
                    {exam.validationRule.maxLength && (
                      <div>Max length: {exam.validationRule.maxLength}</div>
                    )}
                  </div>
                )}

                <EditExamDialog exam={exam} asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    disabled={!isEditable}
                  >
                    Update settings
                  </Button>
                </EditExamDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-muted/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              {/* Left side: title + description */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                  <FiBarChart2 className="h-5 w-5 text-blue-500" />
                  Results
                </CardTitle>
                <CardDescription className="mt-0.5 text-slate-600 dark:text-slate-400">
                  Participant outcomes and statuses
                </CardDescription>
              </motion.div>

              {/* Right side: status badge */}
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              >
                {isEnded ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium"
                  >
                    <FiCheckCircle className="h-4 w-4 text-green-600" />
                    Exam ended
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium"
                  >
                    <FiActivity className="h-4 w-4 text-blue-500" />
                    Ongoing
                  </Badge>
                )}
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <EmptyBlock title="No results yet" description="When participants submit, their results will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-md text-sm">
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead className="whitespace-nowrap font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiUser className="h-4 w-4 text-blue-500" />
                          Participant
                        </span>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiMail className="h-4 w-4 text-blue-500" />
                          Email
                        </span>
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiCheckCircle className="h-4 w-4 text-blue-500" />
                          Status
                        </span>
                      </TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiAward className="h-4 w-4 text-blue-500" />
                          Score
                        </span>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiClock className="h-4 w-4 text-blue-500" />
                          Started
                        </span>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-slate-600 dark:text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <FiClock className="h-4 w-4 text-blue-500" />
                          Ended
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {results.map((r, idx) => (
                      <TableRow
                        key={r._id}
                        onClick={() => setSelectedResult(r)}
                        className={`
            cursor-pointer transition-colors duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/30
            ${idx % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50 dark:bg-slate-900"}
          `}
                      >
                        <TableCell className="font-medium text-slate-800 dark:text-slate-100">
                          {r.participantId}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-slate-600 dark:text-slate-300">
                          {r.participantEmail}
                        </TableCell>
                        <TableCell>
                          <ResultStatusBadge status={r.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-medium text-slate-700 dark:text-slate-200">
                          {r.score ?? "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-300">
                          {new Date(r.startedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-300">
                          {new Date(r.endedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      {selectedQuestionIndex !== null && isEditable && (
        <UpdateQuestionDialog
          exam={exam}
          questionIndex={selectedQuestionIndex}
          open={selectedQuestionIndex !== null}
          onClose={() => setSelectedQuestionIndex(null)}
        />
      )}
      {selectedResult && (
        <ResultDetailDialog
          open={!!selectedResult}
          exam={exam}
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}

    </div>
  );
}

export function MetaRow({ label, children }: MetaRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="text-slate-600 dark:text-slate-400">{label}</div>
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
