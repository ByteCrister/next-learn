import mongoose, { Schema, Document, Model } from "mongoose";

/* ---------- Sub-interfaces ---------- */
export interface IExamValidationRule {
    startsWith?: string[]; // e.g., ["065","000","011"]
    maxLength?: number; // e.g., 10
    minLength?: number;
}

interface IChoice {
    text: string;
    isCorrect?: boolean; // stored for grading, NOT exposed to takers
}

interface IQuestionContent {
    type: "text" | "image";
    value: string; // text content or image URL
}

interface IQuestion {
    contents?: IQuestionContent[];
    choices: IChoice[];
}

/* ---------- Main Exam interface ---------- */
export interface IExam extends Document {
    title: string;
    description?: string;
    subjectCode: string;
    examCode: string;
    validationRule: IExamValidationRule;
    createdBy: mongoose.Types.ObjectId;
    questions: IQuestion[];

    // Timing fields
    isTimed?: boolean;              // if true, exam enforces timing
    durationMinutes?: number;       // exam total duration in minutes
    scheduledStartAt?: Date | null; // UTC start time (optional)
    allowLateSubmissions?: boolean;
    lateWindowMinutes?: number;     // minutes allowed after scheduledEndAt
    autoSubmitOnEnd?: boolean;      // auto-submit when time is up

    createdAt: Date;
    updatedAt: Date;
}

/* ---------- Schemas ---------- */
const ValidationRuleSchema = new Schema<IExamValidationRule>(
    {
        startsWith: [{ type: String }],
        maxLength: { type: Number },
        minLength: { type: Number },
    },
    { _id: false }
);

const ChoiceSchema = new Schema<IChoice>(
    {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
    },
    { _id: false }
);

const QuestionContentSchema = new Schema<IQuestionContent>(
    {
        type: { type: String, enum: ["text", "image"], required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
    {
        contents: {
            type: [QuestionContentSchema],
            validate: {
                validator: (contents: IQuestionContent[]) => contents && contents.length > 0,
                message: "Question must have at least one text or image content.",
            },
        },
        choices: {
            type: [ChoiceSchema],
            validate: {
                validator: (choices: IChoice[]) => choices && choices.length >= 2,
                message: "Each question must have at least two choices.",
            },
        },
    },
    { _id: false }
);

const ExamSchema = new Schema<IExam>(
    {
        title: { type: String, required: true },
        description: { type: String },
        subjectCode: { type: String, required: true },
        examCode: { type: String, unique: true, required: true },
        validationRule: { type: ValidationRuleSchema, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        questions: { type: [QuestionSchema], default: [] },

        // Timing
        isTimed: { type: Boolean, default: false },
        durationMinutes: { type: Number, min: 1 },
        scheduledStartAt: { type: Date },
        allowLateSubmissions: { type: Boolean, default: false },
        lateWindowMinutes: { type: Number, default: 0, min: 0 },
        autoSubmitOnEnd: { type: Boolean, default: true },
    },
    { timestamps: true }
);

/* ---------- Hooks & Validations ---------- */
ExamSchema.pre<IExam>("validate", function (next) {
    if (!this.examCode) {
        this.examCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    if (this.isTimed) {
        if (!this.durationMinutes || this.durationMinutes <= 0) {
            return next(new Error("Timed exam must have a positive durationMinutes."));
        }

        if (!this.scheduledStartAt) {
            return next(new Error("Timed exam must have a scheduledStartAt."));
        }

    } else {
        // Not timed → clear all timing fields
        this.durationMinutes = undefined;
        this.scheduledStartAt = undefined;
        this.allowLateSubmissions = false;
        this.lateWindowMinutes = 0;
    }

    // Late window consistency
    if (!this.allowLateSubmissions) {
        this.lateWindowMinutes = 0;
    } else if (this.lateWindowMinutes == null) {
        this.lateWindowMinutes = 0;
    }

    next();
});


/* ---------- Export Model ---------- */
const ExamModel: Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
export default ExamModel;
