import axiosInstance from "../axios";
import error from "../components/ErrorDialog";
import success from "../components/SuccessDialog";
import { store } from "../redux/store";
import { systemSlice } from "../redux/systemSlice";

type UserRequestDataType = {
  email: string;
  firstname: string;
  surname: string;
  password: string;
  identifier?: string;
};

type UserResponseType = {
  identifier: string;
  email: string;
  firstname: string;
  surname: string;
};

type UserCollectionResponseType = {
  data: UserResponseType[];
};

export const getUser = (userId: string, successCallback: (user: UserResponseType) => void) => {
  axiosInstance
    .get<UserResponseType>(`/users/${userId}`)
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
    .get<UserCollectionResponseType>(`/users`)
    .then(() => {
      //zapis do reduxa ?
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't get users", err.response.data.message);
    });
};

export const createUser = (userData: UserRequestDataType, successCallback: () => void) => {
  axiosInstance
    .post<UserResponseType>(`/users`, userData)
    .then(() => {
      //without automatic login
      success("Registration succees", "Your registration succeeded. Log in to continue.");
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't create user", err.response.data.message);
    });
};

export const updateUser = (userData: UserRequestDataType, successCallback: (user: UserResponseType) => void) => {
  axiosInstance
    .put<UserResponseType>(`/users/${userData.identifier}`, userData)
    .then((response) => {
      successCallback(response.data);
      //jeśli zapis userów do reduxa to tutaj update
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't update user", err.response.data.message);
    });
};

export const deleteUser = (userId: string, successCallback: () => void) => {
  axiosInstance
    .delete<UserResponseType>(`/users/${userId}`)
    .then(() => {
      localStorage.clear();
      store.dispatch(systemSlice.actions.logOut());
      successCallback();
    })
    .catch((err) => {
      console.error(err.message);
      error("Couldn't delete user", err.response.data.message);
    });
};
