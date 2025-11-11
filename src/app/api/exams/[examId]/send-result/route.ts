import ConnectDB from "@/config/ConnectDB";
import { SendEmail } from "@/config/NodeEmailer";
import ExamModel from "@/models/ExamModel";
import ExamResultModel, { IAnswer } from "@/models/ExamResultModel";
import { getUserIdFromSession } from "@/utils/helpers/session";
import { buildResultHtml } from "@/utils/html/html.send-result";
import { NextRequest, NextResponse } from "next/server";

type ContextType = {
    params: {
        examId: string;
    };
};

type ParticipantRequest = {
    participants?: string[];
};

export async function PUT(req: NextRequest, context: unknown) {
    try {
        const { examId } = (context as ContextType).params ?? {};
        const decodedExamId = decodeURIComponent(examId);
        if (!decodedExamId) {
            return NextResponse.json(
                { error: "Missing examId in URL" },
                { status: 400 }
            );
        }

        // parse body
        let body: ParticipantRequest;
        try {
            body = (await req.json()) as ParticipantRequest;
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const participants = Array.isArray(body?.participants)
            ? body!.participants
            : [];
        if (participants.length === 0) {
            return NextResponse.json(
                { error: "No participants provided" },
                { status: 400 }
            );
        }

        await ConnectDB();

        // Authenticate and authorize
        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        // Load exam (document, not lean, so we can check createdBy)
        const exam = await ExamModel.findById(decodedExamId);
        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        const examOwnerId = exam.createdBy?.toString?.() ?? String(exam.createdBy);
        if (examOwnerId !== userId) {
            return NextResponse.json(
                { error: "Forbidden: not the exam owner" },
                { status: 403 }
            );
        }

        if (!Array.isArray(exam.questions) || exam.questions.length === 0) {
            return NextResponse.json(
                { error: "Exam has no questions to grade" },
                { status: 422 }
            );
        }

        // Process participants sequentially and collect results
        const results: {
            participantId: string;
            status: "ok" | "error";
            message?: string;
            score?: number;
            totalQuestions?: number;
            percent?: number;
            resultSentAt?: Date | null;
        }[] = [];

        for (const participantId of participants) {
            try {
                const examResult = await ExamResultModel.findOne({
                    exam: exam._id,
                    participantId,
                });
                if (!examResult) {
                    results.push({
                        participantId,
                        status: "error",
                        message: "ExamResult not found for participant",
                    });
                    continue;
                }

                const participantEmail = examResult.participantEmail;
                if (!participantEmail) {
                    results.push({
                        participantId,
                        status: "error",
                        message: "Participant email missing on ExamResult",
                    });
                    continue;
                }

                // compute score and summary
                let score = 0;
                const totalQuestions =
                    examResult.totalQuestions ?? exam.questions.length;
                const answersSummary: {
                    index: number;
                    selectedIndex?: number;
                    selectedText?: string;
                    correctIndex?: number;
                    correctText?: string;
                    isCorrect?: boolean;
                }[] = [];

                for (const ans of (examResult.answers || []) as IAnswer[]) {
                    const qIndex = ans.questionIndex;
                    const selectedIdx =
                        typeof ans.selectedChoiceIndex === "number"
                            ? ans.selectedChoiceIndex
                            : undefined;
                    const q = exam.questions[qIndex];
                    const correctIdx = q
                        ? q.choices.findIndex((c) => Boolean(c.isCorrect))
                        : -1;
                    const isCorrect = correctIdx >= 0 && selectedIdx === correctIdx;

                    if (isCorrect) score += 1;

                    answersSummary.push({
                        index: qIndex,
                        selectedIndex: selectedIdx,
                        selectedText:
                            q && typeof selectedIdx === "number"
                                ? q.choices[selectedIdx]?.text ?? "—"
                                : "—",
                        correctIndex: correctIdx >= 0 ? correctIdx : undefined,
                        correctText:
                            q && correctIdx >= 0
                                ? q.choices[correctIdx]?.text ?? "—"
                                : undefined,
                        isCorrect,
                    });
                }

                const resolvedTotal =
                    totalQuestions > 0 ? totalQuestions : exam.questions.length;
                const percent = resolvedTotal > 0 ? (score / resolvedTotal) * 100 : 0
                
                examResult.isResultSent = true;
                examResult.resultSentAt = new Date();

                // Save
                await examResult.save();

                // Build and send email
                const html = buildResultHtml({
                    examTitle: exam.title || `${exam.subjectCode} ${exam.examCode || ""}`,
                    participantId: examResult.participantId,
                    participantEmail,
                    score,
                    totalQuestions: resolvedTotal,
                    percent,
                    timeTakenSeconds: examResult.timeTakenSeconds,
                    // map answersSummary to the lighter shape the HTML builder will expect, but keep both text + indices
                    answersSummary: answersSummary.map((a) => ({
                        index: a.index,
                        selected: a.selectedIndex ?? -1, // keep number
                        selectedText: a.selectedText,
                        correctIndex: a.correctIndex,
                        correctText: a.correctText,
                        isCorrect: a.isCorrect,
                    })),
                    sentAt: examResult.resultSentAt!,
                });

                await SendEmail(
                    participantEmail,
                    `Your result for "${exam.title}"`,
                    html
                );

                results.push({
                    participantId,
                    status: "ok",
                    score,
                    totalQuestions: resolvedTotal,
                    percent: Number(percent.toFixed(2)),
                    resultSentAt: examResult.resultSentAt ?? null,
                });
            } catch (pErr: unknown) {
                const msg = pErr instanceof Error ? pErr.message : String(pErr);
                results.push({ participantId, status: "error", message: msg });
            }
        }

        return NextResponse.json(
            { message: "Processed participants", results },
            { status: 200 }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
