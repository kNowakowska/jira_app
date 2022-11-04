import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

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

export const MyRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("user") ? true : false);

  useEffect(() => {
    function checkUserData() {
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    window.addEventListener("storage", checkUserData);

    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, []);

  return isLoggedIn ? (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="boards/:id" element={<BoardPage />} />
        <Route path="new_board" element={<CreateBoardPage />} />
        <Route path="profile/:id" element={<AccountPage />} />
        <Route path="tasks/:id" element={<TaskPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  ) : (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="login" element={<Login />} />
      <Route path="sign_up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
