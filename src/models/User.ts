import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type UserRole = "member" | "admin";

export type RestrictionType = "temporary" | "permanent";

export interface IUserRestriction {
    type: RestrictionType;
    reason: string;
    adminId: Types.ObjectId;
    createdAt: Date;
    expiresAt?: Date;          // only for temporary
}

const restrictionSchema = new Schema<IUserRestriction>(
    {
        type: {
            type: String,
            enum: ["temporary", "permanent"],
            required: true,
            default: "temporary",
        },
        reason: { type: String, required: true, trim: true },
        adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: () => new Date(), immutable: true },
        expiresAt: { type: Date }, // omit for permanent bans
    },
    { _id: false }
);

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    image?: string;
    emailVerified?: Date;
    provider?: string;
    providerAccountId?: string;
    createdAt: Date;
    updatedAt: Date;

    role: UserRole;

    // Password Reset OTP
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    resetPasswordOTPAttempts: number; // default 0
    lastOTPSentAt?: Date;

    restrictions: IUserRestriction[];
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, default: null },
        image: { type: String, default: null },
        emailVerified: { type: Date, default: null },
        provider: { type: String, default: null },
        providerAccountId: { type: String, default: null },

        role: {
            type: String,
            enum: ["member", "admin"],
            default: "member",
        },

        // Password reset fields
        resetPasswordOTP: { type: String, default: null },
        resetPasswordOTPExpires: { type: Date, default: null },
        resetPasswordOTPAttempts: { type: Number, default: 0 },
        lastOTPSentAt: { type: Date, default: null },

        // history of all suspensions/bans
        restrictions: {
            type: [restrictionSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// Add indexing after schema definition
userSchema.index({ role: 1 }); // filter/sort by role (admin vs member)
userSchema.index({ createdAt: -1 }); // sort by newest users
userSchema.index({ updatedAt: -1 }); // sort by recent updates

// Password reset related
userSchema.index({ resetPasswordOTP: 1 }); // lookup by OTP
userSchema.index({ resetPasswordOTPExpires: 1 }); // cleanup expired OTPs efficiently

// Restriction-related (subdocuments)
userSchema.index({ "restrictions.type": 1 }); // query temp vs permanent restrictions
userSchema.index({ "restrictions.adminId": 1 }); // find bans by admin
userSchema.index({ "restrictions.expiresAt": 1 }); // cleanup expired restrictions


export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);
