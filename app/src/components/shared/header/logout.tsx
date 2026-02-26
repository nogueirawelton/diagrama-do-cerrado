"use client";

import { api } from "@/lib/api";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export function Logout({ children }: { children: ReactNode }) {
  async function handleLogout() {
    try {
      await api.post("/auth/logout", null);
    } catch (error) {
      console.error(error);
    } finally {
      signOut({ callbackUrl: "/" });
    }
  }
  return <div onClick={handleLogout}>{children}</div>;
}
