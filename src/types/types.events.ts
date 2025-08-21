// src/types/types.events.ts

/** All possible states for an event */
export type EventStatus =
  | "upcoming"
  | "inProgress"
  | "expired"
  | "completed";

/** A single checklist item inside an event */
export interface VTask {
  /** MongoDB ObjectId as string */
  id: string;

  /** Task title */
  title: string;

  /** Optional task description */
  description?: string;

  /** Completion flag */
  isComplete: boolean;

  /** ISO timestamp of creation */
  createdAt: string;

  /** ISO timestamp of last update */
  updatedAt: string;
}

/** Main event shape sent to/received from your API */
export interface VEvent {
  /** MongoDB document ID (absent on brand-new events before save) */
  _id?: string;

  /** Owner’s userId (if you need it on the client) */
  userId?: string;

  /** Event title */
  title: string;

  /** Optional event description/body */
  description?: string;

  /** ISO string (or Date) marking the start */
  start: string | Date;

  /** Length in minutes */
  durationMinutes: number;

  /** Computed end = start + durationMinutes (provided by API) */
  end?: string | Date;

  /** All-day event flag */
  allDay: boolean;

  /** Embedded checklist items */
  tasks: VTask[];

  /** Persisted status (indexed on the server) */
  eventStatus: EventStatus;

  /** Real-time status (virtual getter on the server) */
  currentStatus: EventStatus;

  /** ISO timestamp of creation */
  createdAt: string;

  /** ISO timestamp of last update */
  updatedAt: string;
}

/** Subset of VEvent for overview cards or lightweight fetch */
export type VEventOverview = Pick<
  VEvent,
  "_id" | "title" | "start" | "description" | "durationMinutes" | "allDay"
>;