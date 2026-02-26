"use client";

import { api } from "@/lib/api";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await api.get(url);
          return res.data;
        },

        errorRetryCount: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
}
