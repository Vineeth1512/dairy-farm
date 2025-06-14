import React from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#fff] px-6 py-8 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Tagline */}
        <div className="text-center mb-6">
          {/* Logo Icon */}
          <img
            src={logo}
            alt="DairyFarm Logo"
            className="w-24 h-24 mx-auto mb-2 "
          />

          {/* Brand Name */}
          <h2 className="text-4xl font-extrabold text-white tracking-wide">
            Dairy<span className="text-[#5c2e22]">Farm</span>
          </h2>

          {/* Tagline / Quote */}
          <p className="text-base text-white/90 italic mt-2 px-4">
            "Delivering love in every drop — fresh from our farm to your
            family." 💖
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3  text-xl">
            <li>
              <Link to={"/"} className="hover:text-[#5c2e22]">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/products"} className="hover:text-[#5c2e22]">
                Products
              </Link>
            </li>
            <li>
              <Link to={"/cattle"} className="hover:text-[#5c2e22]">
                Cattles
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-[#5c2e22]">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3  text-xl">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-white" /> Hyderabad, India
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-white" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-white" /> hello@dairyfarm.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-5 text-white text-3xl">
            <a href="#">
              <FaFacebookF className="hover:text-yellow-800" />
            </a>
            <a href="#">
              <FaInstagram className="hover:text-yellow-800" />
            </a>
            <a href="#">
              <FaTwitter className="hover:text-yellow-800" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="mt-2 border-t border-white/40 pt-4 text-center text-sm md:text-xl text-white/80">
        © {new Date().getFullYear()} DairyFarm. Built with 🧡 by{" "}
        <span className="font-semibold">Vineeth Kumar</span>.
      </div>
    </footer>
  );
};

export default Footer;
