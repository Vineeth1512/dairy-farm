import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-[80vh] bg-gradient-to-r from-yellow-100 to-white font-poppins">
      <div className="text-center px-6">
        <h1 className="text-[8rem] font-extrabold text-[#6e4327]">404</h1>
        <h2 className="text-4xl text-gray-800 mb-4 font-semibold">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn-error">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
