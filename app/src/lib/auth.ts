import axios from "axios";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        try {
          const { data } = await axios.post(
            "http://server:3030/auth/login",
            credentials,
          );

          return data;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.tokens.access_token;
        token.refresh_token = user.tokens.refresh_token;
        token.expires_at = user.expires_at;
      }

      if (Date.now() < (token.expires_at as number) * 1000 - 60000) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7d
  },
});

async function refreshAccessToken(token: any) {
  try {
    const { data } = await axios.get("http://server:3030/auth/refresh", {
      headers: {
        Authorization: `Bearer ${token.refresh_token}`,
      },
    });
    return {
      ...token,
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? token.refresh_token, 
      expires_at: data.expires_at,
    };
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
