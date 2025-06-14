import React, { useState } from "react";
import ShowPassword from "../../Components/ShowPassword/ShowPassword";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth, db } from "../../Config/FirebaseConfiguration";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useProfile } from "../../Components/hooks/useProfile";
import OwnerGuestLogin from "./GuestLogin/OwnerGuestLogin";
import UserGuestLogin from "./GuestLogin/UserGuestLogin";
import CustomButton from "../../Components/CustomButton/CustomButton";
import logoImage from "../../assets/images/logo.png";

const Login = ({ fetchWishListCount }) => {
  const { fetchLoginData } = useProfile();
  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();

    if (!loginDetails.email || !loginDetails.password) {
      toast.error("Please Fill All Fields");
      return;
    }

    try {
      const loggedInUser = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );
      toast.success("Logged In Successfully");

      const ownersData = await getDoc(
        doc(db, "owners", loggedInUser.user.displayName)
      );
      const usersData = await getDoc(
        doc(db, "users", loggedInUser.user.displayName)
      );

      let loggedInUserData;
      if (ownersData.exists()) {
        loggedInUserData = ownersData.data();
        localStorage.setItem("ownerLoggedIn", JSON.stringify(loggedInUser));
      } else if (usersData.exists()) {
        loggedInUserData = usersData.data();
        localStorage.setItem("userLoggedIn", JSON.stringify(loggedInUser));
      }

      await fetchWishListCount();
      await fetchLoginData();

      setTimeout(() => navigate(`/${loggedInUserData.role}Dashboard`), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] px-4">
      <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left image section */}
        <div className="hidden md:block md:w-1/2 bg-[radial-gradient(circle,#f7a974,#9e673d)] p-8  flex-col justify-center items-center text-center">
          <img
            src={logoImage}
            alt="Illustration"
            className="w-full h-auto mb-6 rounded"
          />
          <h2 className="text-xl font-semibold text-[#6e4327] mb-2">
            Manage Your Dairy Smarter.
          </h2>
          <p className="text-sm text-gray-600">
            Buy, sell, and monitor cattle — all in one place. Start your dairy
            journey today!
          </p>
        </div>

        {/* Right login form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#6e4327]">
              Login to your Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              See what is going on with your business
            </p>
          </div>

          <form onSubmit={handleLoginFormSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-[#6e4327] font-semibold">
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="input input-bordered w-full"
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-[#6e4327] font-semibold">
                  Password
                </span>
              </label>
              <ShowPassword
                value={loginDetails.password}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span>Remember Me</span>
              </label>
              <Link
                to="/forgotPassword"
                className="text-[#6e4327] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <CustomButton
              type="submit"
              className="btn bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000] w-full mb-4"
            >
              Login
            </CustomButton>

            {/* Guest Login Buttons Side-by-Side */}
            <div className="flex flex-col sm:flex-row  justify-center">
              <OwnerGuestLogin className="w-full sm:w-auto flex-1" />
              <UserGuestLogin
                fetchWishListCount={fetchWishListCount}
                className="w-full sm:w-auto flex-1"
              />
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Not Registered Yet?{" "}
            <Link
              to="/signup"
              className="text-[#6e4327] font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
