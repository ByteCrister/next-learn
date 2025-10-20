"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ExamDTO, AnswerDTO, ExamTiming, SubmitResult } from "@/types/types.exam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // if you have it in shadcn
import { toast } from "react-toastify";
import { HiClock, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import clsx from "clsx";
import Image from "next/image";
import { getJoinExam, submitExamAnswers } from "@/utils/api/api.exams";
import TimePill from "./TimePill";
import { formatMs } from "./formatMs";
import ExamSkeleton from "./ExamSkeleton";
import { HeaderCard } from "./HeaderCard";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import SubmitAlert from "./SubmitAlert";
// --- email validation helper ---
function validateEmail(value: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
}
type Props = {
    createdBy: string;
    examId: string;
    participantId: string;
    examCode: string;
};

type ApiError = { message: string };

function isApiError(x: unknown): x is ApiError {
    return !!x && typeof x === "object" && "message" in x;
}

export default function ClientExamRunner(props: Props) {
    const { createdBy, examId, participantId, examCode } = props;

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [exam, setExam] = useState<ExamDTO | null>(null);
    const [result, setResult] = useState<SubmitResult | null>(null);
    const [answers, setAnswers] = useState<AnswerDTO[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Timer ticks every 1s
    const [now, setNow] = useState(() => Date.now());
    const tickRef = useRef<number | null>(null);

    useEffect(() => {
        tickRef.current = window.setInterval(() => setNow(Date.now()), 1000);
        return () => {
            if (tickRef.current) window.clearInterval(tickRef.current);
        };
    }, []);

    // Load exam/validate params
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            const res = await getJoinExam(createdBy, examId, participantId, examCode);
            if (!mounted) return;

            if (isApiError(res)) {
                toast.error(res.message || "Failed to join exam");
                setExam(null);
                setResult(null);
            } else {
                setExam(res);

                // If participant already has a result, attach it
                const existing = res.results?.find((r) => r.participantId === participantId) || null;
                setResult(existing);

                // Restore prior answers if any
                if (existing?.answers?.length) {
                    setAnswers(existing.answers);
                } else {
                    // Initialize empty answers for convenience (one entry per question as placeholder)
                    const init: AnswerDTO[] = res.questions.map((_: unknown, idx: number) => ({
                        questionIndex: idx,
                        selectedChoiceIndex: -1,
                    }));
                    setAnswers(init);
                }
            }
            setLoading(false);
        })();

        return () => {
            mounted = false;
        };
    }, [createdBy, examId, participantId, examCode]);

    // Derived timing state
    const timing: ExamTiming = useMemo(() => {
        if (!exam) return null;

        const scheduledStartAt = exam.scheduledStartAt ? new Date(exam.scheduledStartAt).getTime() : null;
        const hasSchedule = !!scheduledStartAt;

        const alreadyStartedAt = result?.startedAt ? new Date(result.startedAt).getTime() : null;

        // When the participant actually starts (clicks Start or pre-existing)
        const effectiveStart = alreadyStartedAt;

        const isTimed = !!exam.isTimed && !!exam.durationMinutes && exam.durationMinutes > 0;
        const mainDurationMs = isTimed ? exam.durationMinutes! * 60 * 1000 : null;

        const allowLate = !!exam.allowLateSubmissions && !!exam.lateWindowMinutes && exam.lateWindowMinutes > 0;
        const lateWindowMs = allowLate ? exam.lateWindowMinutes! * 60 * 1000 : 0;

        // Start-gate: can they start now?
        const nowMs = now;
        const beforeSchedule = hasSchedule && nowMs < (scheduledStartAt as number);

        // End calculations only make sense if started
        let mainEnd: number | null = null;
        let hardEnd: number | null = null;

        if (effectiveStart && isTimed) {
            mainEnd = effectiveStart + (mainDurationMs as number);
            hardEnd = mainEnd + (lateWindowMs || 0);
        }

        const beforeStartCountdownMs = beforeSchedule ? (scheduledStartAt as number) - nowMs : 0;

        const remainingMainMs = mainEnd ? Math.max(0, mainEnd - nowMs) : null;
        const remainingLateMs =
            mainEnd && hardEnd
                ? Math.max(0, hardEnd - nowMs) // time until absolute cut-off
                : null;

        const inMainTime = isTimed && effectiveStart ? nowMs < (mainEnd as number) : false;
        const inLateWindow = isTimed && allowLate && effectiveStart ? nowMs >= (mainEnd as number) && nowMs < (hardEnd as number) : false;
        const isExpired = isTimed && effectiveStart ? hardEnd !== null && nowMs >= hardEnd : false;

        // Unlimited if not timed
        const unlimited = !isTimed;

        return {
            hasSchedule,
            beforeSchedule,
            beforeStartCountdownMs,
            isTimed,
            unlimited,
            allowLate,
            lateWindowMs,
            started: !!effectiveStart,
            mainEnd,
            hardEnd,
            remainingMainMs,
            remainingLateMs,
            inMainTime,
            inLateWindow,
            isExpired,
        };
    }, [exam, result, now]);

    // Auto-submit if configured
    useEffect(() => {
        if (!exam || !result || !timing) return;
        if (!exam.autoSubmitOnEnd) return;

        if (timing.isTimed && timing.started && timing.isExpired) {
            if (result.status !== "submitted" && result.status !== "expired") {
                void handleSubmit("expired");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exam, result, timing]);


    // Auto-start exam when scheduled start time is reached
    useEffect(() => {
        if (!exam || !timing) return;
        if (timing.started) return; // already started

        // only start once the countdown reaches 0
        if (!timing.beforeSchedule && !result) {
            void handleStart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exam, timing?.beforeSchedule, timing?.started, result]);

    function setAnswer(questionIndex: number, choiceIndex: number) {
        if (!exam) return;

        // get the question
        const question = exam.questions[questionIndex];
        // check if the selected choice is correct
        const isCorrect = question.choices[choiceIndex]?.isCorrect === true;

        setAnswers((prev) => {
            const next = [...prev];
            const idx = next.findIndex((a) => a.questionIndex === questionIndex);

            const newAnswer: AnswerDTO = {
                questionIndex,
                selectedChoiceIndex: choiceIndex,
                isCorrect, // ✅ store correctness here
            };

            if (idx >= 0) {
                next[idx] = newAnswer;
            } else {
                next.push(newAnswer);
            }
            return next;
        });
    }

    async function handleStart() {
        if (!exam || !timing) return;

        if (timing.beforeSchedule) {
            toast.info("The exam hasn’t started yet.");
            return;
        }

        const startedAt = new Date().toISOString();
        const newResult: SubmitResult = {
            _id: result?._id || crypto.randomUUID(),
            participantId,
            participantEmail: result?.participantEmail || "",
            status: "in-progress",
            startedAt,
            endedAt: "",
            answers,
        };
        setResult(newResult);
        toast.success("Exam started");
    }

    async function handleSubmit(statusOverride?: SubmitResult["status"]) {
        if (!exam) return;
        if (!result) {
            toast.error("You need to start the exam first.");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email");
            toast.error("Enter a valid email to start");
            return;
        }
        setSubmitting(true);
        try {
            const endedAt = new Date().toISOString();
            const toSend = {
                _id: examId,
                participantId: participantId,
                startedAt: result.startedAt,
                endedAt,
                answers: answers,
                participantEmail: email,
                status:
                    statusOverride ||
                    (timing?.isTimed && timing?.inLateWindow ? "late" : timing?.isTimed && timing?.isExpired ? "expired" : "submitted"),
            };

            const res = await submitExamAnswers(toSend);
            if (isApiError(res)) {
                toast.error(res.message || "Submission failed");
            } else if (res.success) {
                setResult((r) => (r ? { ...r, status: toSend.status, endedAt, answers: toSend.answers } : r));
                toast.success("Submitted successfully");
                router.push('/');
            } else {
                toast.error("Unexpected submission response");
            }
        } catch {
            toast.error("Submission failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <ExamSkeleton />;
    }

    if (!exam) {
        return (
            <Card className="mx-auto mt-6 max-w-3xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <HiExclamationCircle className="h-5 w-5" />
                        Invalid or unavailable exam
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        We couldn&apos;t validate your exam link. Please check the URL or try again.
                    </p>
                    <div className="mt-4">
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const canAnswer = timing?.started && !(timing?.isTimed && timing?.isExpired);
    const canSubmit =
        timing?.started &&
        (timing?.unlimited || timing?.inMainTime || timing?.inLateWindow || !exam.autoSubmitOnEnd);

    return (
        <div className="mx-auto my-8 max-w-4xl space-y-8">
            <HeaderCard exam={exam} />

            {/* Start / Status */}
            <Card className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6 space-y-6">
                    {/* Email Input (always visible) */}
                    <div className="space-y-2">
                        {emailError ? <p className="text-xs text-red-600 mt-1">{emailError}</p>
                            : <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                        }

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={clsx(
                                "rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
                                emailError && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </div>

                    {/* Status & Start Button */}
                    {!timing?.started ? (
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">Status</p>
                                {timing?.beforeSchedule ? (
                                    <p className="text-sm text-gray-500">
                                        Exam scheduled. Starts in{" "}
                                        <span className="font-semibold text-indigo-600">
                                            {formatMs(timing.beforeStartCountdownMs)}
                                        </span>
                                        .
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500">Ready to start.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-3 animate-fadeIn">
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <HiCheckCircle className="h-4 w-4" /> Started
                            </Badge>
                            {timing.isTimed ? (
                                <Badge variant="outline" className="text-gray-600 border-gray-300">
                                    Unlimited time
                                </Badge>
                            ) : (
                                <>
                                    {timing.inMainTime && (
                                        <TimePill
                                            icon={<HiClock className="h-4 w-4" />}
                                            label="Time left"
                                            value={formatMs(timing.remainingMainMs || 0)}
                                        />
                                    )}
                                    {!timing.inMainTime && timing.inLateWindow && (
                                        <>
                                            <TimePill
                                                icon={<HiClock className="h-4 w-4" />}
                                                label="Late window"
                                                value={formatMs(timing.remainingLateMs || 0)}
                                            />
                                            <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                                                +{Math.round((timing.lateWindowMs || 0) / 60000)}m late window
                                            </Badge>
                                        </>
                                    )}
                                    {timing.isExpired && (
                                        <Badge className="bg-red-50 text-red-700 border border-red-200">
                                            Time finished
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {timing?.started ? (<>
                {/* Questions */}
                <Card className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-100 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {exam.questions.map((q, qi) => {
                            const selected =
                                answers.find((a) => a.questionIndex === qi)?.selectedChoiceIndex ?? -1;

                            return (
                                <div
                                    key={qi}
                                    className="rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                                >
                                    <div className="mb-3 space-y-2">
                                        {q.contents?.map((c, idx) =>
                                            c.type === "text" ? (
                                                <p
                                                    key={idx}
                                                    className="text-base leading-relaxed text-gray-700"
                                                >
                                                    {c.value}
                                                </p>
                                            ) : (
                                                <div
                                                    key={idx}
                                                    className="flex justify-center"
                                                >
                                                    <Image
                                                        height={180}
                                                        width={180}
                                                        src={c.value}
                                                        alt={`Question ${qi + 1} image ${idx + 1}`}
                                                        className="max-h-64 w-auto rounded-xl bg-gray-50 object-contain shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-indigo-300 transition-all duration-300"
                                                    />
                                                </div>
                                            )
                                        )}

                                    </div>

                                    <div className={clsx("grid gap-3", "sm:grid-cols-2")}>
                                        {q.choices.map((choice, ci) => {
                                            const id = `q${qi}-c${ci}`;
                                            const disabled = !canAnswer;

                                            return (
                                                <label
                                                    key={ci}
                                                    htmlFor={id}
                                                    className={clsx(
                                                        "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-gray-700 transition-all duration-300",
                                                        disabled
                                                            ? "opacity-60"
                                                            : "hover:bg-indigo-50 hover:border-indigo-200",
                                                        selected === ci
                                                            ? "ring-2 ring-indigo-400 bg-indigo-50"
                                                            : "ring-1 ring-transparent"
                                                    )}
                                                >
                                                    <input
                                                        id={id}
                                                        type="radio"
                                                        name={`q-${qi}`}
                                                        className="sr-only"
                                                        disabled={disabled}
                                                        checked={selected === ci}
                                                        onChange={() => setAnswer(qi, ci)}
                                                    />
                                                    <span className="text-sm">{choice.text}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <SubmitAlert canSubmit={canSubmit} submitting={submitting} handleSubmit={handleSubmit} />
                </div>
            </>) : (<Card>
                <CardContent className="text-center text-gray-500 py-8">
                    Exam hasn&apos;t started yet. Starts in{" "}
                    <span className="font-semibold text-indigo-600">
                        {formatMs(timing?.beforeStartCountdownMs || 0)}
                    </span>.
                </CardContent>
            </Card>)}
        </div>
    );
}