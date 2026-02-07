import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    tokens: {
      access_token: string;
      refresh_token: string;
    };
    expires_at: number;
  }

  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    access_token: string;
    refresh_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}
