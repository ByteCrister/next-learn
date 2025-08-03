import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IRoutineSlot {
    time: string; // "10:00 AM - 11:00 AM"
    subject: string;
}

export interface IRoutineEntry {
    day: string; // e.g. "Monday"
    slots: IRoutineSlot[];
}

export interface IRoutine extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    entries: IRoutineEntry[];
    createdAt: Date;
    updatedAt: Date;
}

const routineSlotSchema = new Schema<IRoutineSlot>(
    {
        time: { type: String, required: true },
        subject: { type: String, required: true },
    },
    { _id: false }
);

const routineEntrySchema = new Schema<IRoutineEntry>(
    {
        day: { type: String, required: true },
        slots: { type: [routineSlotSchema], default: [] },
    },
    { _id: false }
);

const routineSchema = new Schema<IRoutine>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        entries: { type: [routineEntrySchema], default: [] },
    },
    { timestamps: true }
);

export const Routine: Model<IRoutine> =
    mongoose.models.Routine || mongoose.model<IRoutine>("Routine", routineSchema);
