import axiosInstance from "../axios";
import { store } from "../redux/store";

import error from "../components/ErrorDialog";

import { logIn as logInAction, logOut as logOutAction } from "../redux/systemSlice";
import { clearBoards } from "../redux/boardsSlice";
import { getUser, getUsers } from "./users";
import { getBoards } from "./boards";
import { LoginRequestType, LoginResponseType, LogoutResponseType } from "../types";

export const logIn = (loginData: LoginRequestType, successCallback: () => void, errorCallback: (errMsg: string) => void) => {
  axiosInstance
    .post<LoginResponseType>("/auth/login", loginData)
    .then((response) => {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userId", response.data.userIdentifier);
      window.dispatchEvent(new Event("storage"));
      getUser(response.data.userIdentifier, (user) => {
        store.dispatch(logInAction(user));
      });
      getBoards();
      getUsers();
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Login failed", err.response.data.message);
      errorCallback(err.response.data.message);
    });
};

export const logOut = (userId: string, successCallback: () => void) => {
  const logoutData: LogoutResponseType = { userIdentifier: userId };
  axiosInstance
    .post("/auth/logout", logoutData)
    .then(() => {
      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      store.dispatch(logOutAction());
      store.dispatch(clearBoards());
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Logout failed", err.response.data.message);
    });
};
