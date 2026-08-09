import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = axios.isAxiosError(error)
      ? error.config?.url?.startsWith("/auth/")
      : false;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthEndpoint
    ) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);
