// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { IUser, User } from "@/models/User";
import mongoose from "mongoose";
import ConnectDB from "@/config/ConnectDB";
import { FilterQuery, SortOrder } from "mongoose";

// Use your IUser interface directly for FilterQuery
type UserDocument = IUser & Document;

// Whitelisted sort fields
const allowedSortFields = ["name", "email", "createdAt", "role"] as const;
type AllowedSortFields = (typeof allowedSortFields)[number];

export async function GET(req: NextRequest) {
    let message = "Something went wrong";

    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 100);

        // Search
        const search = searchParams.get("search")?.trim() || "";

        // Sorting
        const sortFieldParam = searchParams.get("sortField");
        const sortField: AllowedSortFields = allowedSortFields.includes(
            sortFieldParam as AllowedSortFields
        )
            ? (sortFieldParam as AllowedSortFields)
            : "createdAt";

        const sortOrder: SortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

        // Filtering
        const role = searchParams.get("role");
        const restricted = searchParams.get("restricted");

        // Build query object
        const query: FilterQuery<UserDocument> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (role) {
            query.role = role;
        }

        if (restricted === "true") {
            query["restrictions.0"] = { $exists: true };
        } else if (restricted === "false") {
            query["restrictions.0"] = { $exists: false };
        }

        // Sort object with type safety
        const sort: Partial<Record<AllowedSortFields, SortOrder>> = {
            [sortField]: sortOrder,
        };

        // Query DB in parallel
        const [users, total] = await Promise.all([
            User.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            users,
            pagination: { total, page, limit },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            message = error.message || message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

/**
 * PATCH /api/users
 * Update a restriction
 */
export async function PATCH(req: NextRequest) {
    let message = "Something went wrong";
    try {
        await ConnectDB();
        const { userId, restrictionIndex, updates } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (restrictionIndex < 0 || restrictionIndex >= user.restrictions.length) {
            return NextResponse.json({ message: "Invalid restriction index" }, { status: 400 });
        }

        Object.assign(user.restrictions[restrictionIndex], updates);
        await user.save();

        return NextResponse.json({ message: "Restriction updated", user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            message = error.message || message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

/**
 * DELETE /api/users
 * Remove a restriction
 */
export async function DELETE(req: NextRequest) {
    let message = "Something went wrong";
    try {
        await ConnectDB();
        const { userId, restrictionIndex } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (restrictionIndex < 0 || restrictionIndex >= user.restrictions.length) {
            return NextResponse.json({ message: "Invalid restriction index" }, { status: 400 });
        }

        user.restrictions.splice(restrictionIndex, 1);
        await user.save();

        return NextResponse.json({ message: "Restriction removed", user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            message = error.message || message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
