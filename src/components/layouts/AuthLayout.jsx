import { Outlet } from "react-router-dom";
import Header from "@/components/partials/Header";

const AuthLayout = () => {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
};

export default AuthLayout;
