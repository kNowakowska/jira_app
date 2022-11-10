import axiosInstance from "../axios";
import { store } from "../redux/store";
import { logIn as logInAction, logOut as logOutAction } from "../redux/systemSlice";
import error from "../components/ErrorDialog";
import { getUser } from "./users";

type LoginDataType = {
  email: string;
  password: string;
};

type LoginResponseType = {
  accessToken: string;
  userIdentifier: string;
};

type LogoutDataType = {
  userIdentifier?: string;
};

export const logIn = (loginData: LoginDataType, successCallback: () => void, errorCallback: (errMsg: string) => void) => {
  axiosInstance
    .post<LoginResponseType>("/auth/login", loginData)
    .then((response) => {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userId", response.data.userIdentifier);
      window.dispatchEvent(new Event("storage"));
      getUser(response.data.userIdentifier, (user) => {
        store.dispatch(logInAction(user));
      });
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
      store.dispatch(logOutAction());
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Logout failed", err.response.data.message);
    });
};
