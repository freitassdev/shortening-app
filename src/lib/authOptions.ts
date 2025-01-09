import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          name: user.name,
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          id: token.id,
          email: token.email,
        },
      };
    },

    async jwt({ token, user }: any) {
      // after login jwt token and get the user data from here
      if (user) {
        return {
          ...token,
          name: user.name,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  debug: true, //process.env.NODE_ENV === "development",
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};