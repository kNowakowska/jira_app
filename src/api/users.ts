import axiosInstance from "../axios/axios";

import success from "../components/SuccessDialog";

import { store } from "../redux/store";
import { logIn, logOut } from "../redux/systemSlice";
import { receiveUsers, editUser } from "../redux/usersSlice";
import { clearBoards } from "../redux/boardsSlice";
import { UserType } from "../types";

export const getUser = (
  userId: string,
  successCallback: (user: UserType) => void = () => null,
  errorCallback: () => void = () => null
) => {
  axiosInstance
    .get<UserType>(`/users/${userId}`)
    .then((response) => {
      successCallback(response.data);
    })
    .catch(() => {
      errorCallback();
    });
};

export const getUsers = () => {
  axiosInstance.get<UserType[]>(`/users`).then((response) => {
    store.dispatch(receiveUsers(response.data));
  });
};

export const createUser = (userData: Partial<UserType> & { password: string }, successCallback: () => void) => {
  axiosInstance.post<UserType>(`/users`, userData).then(() => {
    //without automatic login
    success("Rejestracja", "Rejestracja zakończona sukcesem. Zaloguj się, aby korzystać z aplikacji.");
    successCallback();
  });
};

export const updateUser = (
  userData: Partial<UserType> & { password?: string },
  successCallback: (user: UserType) => void,
  errorCallback: () => void
) => {
  axiosInstance
    .patch<UserType>(`/users/${userData.identifier}`, userData)
    .then((response) => {
      store.dispatch(logIn(response.data));
      store.dispatch(editUser(response.data));
      successCallback(response.data);
      success("Edycja użytkownika", "Edycja użytkownika zakończona sukcesem.");
    })
    .catch(() => {
      errorCallback();
    });
};

export const deleteUser = (userId: string | undefined, successCallback: () => void) => {
  axiosInstance.delete<UserType>(`/users/${userId}`).then(() => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    store.dispatch(logOut());
    store.dispatch(clearBoards());
    successCallback();
    success("Usunięcie użytkownika", "Usunięcie użytkownika zakończone sukcesem.");
  });
};
