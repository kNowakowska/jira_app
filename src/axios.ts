import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 1000,
  headers: { "Content-Type": "application/json", Accept: "*/*" },
});

if (localStorage.getItem("token")) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

export default axiosInstance;
