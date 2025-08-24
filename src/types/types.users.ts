// types/types.user.ts

/**
 * Time intervals supported for statistics bucketing.
 */
export type IntervalUnit = "day" | "week" | "month" | "year";

/**
 * A single bucket of statistics (e.g. users created in a given week).
 */
export interface BucketStat {
    /** Sequential bucket index (0, 1, 2...) */
    _id: number;
    /** Number of documents (users, subjects, etc.) in this bucket */
    count: number;
    /** Earliest date within this bucket */
    minDate: string; // ISO date string
    /** Latest date within this bucket */
    maxDate: string; // ISO date string
}

/**
 * Response structure for statistics API.
 */
export interface StatisticsResponse {
    range: { start: string; end: string };
    /** Example: "2 weeks" */
    interval: string;
    stats: {
        users: BucketStat[];
        subjects: BucketStat[];
        material: BucketStat[];
        event: BucketStat[];
        exam: BucketStat[];
    };
}

/**
 * Roles available for a user account.
 */
export type UserRole = "member" | "admin";

/**
 * Restriction types applied to users.
 */
export type RestrictionType = "temporary" | "permanent";

/**
 * A single restriction record applied to a user.
 */
export interface UserRestriction {
    type: RestrictionType;
    reason: string;
    adminId: string; // MongoDB ObjectId serialized as string
    createdAt: string; // ISO date string
    expiresAt?: string; // ISO date string (only for temporary bans)
}

/**
 * Representation of a user object returned to the client.
 */
export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string; // ISO date string
    restrictions: UserRestriction[];
}

/**
 * Response returned when fetching a list of users.
 */
export interface UsersListResponse {
    users: UserResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

/**
 * Request body for adding a new restriction to a user.
 */
export interface AddRestrictionRequest {
    userId: string;
    type: RestrictionType;
    reason: string;
    expiresAt?: string; // ISO date string
}



export interface UserStatsResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string; // or Enum if you have IUserRole
        joinedAt: string; // ISO date string
    };
    stats: {
        studyMaterials: number;
        routines: number;
        examsTaken: number;
        averageScore: number;
        highestScore: number;
        upcomingEvents: number;
    };
}