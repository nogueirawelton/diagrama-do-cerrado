"use server";

import { cookies } from "next/headers";

export async function authAction(access_token: string, refresh_token: string) {
  const { set } = await cookies();

  set("ACCESS_TOKEN", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15, // 15m,
  });

  set("REFRESH_TOKEN", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
}
