import { useState, useEffect, useCallback } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";

import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import NotFound from "../pages/404Page";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";
import BoardPage from "../pages/BoardPage";
import AccountPage from "../pages/AccountPage";
import CreateBoardPage from "../pages/CreateBoardPage";
import TaskPage from "../pages/TaskPage";
import Navbar from "../components/Navbar";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logIn } from "../redux/systemSlice";
import { getUser, getUsers } from "../api/users";
import { getBoards } from "../api/boards";

export const MyRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
  const loggedUser = useAppSelector((state) => state.system.user);

  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const checkUserData = useCallback(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", checkUserData);
    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, [checkUserData]);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userIdentifier");
    if (accessToken && userId) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userId", userId);
      window.dispatchEvent(new Event("storage"));
    }
  }, [searchParams]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!loggedUser && userId) {
      getUser(userId, (user) => {
        dispatch(logIn(user));
        getBoards();
        getUsers();
      });
    }
  }, [loggedUser]);

  return isLoggedIn ? (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="boards/:id" element={<BoardPage />} />
        <Route path="new_board" element={<CreateBoardPage />} />
        <Route path="profile/:id" element={<AccountPage />} />
        <Route path="tasks/new_task" element={<TaskPage create />} />
        <Route path="tasks/:id" element={<TaskPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  ) : (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/oauth/callback" element={<MainPage githubLogin />} />
      <Route path="login" element={<Login />} />
      <Route path="sign_up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
