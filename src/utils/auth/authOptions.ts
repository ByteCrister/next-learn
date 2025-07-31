import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { User } from "@/models/User";
import ConnectDB from "@/config/ConnectDB";
import { Types } from "mongoose";

// Setup the NextAuth options cleanly with types
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

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid email or password");
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
                    });
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.id) session.user.id = token.id as string;
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/next-learn-user-authentication",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
