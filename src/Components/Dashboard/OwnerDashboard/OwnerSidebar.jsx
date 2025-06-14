import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Milk, Package, PawPrint } from "lucide-react";

const OwnerSidebar = () => {
  const { pathname } = useLocation();
  const isActive = (route) => pathname.includes(route);

  const linkClasses = (route) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition duration-200 ${
      isActive(route)
        ? "bg-[radial-gradient(circle,#f7a974,#9e673d)] text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="menu p-4 bg-white">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-[#9e673d] shadow-lg overflow-hidden mb-2">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Owner Avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-lg font-semibold text-[#6e4327]">Edit Profile</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        <Link to="/ownerDashboard" className={linkClasses("ownerDashboard")}>
          <Home size={18} /> Dashboard
        </Link>

        <Link to="addAnimal" className={linkClasses("addAnimal")}>
          <Plus size={18} /> Add Animal
        </Link>

        <Link to="addMilk" className={linkClasses("addMilk")}>
          <Milk size={18} /> Add Milk
        </Link>

        <Link to="addMilkProduct" className={linkClasses("addMilkProduct")}>
          <Package size={18} /> Add Milk Product
        </Link>

        <Link to="allAnimals" className={linkClasses("allAnimals")}>
          <PawPrint size={18} /> View All Animals
        </Link>

        <Link to="allMilk" className={linkClasses("allMilk")}>
          <Milk size={18} /> View All Milk Items
        </Link>

        <Link to="allMilkProducts" className={linkClasses("allMilkProducts")}>
          <Package size={18} /> View All Milk Products
        </Link>
      </nav>
    </div>
  );
};

export default OwnerSidebar;
