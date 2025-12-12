// next-learn/src/utils/auth/authConfig.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { User as DBUser } from "@/models/User";
import ConnectDB from "@/config/ConnectDB";
import { Types } from "mongoose";

export const ONE_DAY = 60 * 60 * 24;
export const ONE_MONTH = ONE_DAY * 30;

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "checkbox" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const remember =
          credentials?.remember === "on" ||
          credentials?.remember === true;

        if (!email || !password) {
          throw new Error("MissingCredentials");
        }

        await ConnectDB();
        const user = await DBUser.findOne({ email });

        console.log("Signing in user:", user?.email);

        if (!user) {
          throw new Error("UserNotFound");
        }

        if (!user.passwordHash) {
          throw new Error("NoPasswordSet");
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error("PasswordMismatch");
        }

        return {
          id: (user._id as Types.ObjectId).toString(),
          remember,
          email: user.email,
          name: user.name,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: ONE_MONTH,
    updateAge: 3600,
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await ConnectDB();

        let existing = await DBUser.findOne({ email: user.email });
        console.log("User:", existing?.email);

        if (!existing) {
          existing = await DBUser.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            providerAccountId: account.providerAccountId,
            emailVerified: new Date(),
            role: "member",
          });
        }

        user.id = (existing._id as Types.ObjectId).toString();
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.remember = (user as any).remember ?? false;
      }

      if (trigger === "update" && session?.remember !== undefined) {
        token.remember = session.remember;
      }

      token.exp =
        Math.floor(Date.now() / 1000) +
        (token.remember ? ONE_MONTH : ONE_DAY);

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      session.remember = token.remember ?? false;

      if (token.exp) {
        session.expires = new Date(token.exp * 1000).toISOString() as unknown as Date & string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);