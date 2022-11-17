import axiosInstance from "../axios";

import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";

import { store } from "../redux/store";
import { logIn, logOut } from "../redux/systemSlice";
import { receiveUsers } from "../redux/usersSlice";
import { clearBoards } from "../redux/boardsSlice";
import { UserType } from "../types";

type UserRequestDataType = {
  email: string;
  firstname: string;
  surname: string;
  password?: string;
  identifier?: string;
};

export const getUser = (userId: string | null, successCallback: (user: UserType) => void = () => null) => {
  axiosInstance
    .get<UserType>(`/users/${userId}`)
    .then((response) => {
      successCallback(response.data);
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get user", err.response.data.message);
    });
};

export const getUsers = () => {
  axiosInstance
    .get<UserType[]>(`/users`)
    .then((response) => {
      store.dispatch(receiveUsers(response.data));
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get users", err.response.data.message);
    });
};

export const createUser = (userData: UserRequestDataType, successCallback: () => void) => {
  axiosInstance
    .post<UserType>(`/users`, userData)
    .then(() => {
      //without automatic login
      success("Registration success", "Your registration succeeded. Log in to continue.");
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create user", err.response.data.message);
    });
};

export const updateUser = (
  userData: UserRequestDataType,
  successCallback: (user: UserType) => void,
  errorCallback: () => void
) => {
  axiosInstance
    .patch<UserType>(`/users/${userData.identifier}`, userData)
    .then((response) => {
      store.dispatch(logIn(response.data));
      successCallback(response.data);
      success("User update success", "Your changed your data successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't update user", err.response.data.message);
      errorCallback();
    });
};

export const deleteUser = (userId: string | undefined, successCallback: () => void) => {
  axiosInstance
    .delete<UserType>(`/users/${userId}`)
    .then(() => {
      localStorage.clear();
      window.dispatchEvent(new Event("storage"));
      store.dispatch(logOut());
      store.dispatch(clearBoards());
      successCallback();
      success("User deletion", "User deleted successfully.");
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete user", err.response.data.message);
    });
};
