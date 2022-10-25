import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

import Login from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import NotFound from "../pages/404Page";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";

export const MyRoutes: React.FC = () => {
  const isLogged = useAppSelector((state) => state.system.isLogged);

  return isLogged ? (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
