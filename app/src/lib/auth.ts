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
      // Login Inicial
      if (user) {
        token.lastOpenedWalletNumber = user.lastOpenedWalletNumber;
        token.tokens = user.tokens;

        return token;
      }

      // Verifica se o token ainda é válido (com buffer de 60s)
      const expiresAt = Number(token.tokens?.expires_at) * 1000;
      const now = Date.now();

      if (now < expiresAt - 60000) {
        console.log("✔ USANDO TOKEN ANTIGO");
        return token;
      }

      return refreshAccessToken(token);

      // if (!authLock.refreshPromise) {
      //   authLock.refreshPromise = refreshAccessToken(token).finally(() => {
      //     authLock.refreshPromise = null;
      //   });
      // }

      // return await authLock.refreshPromise;
    },

    async session({ session, token }) {
      if (token.tokens) {
        session.tokens = token.tokens;
        session.user.lastOpenedWalletNumber = token.lastOpenedWalletNumber;
        session.error = token.error;
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
  console.log("✔ BUSCANDO TOKEN NOVO");

  try {
    const { data } = await axios.get(`${API_URL}/auth/refresh`, {
      headers: {
        Authorization: `Bearer ${token.tokens?.refresh_token}`,
      },
    });

    token.lastOpenedWalletNumber = data.user.lastOpenedWalletNumber;
    token.tokens = data.tokens;
  } catch (error) {
    token.error = "RefreshAccessTokenError";
  } finally {
    return token;
  }
}
