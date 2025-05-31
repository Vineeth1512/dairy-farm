import React from "react";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";

const OwnerDashboard = () => {
  return (
    <div className="drawer lg:drawer-open h-screen">
      {/* Drawer Toggle for Mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content p-6 bg-base-200">
        {/* Mobile toggle button */}
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-primary drawer-button lg:hidden mb-4"
        >
          Open Menu
        </label>

        <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <OwnerSidebar />
      </div>
    </div>
  );
};

export default OwnerDashboard;
