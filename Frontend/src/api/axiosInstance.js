import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ;
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "ak-token";
export const REMEMBER_ME_STORAGE_KEY = "ak-remember-me";

export function getAuthToken() {
  const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (localToken) return localToken;
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
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

export default axiosInstance;
