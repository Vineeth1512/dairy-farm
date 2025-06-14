import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Plus,
  Milk,
  Package,
  PawPrint,
  ClipboardList,
  ListChecks,
} from "lucide-react";

const BottomNav = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", icon: <Home size={20} />, to: "/ownerDashboard" },
    { label: "Animal", icon: <Plus size={20} />, to: "addAnimal" },
    { label: "Milk", icon: <Plus size={20} />, to: "addMilk" },
    { label: "Product", icon: <Plus size={20} />, to: "addMilkProduct" },
    { label: "ViewAnimal", icon: <PawPrint size={20} />, to: "allAnimals" },
    { label: "ViewMilk", icon: <Milk size={20} />, to: "allMilk" },
    { label: "ViewPro", icon: <ListChecks size={20} />, to: "allMilkProducts" },
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-md flex justify-between items-center px-1 py-2 overflow-x-auto">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className={`flex flex-col items-center text-[11px] px-2 ${
            pathname.includes(item.to)
              ? "text-[#6e4327] font-semibold"
              : "text-gray-500"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
