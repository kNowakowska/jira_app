import axios, { AxiosRequestConfig } from "axios";
import errorAlert from "./components/ErrorDialog";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      errorAlert("Wymagane zalogowanie!", "");
    }
    if (new RegExp(/5\d\d/).test(error.response.status)) {
      errorAlert("Błąd serwera!", "");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
