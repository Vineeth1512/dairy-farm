import React from "react";
import { Link, useLocation } from "react-router-dom";

const OwnerSidebar = () => {
  const { pathname } = useLocation();

  const isActive = (route) => pathname.includes(route);

  return (
    <>
      <div className="menu p-4 w-64 min-h-full bg-white shadow-md border-r border-gray-200">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Owner Avatar"
            className="w-20 h-20 rounded-full border-4 border-primary shadow-lg mb-2"
          />
          <h2 className="text-lg font-semibold text-gray-700">Edit Profile</h2>
        </div>

        {/* Navigation Buttons */}
        <ul className="space-y-2 w-full">
          <li>
            <Link
              to="/ownerDashboard"
              className={`btn w-full text-left justify-start ${
                isActive("ownerDashboard")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="addAnimal"
              className={`btn w-full text-left justify-start ${
                isActive("addAnimal")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              ➕ Add Animal
            </Link>
          </li>
          <li>
            <Link
              to="addMilk"
              className={`btn w-full text-left justify-start ${
                isActive("addMilk")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              ➕ Add Milk
            </Link>
          </li>
          <li>
            <Link
              to="addMilkProduct"
              className={`btn w-full text-left justify-start ${
                isActive("addMilkProduct")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              ➕ Add Milk Product
            </Link>
          </li>
          <li>
            <Link
              to="allAnimals"
              className={`btn w-full text-left justify-start ${
                isActive("allAnimals")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              🐄 View All Animals
            </Link>
          </li>
          <li>
            <Link
              to="allMilk"
              className={`btn w-full text-left justify-start ${
                isActive("allMilk")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              🐄 View All Milk Items
            </Link>
          </li>
          <li>
            <Link
              to="allMilkProducts"
              className={`btn w-full text-left justify-start ${
                isActive("allMilkProducts")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              🐄 View All Milk Products
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default OwnerSidebar;
