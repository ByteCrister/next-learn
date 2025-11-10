"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiClock,
    FiShield,
    FiRefreshCw,
    FiInfo,
} from "react-icons/fi";

import crypto from "crypto-js";
import { decodeId } from "@/utils/helpers/IdConversion";
import api from "@/utils/api/api.client";

import { CanonicalParams, ViewResultResponseDTO } from "@/types/types.view.result";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { toast } from "react-toastify";

interface PageProps {
    params: {
        email: string;
        createdBy: string;
        examId: string;
        participantId: string;
        examCode: string;
    };
}

type StatusView =
    | "loading"
    | "ready"
    | "error"
    | "locked"; // NOT_YET_AVAILABLE

export default function ViewResult({ params }: PageProps) {
    const [data, setData] = useState<ViewResultResponseDTO | null>(null);
    const [view, setView] = useState<StatusView>("loading");
    const [err, setErr] = useState<string | null>(null);
    const [unlockAt, setUnlockAt] = useState<number | null>(null); // ms timestamp

    const decoded = useMemo(() => {
        try {
            return {
                email: params.email,
                createdBy: decodeId(decodeURIComponent(params.createdBy)),
                examId: decodeId(decodeURIComponent(params.examId)),
                participantId: decodeId(decodeURIComponent(params.participantId)),
                examCode: decodeId(decodeURIComponent(params.examCode)),
            };
        } catch {
            return null;
        }
    }, [params]);

    useEffect(() => {
        async function fetchResult() {
            if (!decoded) {
                setErr("Invalid link parameters.");
                setView("error");
                return;
            }

            setView("loading");
            setErr(null);

            try {
                const ts = `${Date.now()}`;
                const nonce = crypto.lib.WordArray.random(16).toString();

                const qp: Omit<CanonicalParams, "sig"> = {
                    email: params.email,          // keep obfuscated segment
                    createdBy: params.createdBy,  // keep obfuscated segment
                    examId: params.examId,        // keep obfuscated segment
                    participantId: params.participantId, // keep obfuscated segment
                    examCode: params.examCode,    // keep obfuscated segment
                    ts,
                    nonce,
                };

                const canonical = (Object.keys(qp) as (keyof typeof qp)[])
                    .sort()
                    .map((k) => `${k}=${encodeURIComponent(qp[k])}`)
                    .join("&");

                const secret = process.env.NEXT_PUBLIC_RESULT_LINK_SIGNING_SECRET ?? "dev-secret";
                const sig = crypto.HmacSHA256(canonical, secret).toString();

                const res = await api.get<ViewResultResponseDTO>("/results/view-result", {
                    params: { ...qp, sig },
                });

                const payload = res.data;
                setData(payload);

                if (!payload.ok) {
                    setErr(payload.message ?? "Failed to load result.");
                    // Interpret NOT_YET_AVAILABLE into a locked state with countdown
                    if (payload.errorCode === "NOT_YET_AVAILABLE" && payload.exam?.isTimed && payload.exam?.scheduledStartAt && payload.exam?.durationMinutes != null) {
                        const scheduledStartMs = new Date(payload.exam.scheduledStartAt!).getTime();
                        const endMs = scheduledStartMs + (payload.exam.durationMinutes! * 60 * 1000);
                        const lateMs = (payload.exam.allowLateSubmissions ? payload.exam.lateWindowMinutes ?? 0 : 0) * 60 * 1000;
                        // If your API enforces “view only after end and within late window”,
                        // unlockAt is `endMs` (first moment of availability).
                        setUnlockAt(endMs + lateMs);
                        setView("locked");
                    } else {
                        setView("error");
                    }
                } else {
                    setView("ready");
                }
            } catch (e: unknown) {
                let msg = "Network error.";
                if (axios.isAxiosError(e)) {
                    msg = e.response?.data?.message ?? e.message ?? msg;
                } else if (e instanceof Error) {
                    msg = e.message;
                }
                setErr(msg);
                setView("error");
                toast.error(msg);
            }
        }

        fetchResult();
    }, [decoded, params.createdBy, params.email, params.examCode, params.examId, params.participantId]);

    // Countdown for locked state
    const [nowMs, setNowMs] = useState<number>(Date.now());
    useEffect(() => {
        if (view !== "locked" || !unlockAt) return;
        const id = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(id);
    }, [view, unlockAt]);

    const remainingMs = unlockAt ? Math.max(0, unlockAt - nowMs) : 0;
    const remainingMin = Math.floor(remainingMs / 60000);
    const remainingSec = Math.floor((remainingMs % 60000) / 1000);

    // ---------- UI STATES ----------

    if (view === "loading") {
        return (
            <PageShell>
                <LoadingCard />
            </PageShell>
        );
    }

    if (view === "locked") {
        return (
            <PageShell gradientTitle="Results unlock after exam ends">
                <LockedCard remainingMin={remainingMin} remainingSec={remainingSec} onRetry={() => location.reload()} />
            </PageShell>
        );
    }

    if (view === "error" || !data || !data.ok || !data.result || !data.exam) {
        return (
            <PageShell gradientTitle="Unable to load result">
                <ErrorCard message={err ?? data?.message ?? "Unknown error."} onRetry={() => location.reload()} />
            </PageShell>
        );
    }

    const { exam, result } = data;

    // Compute simple stats
    const correctCount = result.answers.filter(a => a.isCorrect === true).length;
    const scorePercent = result.totalQuestions > 0 ? Math.round((correctCount / result.totalQuestions) * 100) : 0;

    return (
        <PageShell gradientTitle={exam.title} subtitle={`${exam.subjectCode} • ${exam.examCode}`}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <Card className="border-none shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-xl">{exam.title}</CardTitle>
                                {exam.description && (
                                    <CardDescription className="mt-1">{exam.description}</CardDescription>
                                )}
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="gap-1">
                                            <FiShield /> Verified link
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>HMAC-signed request with timestamp and nonce.</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Top stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard
                                icon={<FiClock />}
                                label="Started"
                                value={new Date(result.startedAt).toLocaleString()}
                            />
                            <StatCard
                                icon={<FiClock />}
                                label="Ended"
                                value={result.endedAt ? new Date(result.endedAt).toLocaleString() : "—"}
                            />
                            <StatCard
                                icon={<FiCheckCircle />}
                                label="Time taken"
                                value={typeof result.timeTakenSeconds === "number" ? `${Math.round(result.timeTakenSeconds / 60)} min` : "—"}
                            />
                        </div>

                        <Separator />

                        {/* Score & progress */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{result.status}</Badge>
                                        <Badge variant="outline">Questions: {result.totalQuestions}</Badge>
                                    </div>
                                    <Badge variant="default">Score: {correctCount}/{result.totalQuestions}</Badge>
                                </div>
                                <Progress value={scorePercent} />
                                <p className="text-sm text-muted-foreground">Accuracy: {scorePercent}%</p>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm">
                                    <p><span className="font-medium">Participant:</span> {result.participantEmail} ({result.participantId})</p>
                                    <p className="mt-1"><span className="font-medium">Exam:</span> {exam.subjectCode} · {exam.examCode}</p>
                                    {exam.isTimed && exam.scheduledStartAt && exam.durationMinutes && (
                                        <p className="mt-1 text-muted-foreground">
                                            Timed: {exam.durationMinutes} min, starts {new Date(exam.scheduledStartAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Tabs for answers and info */}
                        <Tabs defaultValue="answers" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="answers">Answers</TabsTrigger>
                                <TabsTrigger value="info">Info</TabsTrigger>
                            </TabsList>

                            <TabsContent value="answers" className="space-y-3 mt-4">
                                {result.answers.length === 0 ? (
                                    <Alert>
                                        <FiInfo className="h-4 w-4" />
                                        <AlertTitle>No answers</AlertTitle>
                                        <AlertDescription>
                                            Your submission doesn’t include answers. If this seems wrong, contact the exam organizer.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-2">
                                        {result.answers.map((ans, idx) => (
                                            <motion.div
                                                key={`${ans.questionIndex}-${idx}`}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="rounded-lg border bg-white/60 dark:bg-neutral-900/50 p-3 flex items-center justify-between"
                                            >
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Q{ans.questionIndex + 1}:</span> Choice #{ans.selectedChoiceIndex + 1}</p>
                                                </div>
                                                {typeof ans.isCorrect === "boolean" && (
                                                    <Badge variant={ans.isCorrect ? "default" : "destructive"}>
                                                        {ans.isCorrect ? "Correct" : "Incorrect"}
                                                    </Badge>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="info" className="space-y-3 mt-4">
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>This result page is secured with signed queries and strict timing rules. It’s accessible only after the exam finishes.</p>
                                    <p>If you believe anything is incorrect, contact the organizer with your participant ID and exam code.</p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Separator />

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <Button variant="outline" onClick={() => location.reload()}>
                                <FiRefreshCw className="mr-2" /> Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </PageShell>
    );
}

/* -------------------------
   Layout & UI subcomponents
--------------------------*/

function PageShell({
    children,
    gradientTitle,
    subtitle,
}: {
    children: React.ReactNode;
    gradientTitle?: string;
    subtitle?: string;
}) {
    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Header gradientTitle={gradientTitle} subtitle={subtitle} />
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

function Header({ gradientTitle, subtitle }: { gradientTitle?: string; subtitle?: string }) {
    return (
        <div className="mb-2">
            {gradientTitle && (
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    {gradientTitle}
                </h1>
            )}
            {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
        </div>
    );
}

function LoadingCard() {
    return (
        <Card className="border-none shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50">
            <CardHeader>
                <CardTitle>Loading result…</CardTitle>
                <CardDescription>Verifying link and fetching your result securely.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <Card className="border-none shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50">
            <CardHeader className="flex items-center gap-2">
                <FiAlertTriangle className="text-amber-500" size={20} />
                <div>
                    <CardTitle>Unable to load result</CardTitle>
                    <CardDescription className="mt-1">{message}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Separator className="my-4" />
                <div className="flex justify-end">
                    <Button variant="outline" onClick={onRetry}>
                        <FiRefreshCw className="mr-2" /> Retry
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function LockedCard({
    remainingMin,
    remainingSec,
    onRetry,
}: {
    remainingMin: number;
    remainingSec: number;
    onRetry: () => void;
}) {
    const totalSec = Math.max(0, remainingMin * 60 + remainingSec);
    const pct = Math.min(100, Math.max(0, 100 - (totalSec / (60 * 60)) * 100)); // naive progress

    return (
        <Card className="border-none shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50">
            <CardHeader className="flex items-center gap-2">
                <FiClock className="text-indigo-600" size={20} />
                <div>
                    <CardTitle>Results will unlock soon</CardTitle>
                    <CardDescription className="mt-1">
                        The exam is still running. Please check back after it ends.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm">
                    <p className="font-medium">Time remaining:</p>
                    <p className="text-muted-foreground">{remainingMin}m {remainingSec}s</p>
                </div>
                <Progress value={pct} />
                <Separator className="my-4" />
                <div className="flex justify-end">
                    <Button variant="outline" onClick={onRetry}>
                        <FiRefreshCw className="mr-2" /> Refresh
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border bg-white/60 dark:bg-neutral-900/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-indigo-600">{icon}</span>
                <span>{label}</span>
            </div>
            <p className="mt-2 text-base font-medium">{value}</p>
        </div>
    );
}
