import axiosInstance from "./axios";
import errorAlert from "../components/ErrorDialog";
import { NavigateFunction } from "react-router";

export const ResponseInterceptors = (navigate: NavigateFunction) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
        errorAlert("Wymagane zalogowanie!", "");
        navigate("/");
      }
      if (new RegExp(/5\d\d/).test(error.response.status)) {
        errorAlert("Błąd serwera!", "");
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
};
