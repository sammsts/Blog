import NextAuth, { type SessionStrategy, type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../../src/lib/prisma"; // ✅ Usa a instância exportada por default

export const authOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma), // Usa a instância correta
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
