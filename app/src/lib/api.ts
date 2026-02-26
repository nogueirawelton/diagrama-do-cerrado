import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let cachedToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

async function getValidToken(): Promise<string | null> {
  // 1. Se já tem no cache, retorna
  if (cachedToken) return cachedToken;

  // 2. Se já tem alguém buscando (refresh ou busca inicial), entra na fila
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  // 3. Se não tem token e ninguém buscando, busca agora
  isRefreshing = true;
  try {
    console.log("🚀 BUSCANDO SESSÃO INICIAL/REFRESH");
    const session = await getSession();

    if (session?.error === "RefreshAccessTokenError") {
      throw new Error("RefreshAccessTokenError");
    }

    const token = session?.tokens?.access_token || null;
    cachedToken = token;

    // Libera quem estava esperando
    processQueue(null, token);
    return token;
  } catch (error) {
    processQueue(error, null);
    cachedToken = null;
    return null;
  } finally {
    isRefreshing = false;
  }
}

api.interceptors.request.use(async (config) => {
  const token = await getValidToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      cachedToken = null;
      const newToken = await getValidToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        await signOut({ callbackUrl: "/", redirect: true });
      }
    }

    return Promise.reject(error);
  },
);

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
