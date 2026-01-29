import { Outlet } from "react-router-dom";
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";

const MainLayout = () => {
  return (
    <>
      <Header dasboardPage={true} />

      <Outlet />

      <Footer />
    </>
  );
};

export default MainLayout;
