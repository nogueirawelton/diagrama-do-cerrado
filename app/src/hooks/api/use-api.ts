import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useApi = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use((config) => {
      if (!config.headers.Authorization && session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return api;
};
