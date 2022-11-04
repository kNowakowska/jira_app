import axiosInstance from "../axios";
import { user } from "../data";
import { store } from "../redux/store";
import { systemSlice } from "../redux/systemSlice";
import error from "../components/ErrorDialog";

type LoginDataType = {
  email: string;
  password: string;
};

type LoginResponseType = {
  accessToken: string;
  identifier?: string;
};

type LogoutDataType = {
  userIdentifier?: string;
};

export const logIn = (loginData: LoginDataType, successCallback: () => void, errorCallback: (errMsg: string) => void) => {
  axiosInstance
    .post<LoginResponseType>("/auth/login", loginData)
    .then((response) => {
      localStorage.setItem("token", response.data.accessToken);
      if (response.data.identifier) localStorage.setItem("userId", response.data.identifier);
      window.dispatchEvent(new Event("storage"));
      //get user basing on id and save it in store
      store.dispatch(systemSlice.actions.logIn(user));
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Login failed", err.response.data.message);
      errorCallback(err.response.data.message);
    });
};

export const logOut = (userId: string | undefined, successCallback: () => void) => {
  const logoutData: LogoutDataType = { userIdentifier: userId };
  axiosInstance
    .post("/auth/logout", logoutData)
    .then(() => {
      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      //get user basing on id and save it in store
      store.dispatch(systemSlice.actions.logOut());
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Logout failed", err.response.data.message);
    });
};
