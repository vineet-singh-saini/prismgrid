import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000/api";

function normalizeApiBaseUrl(rawUrl) {
  if (!rawUrl) {
    return DEFAULT_API_URL;
  }

  try {
    const parsedUrl = new URL(rawUrl);
    const cleanPath = parsedUrl.pathname.replace(/\/+$/, "");

    if (!cleanPath || cleanPath === "/") {
      parsedUrl.pathname = "/api";
    } else if (!cleanPath.endsWith("/api")) {
      parsedUrl.pathname = `${cleanPath}/api`;
    } else {
      parsedUrl.pathname = cleanPath;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_API_URL;
  }
}

const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.errors?.length) {
    return responseData.errors.map((item) => item.message).join(" ");
  }

  return responseData?.message || error?.message || fallbackMessage;
}
