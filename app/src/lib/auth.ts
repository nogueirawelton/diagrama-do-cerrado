import axios from "axios";
import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        try {
          const { data } = await axios.post(
            `${API_URL}/auth/login`,
            credentials,
          );

          return {
            ...data.user,
            tokens: data.tokens,
            lastOpenedWalletNumber: data.user.lastOpenedWalletNumber,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.lastOpenedWalletNumber = user.lastOpenedWalletNumber;
        token.tokens = user.tokens;
        return token;
      }

      const expiresAt = Number(token.tokens?.expires_at) * 1000;
      const bufferTime = 60000;

      if (Date.now() < expiresAt - bufferTime) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.tokens) {
        session.tokens = token.tokens;
        session.user.lastOpenedWalletNumber = token.lastOpenedWalletNumber;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7d
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { data } = await axios.get(`${API_URL}/auth/refresh`, {
      headers: {
        Authorization: `Bearer ${token.tokens?.refresh_token}`,
      },
    });

    return {
      ...token,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token ?? token.tokens?.refresh_token,
        expires_at: data.expires_at,
      },
    };
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
