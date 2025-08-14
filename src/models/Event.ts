import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  start: Date;              // stored as Date
  durationMinutes: number;  // length of event
  allDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    start: {
      type: Date,
      required: true,
      set: (val: string | Date) => new Date(val),
    },
    durationMinutes: {
      type: Number,
      default: 60,   // default to 60 minutes (1 hour)
      min: 1,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const Event =
  mongoose.models.Event ||
  mongoose.model<IEvent>("Event", eventSchema);
