import { Header } from "@/components/shared/header";
import { SWRProvider } from "@/providers/swr-provider";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SWRProvider>
        <Header />
        {children}
      </SWRProvider>
    </SessionProvider>
  );
}
