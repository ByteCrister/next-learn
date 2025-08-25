import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { User as DBUser } from "@/models/User";
import ConnectDB from "@/config/ConnectDB";
import { Types } from "mongoose";
import type { JWT as DefaultJWT } from "next-auth/jwt";

interface MyJWT extends DefaultJWT {
    id: string;
    remember?: boolean;
    exp?: number;
}

const ONE_DAY = 60 * 60 * 24; // 1 day in seconds
const ONE_MONTH = ONE_DAY * 30; // 30 days in seconds

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember", type: "checkbox" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                await ConnectDB();
                const user = await DBUser.findOne({ email: credentials.email });
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
                if (!isPasswordCorrect) throw new Error("Invalid email or password");

                // Only return id
                return { id: (user._id as Types.ObjectId).toString() };
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
                let dbUser = await DBUser.findOne({ email: user.email });
                if (!dbUser) {
                    dbUser = await DBUser.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        emailVerified: new Date(),
                        role: "member",
                    });
                }
                user.id = (dbUser?._id as Types.ObjectId).toString();
            }
            return true;
        },

        async jwt({ token, user, trigger, session }) {
            // First login
            if (user) {
                token.id = user.id;
                token.remember = session?.remember ?? false;
            }

            // Update remember flag if session updated
            if (trigger === "update" && session?.remember !== undefined) {
                token.remember = session.remember;
            }

            // Set expiration based on remember
            token.exp =
                Math.floor(Date.now() / 1000) +
                (token.remember ? ONE_MONTH : ONE_DAY);

            return token;
        },

        async session({ session, token }: { session: Session; token: MyJWT }) {
            if (session.user) {
                session.user.id = token.id ?? "";
            }
            session.remember = token.remember ?? false;

            // Set expires string for client-side
            if (token.exp) {
                session.expires = new Date(token.exp * 1000).toISOString();
            }

            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: ONE_MONTH, // fallback maxAge
        updateAge: 60 * 60, // refresh every hour
    },

    cookies: {
        sessionToken: {
            name:
                process.env.NODE_ENV === "production"
                    ? "__Secure-next-auth.session-token"
                    : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },

    pages: {
        signIn: "/signin",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
