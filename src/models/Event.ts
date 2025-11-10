import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * ITask
 * Represents a checklist item embedded in an Event.
 */
export interface ITask extends Document {
  title: string;
  description?: string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * IEvent
 * Represents a time-bound event with tasks.
 * `end` is not stored — it is always derived from `start + durationMinutes`.
 */
export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  start: Date;
  durationMinutes: number;
  allDay: boolean;
  tasks: Types.DocumentArray<ITask>;
  eventStatus: "upcoming" | "inProgress" | "expired" | "completed";
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  end: Date;
  currentStatus: "upcoming" | "inProgress" | "expired" | "completed";
}

/* ───────────────────────────────────────────────────────────────────────────
   TASK SUB-SCHEMA
   Embedded inside Event. Each task has its own ObjectId, timestamps, and index
   for efficient querying by completion status.
──────────────────────────────────────────────────────────────────────────── */
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
      index: true, // query tasks by completion
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    _id: true,        // each task has its own ObjectId
  }
);

/* ───────────────────────────────────────────────────────────────────────────
   EVENT SCHEMA
   - Stores `start` and `durationMinutes` only
   - `end` is a virtual field: start + durationMinutes
   - Tracks `eventStatus` (persisted for quick queries, recalculated on save)
   - Embeds an array of Task documents
──────────────────────────────────────────────────────────────────────────── */
const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // filter events by owner
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    start: {
      type: Date,
      required: true,
      set: (val: string | Date) => new Date(val),
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: 1,
    },

    allDay: {
      type: Boolean,
      default: false,
    },

    tasks: {
      type: [taskSchema],
      default: [], // at least one task is recommended
      validate: {
        validator: (arr: ITask[]) => arr.length > 0,
        message: "An event should have at least one task",
      },
    },

    eventStatus: {
      type: String,
      enum: ["upcoming", "inProgress", "expired", "completed"],
      default: "upcoming",
      index: true, // filter by status efficiently
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* ───────────────────────────────────────────────────────────────────────────
   INDEXES
   - Optimized for querying events by start time and status
──────────────────────────────────────────────────────────────────────────── */
eventSchema.index({ start: 1 });

/* ───────────────────────────────────────────────────────────────────────────
   VIRTUAL: `end`
   Dynamically computed as start + durationMinutes
   (never persisted to MongoDB)
──────────────────────────────────────────────────────────────────────────── */
eventSchema.virtual("end").get(function (this: IEvent) {
  const startMs = this.start.getTime();
  const durMs = this.durationMinutes * 60_000;
  return new Date(startMs + durMs);
});

/* ───────────────────────────────────────────────────────────────────────────
   PRE-SAVE: Auto-update persisted `eventStatus` before saving
──────────────────────────────────────────────────────────────────────────── */
eventSchema.pre("save", function (next) {
  const now = Date.now();
  const end = new Date(this.start.getTime() + this.durationMinutes * 60_000);
  const allDone = this.tasks.every((t) => t.isComplete);

  if (allDone) {
    this.eventStatus = "completed";
  } else if (now < this.start.getTime()) {
    this.eventStatus = "upcoming";
  } else if (now >= this.start.getTime() && now < end.getTime()) {
    this.eventStatus = "inProgress";
  } else {
    this.eventStatus = "expired";
  }

  next();
});

/* ───────────────────────────────────────────────────────────────────────────
   VIRTUAL: `currentStatus`
   Always accurate on reads (independent of saved `eventStatus`)
──────────────────────────────────────────────────────────────────────────── */
eventSchema.virtual("currentStatus").get(function (this: IEvent) {
  const now = Date.now();
  const end = new Date(this.start.getTime() + this.durationMinutes * 60_000);
  const allDone = this.tasks.every((t) => t.isComplete);

  if (allDone) return "completed";
  if (now < this.start.getTime()) return "upcoming";
  if (now >= this.start.getTime() && now < end.getTime()) return "inProgress";
  return "expired";
});

// Ensure virtuals are included when converting to JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

/* ───────────────────────────────────────────────────────────────────────────
   EXPORT
──────────────────────────────────────────────────────────────────────────── */
export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
