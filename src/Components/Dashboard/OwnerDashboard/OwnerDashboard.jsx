import React from "react";
import OwnerSidebar from "./OwnerSidebar";
import { Outlet, Link } from "react-router-dom";

const OwnerDashboard = () => {
  return (
    // <div>
    //   <div>

    //   </div>
    //   <div></div>
    // </div>
    <>
      {/* <OwnerSidebar /> */}
      <div className=" flex h-96">
        <div className="dashboard-sidebar">
          <OwnerSidebar />
        </div>
        <div className="dashboard-content flex-grow-1 p-2 text-center">
          <h1>Owner Dashboard</h1>

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
