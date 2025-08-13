import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { User } from "@/models/User";
import ConnectDB from "@/config/ConnectDB";
import { Types } from "mongoose";

import type { JWT as DefaultJWT } from "next-auth/jwt";

interface MyJWT extends DefaultJWT {
    id?: string;
    remember?: boolean;
}

const ONE_DAY = 60 * 60 * 24;
const ONE_MONTH = 60 * 60 * 24 * 30;


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                await ConnectDB();
                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("Invalid email or password");

                if (!user.passwordHash) {
                    throw new Error(
                        "Your account was created with Google. Please sign in with Google or reset your password."
                    );
                }

                const isPasswordCorrect = await compare(
                    credentials.password,
                    user.passwordHash
                );
                if (!isPasswordCorrect) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: (user._id as Types.ObjectId).toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await ConnectDB();
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        emailVerified: new Date(),
                        resetPasswordOTP: undefined,
                        resetPasswordOTPExpires: undefined,
                        resetPasswordOTPAttempts: 0,
                    });
                }
            }
            return true;
        },

        async jwt({ token }) {
            await ConnectDB();

            const dbUser = await User.findOne({ email: token.email }).select("_id");
            if (dbUser) {
                token.id = (dbUser._id as Types.ObjectId).toString();
            }

            if (token.remember) {
                token.exp = Math.floor(Date.now() / 1000) + ONE_MONTH;
            } else {
                token.exp = Math.floor(Date.now() / 1000) + ONE_DAY;
            }

            return token;
        },

        async session({ session, token }: { session: Session; token: MyJWT }) {
            if (session.user) {
                session.user.id = token.id ?? "";
            }
            session.remember = typeof token.remember === "boolean" ? token.remember : false;
            return session;
        },

    },

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 day
        updateAge: 60 * 60, // 1 hour
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
