import { Schema, model, models, Document, Types } from 'mongoose';
import { customAlphabet } from 'nanoid';

// NanoID generator (shorter, URL-safe, unique)
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

interface Slot {
    /** Class start time in HH:MM format */
    startTime: string;

    /** Class end time in HH:MM format */
    endTime: string;

    /** Name of the subject (stored directly for fast reads) */
    subject: string;

    /** Name of the teacher (optional; stored directly) */
    teacher?: string;

    /** Room or location identifier (optional) */
    room?: string;
}

interface DayRoutine {
    /** 0 = Sunday, …, 6 = Saturday */
    dayOfWeek: number;

    /** All time slots for this weekday */
    slots: Slot[];
}

export interface IRoutine extends Document {
    /** Owner of this routine */
    userId: Types.ObjectId;

    /** Title, for example "Fall 2025 – CSE Dept" */
    title: string;

    /** Optional description or notes */
    description?: string;

    /** Array of routines broken down by weekday */
    days: DayRoutine[];

    shareId: string;

    /** Auto-managed creation timestamp */
    createdAt: Date;

    /** Auto-managed update timestamp */
    updatedAt: Date;
}

const SlotSchema = new Schema<Slot>({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String },
    room: { type: String },
});

const DayRoutineSchema = new Schema<DayRoutine>({
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: { type: [SlotSchema], default: [] },
});

const RoutineSchema = new Schema<IRoutine>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true },
        description: { type: String },
        shareId: {
            type: String,
            unique: true,
            index: true,
            default: () => nanoid(), // auto-generate on creation
        },
        days: { type: [DayRoutineSchema], validate: (v: unknown) => Array.isArray(v) },
    },
    { timestamps: true }  // adds createdAt and updatedAt
);

export default models.Routine || model<IRoutine>('Routine', RoutineSchema);
