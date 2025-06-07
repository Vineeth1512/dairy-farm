import React, { useState } from "react";
import logo from "../../assets/images/DairyLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Config/FirebaseConfiguration";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Logout from "../Logout/Logout";
import { AiOutlineHeart } from "react-icons/ai";

const Navbar = ({ wishListCount }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const loggedInOwner =
    JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
    JSON.parse(localStorage.getItem("userLoggedIn"));
  console.log(loggedInOwner);
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));

  //const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
  //console.log(loggedInUser);

  const handleLogout = async (e) => {
    console.log("clicked logout");

    e.preventDefault();

    try {
      await signOut(auth);
      localStorage.removeItem("ownerLoggedIn");
      localStorage.removeItem("userLoggedIn");
      // toast.success("SignedOut Successfully");
      setShowModal(false);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="drawer z-50 sticky top-0 ">
        <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar  shadow-md px-6 flex justify-between items-center gap-8 text-[#fff]  bg-[radial-gradient(circle,#f7a974,#9e673d)]">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-6">
              {/* Hamburger (Mobile only) */}
              <label htmlFor="nav-drawer" className="btn btn-ghost md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Dairy Logo" className="h-10" />
                <span className="text-xl font-bold text-[#fff]">
                  Dairy Farm
                </span>
              </Link>

              {/* Navigation Links (Desktop only) */}
              <div className="hidden md:flex gap-10 text-[#fff] font-medium ml-4">
                <Link to="/" className="hover:text-green-600 ">
                  Home
                </Link>
                <Link to="/cattle" className="hover:text-green-600">
                  Cattle
                </Link>
                <Link to="/milk" className="hover:text-green-600">
                  Milk
                </Link>
                <Link to="/products" className="hover:text-green-600">
                  Products
                </Link>
                {(userLoggedIn && (
                  <Link to={`/userDashboard`} className="hover:text-green-600">
                    Dashboard
                  </Link>
                )) ||
                  (loggedInOwner && (
                    <Link
                      to={`/ownerDashboard`}
                      className="hover:text-green-600"
                    >
                      Dashboard
                    </Link>
                  ))}
              </div>
            </div>

            {/* Center: Search bar (Desktop only) */}
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered h-8 w-[300px]"
              />
            </div>

            {loggedInOwner ? (
              <>
                <span className="hidden md:block font-semibold">
                  Hello,{" "}
                  {loggedInOwner?.name ||
                    loggedInOwner?.user.displayName ||
                    "User"}
                  !
                </span>
                <div className="hidden md:block  dropdown dropdown-end ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="User Avatar"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow  rounded-box w-52 bg-[#9c8f86]">
                    <li>
                      <a>Profile</a>
                    </li>
                    <li>
                      {/* <Logout /> */}
                      <button onClick={() => setShowModal(true)}>Logout</button>
                    </li>
                    <li>
                      <a>Settings</a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost font-semibold">
                  Login
                </Link>
              </>
            )}

            {/* Right: Login, Cart, Avatar */}
            {userLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17
                      m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="badge badge-sm indicator-item">0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <AiOutlineHeart className="h-6 w-6 text-white" />
                      <span className="badge badge-sm indicator-item">
                        {wishListCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Drawer Side Menu (Mobile Only) */}
        <div className="drawer-side">
          <label htmlFor="nav-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} className="h-10" alt="Dairy Logo" />
              <span className="text-xl font-bold text-green-700">
                Dairy Farm
              </span>
            </div>

            {/* Search bar (Mobile) */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-full"
              />
            </div>

            {/* Links */}
            <li>
              <Link to="/" className="hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cattle" className="hover:text-green-600">
                Cattle
              </Link>
            </li>
            <li>
              <Link to="/milk" className="hover:text-green-600">
                Milk
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-green-600">
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-600">
                Dashboard
              </Link>
            </li>

            <div className="divider"></div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Profile"
                  />
                </div>
              </div>
              <span className="hidden md:block font-semibold">
                Hello,{" "}
                {loggedInOwner?.name ||
                  loggedInOwner?.user.displayName ||
                  "User"}
                !
              </span>
            </div>

            <li>
              <a>Profile</a>
            </li>
            <li>
              <button onClick={() => setShowModal(true)}>Logout</button>
            </li>
            <li>
              <a>Settings</a>
            </li>

            <div className="divider"></div>

            {/* Cart Section */}
            <div className="bg-white shadow p-3 rounded-lg">
              <div className="font-bold mb-1">Cart</div>
              <div className="text-sm mb-2">8 items - $999</div>
              <button className="btn btn-sm btn-primary w-full">
                View Cart
              </button>
            </div>
          </ul>
        </div>
      </div>
      <Logout
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
