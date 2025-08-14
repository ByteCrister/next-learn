// src/types/types.events.ts

export interface VEvent {
  /** MongoDB document ID (optional on new events) */
  _id?: string;

  /** Event title */
  title: string;

  /** ISO date‐time string (or Date) for the start */
  start: string | Date;

  /**
   * Length of the event in minutes.
   * We no longer store `end` in the DB — it’s computed as start + durationMinutes.
   */
  durationMinutes: number;

  /**
   * Computed end time (added by our API transform).
   * It’s optional because on the client you may construct a new event
   * before the server returns a generated end.
   */
  end?: string | Date;

  /** All‐day event flag */
  allDay: boolean;

  /** Optional description/body */
  description?: string;
}
