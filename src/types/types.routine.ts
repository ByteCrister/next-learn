/** Single time slot in a day, used in both requests and responses */
export interface SlotDto {
    /** Class start time in "HH:MM" format */
    startTime: string;

    /** Class end time in "HH:MM" format */
    endTime: string;

    /** Subject name */
    subject: string;

    /** Teacher name (optional) */
    teacher?: string;

    /** Room or location (optional) */
    room?: string;
}

/** Collection of slots for one weekday */
export interface DayRoutineDto {
    /** 0 = Sunday … 6 = Saturday */
    dayOfWeek: number;

    /** All slots scheduled for this day */
    slots: SlotDto[];
}

/** Payload for creating a new routine */
export interface CreateRoutineDto {

    /** Routine title */
    title: string;

    /** Optional description field */
    description?: string;

    /** Array of day routines (should include at least one day) */
    days: DayRoutineDto[];
}

/** Payload for updating an existing routine */
export interface UpdateRoutineDto {
    /** New title (optional) */
    title?: string;

    /** New description (optional) */
    description?: string;

    /** New set of day routines (optional full replace) */
    days?: DayRoutineDto[];
}

/** What the API returns when fetching a routine */
export interface RoutineResponseDto {
    /** Routine ID as string */
    id: string;

    /** Owner’s user ID as string */
    userId: string;

    /** Unique shareable ID */
    shareId: string;

    /** Routine title */
    title: string;

    /** Optional description */
    description?: string;

    /** Scheduled days with slots */
    days: DayRoutineDto[];

    /** ISO timestamp when created */
    createdAt: string;

    /** ISO timestamp when last updated */
    updatedAt: string;
}
