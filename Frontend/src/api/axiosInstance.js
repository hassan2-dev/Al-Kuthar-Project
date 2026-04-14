import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ;
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "ak-token";
export const REMEMBER_ME_STORAGE_KEY = "ak-remember-me";

function parseJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isExpiredToken(token) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function getAuthToken() {
  const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (localToken) {
    if (isExpiredToken(localToken)) {
      clearAuthToken();
      return null;
    }
    return localToken;
  }
  const sessionToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (sessionToken && isExpiredToken(sessionToken)) {
    clearAuthToken();
    return null;
  }
  return sessionToken;
}

export function setAuthToken(token, rememberMe = true) {
  if (!token) return;
  if (rememberMe) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(REMEMBER_ME_STORAGE_KEY, "1");
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
