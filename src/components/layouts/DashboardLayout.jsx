// layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
// import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import Header from "../partials/Header";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div>

      <Header dasboardPage={true} />

      <div className="flex flex-row">
        {/* Contenu principal */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Contenu principal avec padding adaptatif */}
        <Outlet />

      </div>

      {/* Footer */}
      {/* <DashboardFooter /> */}

    </div>
  );
};

export default DashboardLayout;