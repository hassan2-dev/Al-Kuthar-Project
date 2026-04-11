import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ;
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "ak-token";

/** التوكن في localStorage ليبقى بعد إعادة تحميل الصفحة. */
export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
