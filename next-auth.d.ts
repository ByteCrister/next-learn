import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    remember?: boolean;
  }

  interface JWT {
    id: string;
    remember?: boolean;
    exp?: number;
  }

  interface User extends DefaultUser {
    id: string;
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    remember?: boolean;
    exp?: number;
  }
}
