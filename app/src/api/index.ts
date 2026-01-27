import { getCookies, login, logout } from "@/actions/auth-action";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

api.interceptors.request.use(
  async (config) => {
    const { access_token } = await getCookies();

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refresh_token } = await getCookies();

        if (refresh_token) {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              headers: {
                Authorization: `Bearer ${refresh_token}`,
              },
            },
          );

          await login(data.access_token, data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        await logout();
        window.location.href = "/";
        return Promise.reject(refreshError);
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

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Ocorreu um erro desconhecido";
}
