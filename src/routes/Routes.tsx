import { Route, Routes } from "react-router-dom";

import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import NotFound from "../pages/404Page";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";

export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="login" element={<Login />} />
      <Route path="sign_up" element={<SignUp />} />
      <Route path="home" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
