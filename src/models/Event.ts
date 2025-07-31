// /models/Event.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEvent extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    roadmapId?: Types.ObjectId;
    allDay: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        roadmapId: { type: Schema.Types.ObjectId, ref: "CourseRoadmap" },
        allDay: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
