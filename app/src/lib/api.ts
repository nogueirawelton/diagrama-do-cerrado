import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        if (typeof window !== "undefined") {
          await signOut({ callbackUrl: "/" });
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const session = await getSession();

        if (session?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }

      if (typeof window !== "undefined") {
        await signOut({ callbackUrl: "/" });
      }
    }

    return Promise.reject(error);
  },
);

export const fetcher = async <T>([url, token]: [
  string,
  string | undefined,
]): Promise<T> => {
  if (!url) return null as T;

  const res = await api.get<T>(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.data;
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Ocorreu um erro desconhecido";
}
