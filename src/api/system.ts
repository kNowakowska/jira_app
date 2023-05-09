import axiosInstance from "../axios/axios";
import { store } from "../redux/store";

import { logIn as logInAction, logOut as logOutAction, setGithubUrl } from "../redux/systemSlice";
import { clearBoards } from "../redux/boardsSlice";
import { getUser, getUsers } from "./users";
import { getBoards } from "./boards";
import { LoginRequestType, LoginResponseType, LogoutResponseType } from "../types";

export const saveLoginData = (accessToken: string, userIdentifier: string) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("userId", userIdentifier);
  window.dispatchEvent(new Event("storage"));

  getUser(userIdentifier, (user) => {
    store.dispatch(logInAction(user));
    getBoards();
    getUsers();
  });
};

export const logIn = (loginData: LoginRequestType, successCallback: () => void, errorCallback: (errMsg: string) => void) => {
  axiosInstance
    .post<LoginResponseType>("/auth/login", loginData)
    .then((response) => {
      saveLoginData(response.data.accessToken, response.data.userIdentifier);
      successCallback();
    })
    .catch((err) => {
      errorCallback(err.response.data.message);
    });
};

export const logOut = (userId: string, successCallback: () => void) => {
  const logoutData: LogoutResponseType = { userIdentifier: userId };
  axiosInstance.post("/auth/logout", logoutData).then(() => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    store.dispatch(logOutAction());
    store.dispatch(clearBoards());
    successCallback();
  });
};

export const getGithubUrl = () => {
  axiosInstance.get("/auth/oauth/urls").then((response) => {
    store.dispatch(setGithubUrl(response.data.githubUrl));
  });
};
