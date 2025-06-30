import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import profilePic from "../../assets/images/profilePic.webp";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Logout from "../Logout/Logout";
import { AiOutlineHeart } from "react-icons/ai";
import EditProfile from "../Modals/EditProfile";
import { useProfile } from "../../hooks/useProfile";
import { auth } from "../../Config/FirebaseConfiguration";

const Navbar = ({
  wishListCount,
  setwishListCount,
  cartCount,
  setCartCount,
}) => {
  const { loginData, fetchLoginData } = useProfile();
  const navigate = useNavigate();

  console.log(loginData);

  const [showModal, setShowModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const loggedInOwner =
    JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
    JSON.parse(localStorage.getItem("userLoggedIn"));
  console.log(loggedInOwner);
  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
  console.log(userLoggedIn);

  const handleLogout = async (e) => {
    console.log("clicked logout");

    e.preventDefault();

    try {
      await signOut(auth);
      localStorage.removeItem("ownerLoggedIn");
      localStorage.removeItem("userLoggedIn");
      // toast.success("SignedOut Successfully");
      setShowModal(false);
      setwishListCount(0);
      setCartCount(0);
      fetchLoginData(null);
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
                <img
                  src={logo}
                  alt="Dairy Logo"
                  className=" hidden  md:block h-16"
                />
                <span className="text-xl font-bold text-[#fff]">
                  Dairy Farm
                </span>
              </Link>

              {/* Navigation Links (Desktop only) */}
              <div className="hidden md:flex gap-10 text-[#fff] font-medium ml-4">
                <Link to="/" className="hover:text-[#9e673d] ">
                  Home
                </Link>
                <Link to="/cattle" className="hover:text-[#9e673d]">
                  Cattle
                </Link>
                <Link to="/milk" className="hover:text-[#9e673d]">
                  Milk
                </Link>
                <Link to="/products" className="hover:text-[#9e673d]">
                  Products
                </Link>
                {(userLoggedIn && (
                  <Link to={`/userDashboard`} className="hover:text-[#9e673d]">
                    Dashboard
                  </Link>
                )) ||
                  (loggedInOwner && (
                    <Link
                      to={`/ownerDashboard`}
                      className="hover:text-[#9e673d]"
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

            {/* Right: Login, Cart, Avatar */}
            {userLoggedIn && (
              <div className=" md:flex items-center gap-4">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <Link to={"/cart"}>
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
                        <span className="badge badge-sm indicator-item">
                          {cartCount.length}
                        </span>
                      </div>{" "}
                    </Link>
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
                    <Link to={"/wishList"}>
                      <div className="indicator">
                        <AiOutlineHeart className="h-6 w-6 text-white" />
                        <span className="badge badge-sm indicator-item">
                          {wishListCount}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {loggedInOwner ? (
              <>
                <div className="hidden md:block  dropdown dropdown-end ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        src={loginData?.profile || profilePic}
                        alt="Profile"
                      />
                    </div>
                  </div>
                  <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow  rounded-box w-52 bg-[#9c8f86]">
                    <li>
                      <button>
                        {loggedInOwner?.name ||
                          loggedInOwner?.user.displayName ||
                          loginData?.name}
                        !
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setEditProfileModal(true)}>
                        Profile
                      </button>
                    </li>
                    {userLoggedIn && (
                      <li>
                        <Link to={"/orders"}>Orders</Link>
                      </li>
                    )}
                    <li>
                      <button onClick={() => setShowModal(true)}>Logout</button>
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
              <Link to="/" className="hover:text-[#9e673d]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cattle" className="hover:text-[#9e673d]">
                Cattle
              </Link>
            </li>
            <li>
              <Link to="/milk" className="hover:text-[#9e673d]">
                Milk
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#9e673d]">
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#9e673d]">
                Dashboard
              </Link>
            </li>

            <div className="divider"></div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={loginData?.profile || profilePic} alt="Profile" />
                </div>
              </div>
              {/* loggedInOwner?.name || */}
              <span className="hidden md:block font-semibold">
                Hello, {loggedInOwner?.user.displayName || "User"}!
              </span>
            </div>

            <li>
              <button onClick={() => setEditProfileModal(true)}>Profile</button>
            </li>

            {userLoggedIn && (
              <li>
                <Link to={"/orders"}>Orders</Link>
              </li>
            )}
            <li>
              <button onClick={() => setShowModal(true)}>Logout</button>
            </li>

            <div className="divider"></div>
          </ul>
        </div>
      </div>
      <Logout
        showModal={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
      />

      <EditProfile
        userLoggedIn={loggedInOwner}
        editProfileModal={editProfileModal}
        onCancel={() => setEditProfileModal(false)}
      />
    </>
  );
};

export default Navbar;
