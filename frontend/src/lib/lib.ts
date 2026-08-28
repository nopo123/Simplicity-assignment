import axios from "axios";
import { getEnv } from "src/config/env";

export const BACKEND_HOST =
  getEnv("VITE_BACKEND_HOST") ??
  `${window.location.protocol}//${window.location.hostname}:3000`;

const axiosInstance = axios.create({
  baseURL: BACKEND_HOST,
  timeout: 30000,
});

axiosInstance.interceptors.response.use((response) => response?.data);

export default axiosInstance;
