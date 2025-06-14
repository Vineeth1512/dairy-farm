import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import BottomNav from "./BottomNav/BottamNav";
import OwnerHome from "./OwnerHome/OwnerHome";

const OwnerDashboard = () => {
  const location = useLocation();
  const isOwnerDashboard = location.pathname === "/ownerDashboard";
  return (
    <div className="drawer  relative lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content p-6 pb-20 bg-base-200">
        {isOwnerDashboard && <OwnerHome />}
        <Outlet />
      </div>

      {/* Desktop Sidebar */}
      <div className="drawer-side  hidden lg:block">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="w-64  h-screen bg-white shadow-md sticky top-0">
          <OwnerSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default OwnerDashboard;
