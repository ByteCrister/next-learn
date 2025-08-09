import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" }, // Optional, better to set default empty string
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export the model properly; avoid redeclaring Model type
export const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
