import React, { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

const ShowPassword = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <div className="relative">
      <input
        type={showPassword ? "password" : "text"}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="input input-bordered w-full pr-10"
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-500"
      >
        {showPassword ? <FaRegEye /> : <FaEyeSlash />}
      </span>
    </div>
  );
};

export default ShowPassword;
