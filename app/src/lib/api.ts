import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor de Requisição: Roda ANTES de cada chamada
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  const token = session?.tokens?.access_token;

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de Resposta: Roda APÓS cada chamada (para erros 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await getSession();

      if (session?.error === "RefreshAccessTokenError") {
        signOut({ callbackUrl: "/" });
        return Promise.reject(error);
      }

      if (session?.tokens?.access_token) {
        originalRequest.headers.Authorization = `Bearer ${session.tokens.access_token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export const fetcher = async <T>([url, manualToken]: [
  string | null,
  string?,
]): Promise<T | null> => {
  if (!url) return null;

  const res = await api.get<T>(url, {
    headers: manualToken ? { Authorization: `Bearer ${manualToken}` } : {},
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
  return error instanceof Error ? error.message : "Erro desconhecido";
}
