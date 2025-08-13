import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnswer {
    questionIndex: number; // index in the exam.questions array
    selectedChoiceIndex: number; // index in exam.questions[questionIndex].choices
    isCorrect?: boolean; // computed after grading
}

export interface IExamResult extends Document {
    exam: mongoose.Types.ObjectId; // Reference to Exam
    participantId: string;         // Provided ID (must match exam.validationRule)
    participantEmail: string;      // For result delivery
    startedAt: Date;                // UTC start time
    endedAt?: Date;                 // UTC end time (null until submitted)
    timeTakenSeconds?: number;      // Derived at submission
    score?: number;                 // Derived after grading
    totalQuestions: number;         // Snapshot at attempt time
    answers: IAnswer[];             // Participant's submitted answers
    status: "in-progress" | "submitted" | "late" | "expired";
    createdAt: Date;
    updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
    {
        questionIndex: { type: Number, required: true },
        selectedChoiceIndex: { type: Number, required: true },
        isCorrect: { type: Boolean },
    },
    { _id: false }
);

const ExamResultSchema = new Schema<IExamResult>(
    {
        exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
        participantId: { type: String, required: true },
        participantEmail: { type: String, required: true },
        startedAt: { type: Date, required: true, default: Date.now },
        endedAt: { type: Date },
        timeTakenSeconds: { type: Number },
        score: { type: Number },
        totalQuestions: { type: Number, required: true },
        answers: { type: [AnswerSchema], default: [] },
        status: {
            type: String,
            enum: ["in-progress", "submitted", "late", "expired"],
            default: "in-progress",
        },
    },
    { timestamps: true }
);

/* ----- Hooks ----- */
ExamResultSchema.pre<IExamResult>("save", function (next) {
    // Calculate time taken when endedAt is set
    if (this.endedAt && this.startedAt) {
        this.timeTakenSeconds = Math.floor(
            (this.endedAt.getTime() - this.startedAt.getTime()) / 1000
        );
    }
    next();
});

/* ----- Model Export ----- */
const ExamResultModel: Model<IExamResult> =
    mongoose.models.ExamResult || mongoose.model<IExamResult>("ExamResult", ExamResultSchema);

export default ExamResultModel;
