// src/types/types.events.ts
export interface VEvent {
  _id?: string;
  title: string;
  start: Date | string | null;
  end: Date | string | null;
  allDay: boolean;
  description?: string;
}

