import axiosInstance from "./axios";
import errorAlert from "../components/ErrorDialog";
import { NavigateFunction } from "react-router";

export const ResponseInterceptors = (navigate: NavigateFunction) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error);
      error.config.url;
      error.config.method;
      if (error.response.status === 401) {
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
        errorAlert("Wymagane zalogowanie!", "");
        navigate("/");
      } else if (new RegExp(/5\d\d/).test(error.response.status)) {
        errorAlert("Błąd serwera!", "");
      } else {
        console.error(error.message);
        errorAlert(error.response.data.reasonCode, error.response.data.message);
      }
      return Promise.reject(error);
    }
  );
};
