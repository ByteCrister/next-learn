// /api/results/view-result/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { decodeId } from "@/utils/helpers/IdConversion";
import { isFresh, verifyHmacSig } from "@/utils/helpers/signature";
import { validateParticipantId } from "@/utils/helpers/participantId";

import ExamModel from "@/models/ExamModel";
import ExamResultModel from "@/models/ExamResultModel";

import {
  CanonicalParamsSchema,
  ViewResultResponseDTO,
} from "@/types/types.view.result";

const SIGNING_SECRET = process.env.RESULT_LINK_SIGNING_SECRET ?? "dev-secret";

function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(req: NextRequest) {
  try {
    // --- 1. Parse & validate query params ---
    const url = new URL(req.url);
    const qp = Object.fromEntries(url.searchParams.entries());
    const parsed = CanonicalParamsSchema.safeParse(qp);

    if (!parsed.success) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "BAD_QUERY",
          message: "Invalid or missing query parameters.",
        },
        400
      );
    }

    const {
      email,
      createdBy,
      examId,
      participantId,
      examCode,
      ts,
      nonce,
      sig,
    } = parsed.data;

    // --- 2. Verify freshness & signature ---
    const tsNum = Number(ts);
    if (!isFresh(tsNum)) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "STALE_REQUEST",
          message: "Request timestamp is outside allowed window.",
        },
        401
      );
    }

    const sigOk = verifyHmacSig(
      { email, createdBy, examId, participantId, examCode, ts, nonce },
      sig,
      SIGNING_SECRET
    );
    if (!sigOk) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "BAD_SIGNATURE",
          message: "Signature verification failed.",
        },
        401
      );
    }

    // --- 3. Decode obfuscated IDs ---
    let decoded;
    try {
      decoded = {
        email: decodeId(decodeURIComponent(email)),
        createdBy: decodeId(decodeURIComponent(createdBy)),
        examId: decodeId(decodeURIComponent(examId)),
        participantId: decodeId(decodeURIComponent(participantId)),
        examCode: decodeId(decodeURIComponent(examCode)),
      };
    } catch {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "DECODE_ERROR",
          message: "Failed to decode parameters.",
        },
        400
      );
    }

    // --- 4. Validate ObjectIds ---
    if (
      !mongoose.Types.ObjectId.isValid(decoded.examId) ||
      !mongoose.Types.ObjectId.isValid(decoded.createdBy)
    ) {
      return json<ViewResultResponseDTO>(
        { ok: false, errorCode: "BAD_ID", message: "Invalid ObjectId format." },
        400
      );
    }

    // --- 5. Ensure DB connection ---
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // --- 6. Load exam ---
    const exam = await ExamModel.findById(decoded.examId).lean();
    if (!exam) {
      return json<ViewResultResponseDTO>(
        { ok: false, errorCode: "EXAM_NOT_FOUND", message: "Exam not found." },
        404
      );
    }

    // Creator & examCode binding
    if (String(exam.createdBy) !== decoded.createdBy) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "CREATOR_MISMATCH",
          message: "Creator mismatch.",
        },
        403
      );
    }
    if (exam.examCode !== decoded.examCode) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "EXAM_CODE_MISMATCH",
          message: "Exam code mismatch.",
        },
        403
      );
    }

    // --- 7. Load result ---
    const result = await ExamResultModel.findOne({
      exam: exam._id,
      participantId: decoded.participantId,
    }).lean();

    if (!result) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "RESULT_NOT_FOUND",
          message: "Result not found.",
        },
        404
      );
    }

    // Email binding
    if (result.participantEmail !== decoded.email) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "EMAIL_MISMATCH",
          message: "Email does not match the result.",
        },
        403
      );
    }

    // Participant ID validation
    if (!validateParticipantId(decoded.participantId, exam.validationRule)) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "PARTICIPANT_RULE_FAIL",
          message: "Participant ID fails exam validation rules.",
        },
        403
      );
    }

    // --- 8. Enforce exam timing rules ---
    const now = Date.now();
    const scheduledStart = exam.scheduledStartAt
      ? new Date(exam.scheduledStartAt).getTime()
      : null;
    const durationMs = (exam.durationMinutes ?? 0) * 60 * 1000;
    const lateMs =
      (exam.allowLateSubmissions ? exam.lateWindowMinutes ?? 0 : 0) * 60 * 1000;

    let viewingAllowed = false;

    if (exam.isTimed && scheduledStart && durationMs > 0) {
      const endAt = scheduledStart + durationMs;
      const viewAt = endAt + lateMs;

      // ✅ Only allow after exam ends, and expire after late window
      viewingAllowed = now >= endAt && now <= viewAt;
    } else {
      // Non‑timed exams: only if participant has submitted
      viewingAllowed = Boolean(result.endedAt);
    }

    if (!viewingAllowed) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "NOT_YET_AVAILABLE",
          message: "Result not yet available.",
        },
        403
      );
    }

    // --- 9. Status constraints ---
    if (!["submitted", "late"].includes(result.status)) {
      return json<ViewResultResponseDTO>(
        {
          ok: false,
          errorCode: "INVALID_STATUS",
          message: `Result status '${result.status}' is not viewable.`,
        },
        403
      );
    }

    // --- 10. Build DTOs ---
    const examDTO = {
      title: exam.title,
      description: exam.description,
      subjectCode: exam.subjectCode,
      examCode: exam.examCode,
      isTimed: Boolean(exam.isTimed),
      durationMinutes: exam.durationMinutes,
      scheduledStartAt: exam.scheduledStartAt
        ? new Date(exam.scheduledStartAt).toISOString()
        : undefined,
      allowLateSubmissions: Boolean(exam.allowLateSubmissions),
      lateWindowMinutes: exam.lateWindowMinutes ?? 0,
      totalQuestions: result.totalQuestions,
    };

    const resultDTO = {
      participantEmail: result.participantEmail,
      participantId: result.participantId,
      startedAt: new Date(result.startedAt).toISOString(),
      endedAt: result.endedAt
        ? new Date(result.endedAt).toISOString()
        : undefined,
      timeTakenSeconds: result.timeTakenSeconds,
      score: result.score,
      status: result.status,
      totalQuestions: result.totalQuestions,
      answers: result.answers.map((a) => ({
        questionIndex: a.questionIndex,
        selectedChoiceIndex: a.selectedChoiceIndex,
        isCorrect: a.isCorrect,
      })),
    };

    return json<ViewResultResponseDTO>(
      { ok: true, exam: examDTO, result: resultDTO },
      200
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[view-result] error:", message);

    return json<ViewResultResponseDTO>(
      {
        ok: false,
        errorCode: "SERVER_ERROR",
        message: "Unexpected server error.",
      },
      500
    );
  }
}
