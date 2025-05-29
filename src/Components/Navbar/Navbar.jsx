import React from "react";
import logo from "../../assets/images/DairyLogo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="drawer z-50 sticky top-0">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar bg-white shadow-md px-6 flex justify-between items-center gap-8">
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
              <span className="text-xl font-bold text-green-700">Dairy Farm</span>
            </Link>

            {/* Navigation Links (Desktop only) */}
            <div className="hidden md:flex gap-10 text-gray-700 font-medium ml-4">
              <Link to="/" className="hover:text-green-600">Home</Link>
              <Link to="/cattle" className="hover:text-green-600">Cattle</Link>
              <Link to="/milk" className="hover:text-green-600">Milk</Link>
              <Link to="/products" className="hover:text-green-600">Products</Link>
              <Link to="/contact" className="hover:text-green-600">Contact</Link>
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
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="btn btn-ghost">Login</Link>

            {/* Cart */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17
                      m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div className="card dropdown-content z-[1] mt-3 w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">View cart</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Profile</a></li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Drawer Side Menu (Mobile Only) */}
      <div className="drawer-side">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} className="h-10" alt="Dairy Logo" />
            <span className="text-xl font-bold text-green-700">Dairy Farm</span>
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
          <li><Link to="/" className="hover:text-green-600">Home</Link></li>
          <li><Link to="/cattle" className="hover:text-green-600">Cattle</Link></li>
          <li><Link to="/milk" className="hover:text-green-600">Milk</Link></li>
          <li><Link to="/products" className="hover:text-green-600">Products</Link></li>
          <li><Link to="/contact" className="hover:text-green-600">Contact</Link></li>

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
            <span className="font-semibold">Hello, User!</span>
          </div>

          <li><a>Profile</a></li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>

          <div className="divider"></div>

          {/* Cart Section */}
          <div className="bg-white shadow p-3 rounded-lg">
            <div className="font-bold mb-1">Cart</div>
            <div className="text-sm mb-2">8 items - $999</div>
            <button className="btn btn-sm btn-primary w-full">View Cart</button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
