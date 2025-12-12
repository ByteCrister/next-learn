// next-learn/src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/utils/auth/authConfig";

export const { GET, POST } = handlers;