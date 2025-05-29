import React, { useState } from "react";
import ShowPassword from "../../Components/ShowPassword/ShowPassword";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../../Config/FirebaseConfiguration";
import { db } from "../../Config/FirebaseConfiguration";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import GuestLogin from "./GuestLogin";

const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();

    if (!loginDetails.email && !loginDetails.password) {
      toast.error("Please Fill All Fields");
      return;
    }

    console.log(loginDetails);

    try {
      const loggedInUser = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );
      toast.success("LoggedIn Successfully...");

      const ownersData = await getDoc(
        doc(db, "owners", loggedInUser.user.displayName)
      );
      console.log(ownersData);

      const usersData = await getDoc(
        doc(db, "users", loggedInUser.user.displayName)
      );
      console.log(usersData);

      let loggedInUserData;
      if (ownersData.exists()) {
        loggedInUserData = ownersData.data();
        localStorage.setItem("ownerLoggedIn", JSON.stringify(loggedInUser));
      } else if (usersData.exists) {
        loggedInUserData = usersData.data();
        localStorage.setItem("userLoggedIn", JSON.stringify(loggedInUser));
      }
      navigate(`/${loggedInUserData.role}Dashboard`);

      console.log(loggedInUserData);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://demo.htmlcodex.com/2616/dairy-website-template/img/carousel-1.jpg')`,
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          🐄 Dairy Farm Login
        </h2>
        <form>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-green-700 font-semibold">
                Email
              </span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="input input-bordered"
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-green-700 font-semibold">
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

          <p className="mt-4 text-sm tex-left text-gray-600">
            <Link
              to={"/forgotPassword"}
              className="text-green-700 font-semibold hover:underline"
            >
              Forgot Password
            </Link>
          </p>

          <button
            type="submit"
            className="btn btn-success w-full my-2"
            onClick={handleLoginFormSubmit}
          >
            Login
          </button>
          <GuestLogin />
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-700 font-semibold hover:underline"
          >
            SignUp here
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
