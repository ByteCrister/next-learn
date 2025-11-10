// /types.searching.ts
export const SEARCH_ITEM_TYPE = {
    SUBJECT: "subject",
    ROUTINE: "routine",
    EVENT: "event",
    EXAM: "exam",
} as const;

export type SearchItemType = (typeof SEARCH_ITEM_TYPE)[keyof typeof SEARCH_ITEM_TYPE];

export interface SearchMetaBase {
    id: string; // encoded or raw id depending on caller
    rawId?: string; // optional raw Mongo ObjectId string if needed
    createdAt?: string; // ISO date string (date part may be used by UI)
}

export interface SubjectMeta extends SearchMetaBase {
    code?: string;
    description?: string;
    createdAt?: string;
}

export interface RoutineMeta extends SearchMetaBase {
    totalSlots?: number;
    description?: string;
}

export interface EventMeta extends SearchMetaBase {
    start?: string; // ISO date
    durationMinutes?: number;
    matchedTasks?: string[]; // subset of tasks that matched
}

export interface ExamMeta extends SearchMetaBase {
    examCode?: string;
    subjectCode?: string;
    durationMinutes?: number;
    scheduledStartAt?: string; // ISO date
}

/** Generic search result item returned by the global search API */
export interface SearchResultItem<TMeta = SearchMetaBase> {
    type: SearchItemType;
    /** Primary label to display in UI (highlighting happens client-side) */
    label: string;
    /** URL to navigate to the matched resource */
    href: string;
    /** Structured metadata useful for client UX or grouping */
    meta: TMeta;
    /** Optional array of matched field names for client highlighting */
    matches?: string[];
}

/** Convenience unions for typed results */

export type SubjectSearchResult = SearchResultItem<SubjectMeta> & {
  type: typeof SEARCH_ITEM_TYPE.SUBJECT;
};
export type RoutineSearchResult = SearchResultItem<RoutineMeta> & {
  type: typeof SEARCH_ITEM_TYPE.ROUTINE;
};
export type EventSearchResult = SearchResultItem<EventMeta> & {
  type: typeof SEARCH_ITEM_TYPE.EVENT;
};
export type ExamSearchResult = SearchResultItem<ExamMeta> & {
  type: typeof SEARCH_ITEM_TYPE.EXAM;
};

export type SearchResults =
    | SubjectSearchResult
    | RoutineSearchResult
    | EventSearchResult
    | ExamSearchResult;

/** Top-level API response shape */
export interface SearchResponse {
    results: SearchResults[];
    total?: number; // optional global total (if you compute it)
    tookMs?: number; // optional timing info for diagnostics
}
