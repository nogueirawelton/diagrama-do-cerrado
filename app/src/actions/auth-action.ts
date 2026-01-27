"use server";
import { cookies } from "next/headers";

export async function login(access_token: string, refresh_token: string) {
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

export async function logout() {
  const { delete: remove } = await cookies();

  remove("ACCESS_TOKEN");
  remove("REFRESH_TOKEN");
}

export async function getCookies() {
  const { get } = await cookies();

  const access_token = get("ACCESS_TOKEN")?.value;
  const refresh_token = get("REFRESH_TOKEN")?.value;

  return { access_token, refresh_token };
}
