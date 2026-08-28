import axios from "axios";
import { getEnv } from "src/config/env";

function resolveHost(): string {
  const host = getEnv("VITE_BACKEND_HOST");
  if (host) return host;

  return `${window.location.protocol}//${window.location.hostname}:3000`;
}

export const BACKEND_HOST = resolveHost();

const axiosInstance = axios.create({
  baseURL: BACKEND_HOST,
  timeout: 30000,
});

axiosInstance.interceptors.response.use((response) => response?.data);

export default axiosInstance;
