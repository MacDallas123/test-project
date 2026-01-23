import "./App.css";
import MainLayout from "@/components/layouts/MainLayout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import IsForbidden from "@/pages/IsForbidden";
import PrestationServicePage from "./pages/PrestationServicePage";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import JobsPage from "./pages/JobsPage";
import LoginPage from "./pages/auth/LoginPage";
import AuthLayout from "./components/layouts/AuthLayout";
import RegisterPage from "./pages/auth/RegisterPage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import OffresEmploisPage from "./pages/dashboard/OffresEmploisPage";
import UsersPage from "./pages/dashboard/UsersPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import CandidaturesPage from "./pages/dashboard/CandidaturesPage";
import ClientsPage from "./pages/dashboard/ClientsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<PasswordResetPage />} />

          <Route path="/auth" element={<Navigate to="/auth/login" />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/offres" element={<OffresEmploisPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/candidatures" element={<CandidaturesPage />} />
          <Route path="/dashboard/clients" element={<ClientsPage />} />
          <Route path="/dashboard/mails" element={<ClientsPage />} />
          <Route path="/dashboard/factures" element={<ClientsPage />} />
          <Route path="/dashboard/devis" element={<ClientsPage />} />
          <Route path="/dashboard/avoirs" element={<ClientsPage />} />
          <Route path="/dashboard/articles" element={<ClientsPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<PasswordResetPage />} />

          <Route path="/auth" element={<Navigate to="/auth/login" />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/prestataire/:userId" element={<PrestationServicePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/emploi" element={<JobsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/403" element={<IsForbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
