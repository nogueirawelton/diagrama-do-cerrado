import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    lastOpenedWalletNumber?: string;
    tokens: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
  }

  interface Session {
    tokens?: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
    user: {
      lastOpenedWalletNumber?: string;
    } & DefaultSession["user"];
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    lastOpenedWalletNumber?: string;
    tokens?: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
    error?: string;
  }
}
