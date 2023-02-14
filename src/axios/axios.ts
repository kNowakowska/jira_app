import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/",
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
