import { Route, Routes } from "react-router-dom";

import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import NotFound from "../pages/404Page";
import MainPage from "../pages/MainPage";

export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="login" element={<Login />} />
      <Route path="sign_up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
