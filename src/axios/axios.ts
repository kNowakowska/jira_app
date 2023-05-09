import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 1000,
  headers: { "Content-Type": "application/json", Accept: "*/*" },
});

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config?.headers || !localStorage.getItem("token")) {
    return config;
  } else {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return config;
});

export default axiosInstance;
