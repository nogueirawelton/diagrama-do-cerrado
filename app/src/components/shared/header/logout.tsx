"use client";

import { api } from "@/lib/api";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

export function Logout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  async function handleLogout() {
    try {
      await api.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      signOut({ callbackUrl: "/" });
    }
  }
  return <div onClick={handleLogout}>{children}</div>;
}
