import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth, db } from "../../Config/FirebaseConfiguration.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import ShowPassword from "../../Components/ShowPassword/ShowPassword.jsx";
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(signupDetails);

    if (!signupDetails.role) {
      toast.error("Please select a role.");
      return;
    }

    if (signupDetails.password !== signupDetails.confirmPassword) {
      toast.error("Password and Confirm Password does not match...");
      return;
    }

    try {
      const createUser = await createUserWithEmailAndPassword(
        auth,
        signupDetails.email,
        signupDetails.password
      );
      updateProfile(createUser.user, {
        displayName: signupDetails.name,
      });

      const dataDoc = doc(
        db,
        `${signupDetails.role}s`,
        // createUser.user.displayName
        signupDetails.name
      );

      await setDoc(dataDoc, {
        name: signupDetails.name,
        email: signupDetails.email,
        role: signupDetails.role,
        createdAt: Date.now(),
      });

      toast.success(
        `${signupDetails.role.toUpperCase()} SignUp Successfully..`
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    setLoading(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://demo.htmlcodex.com/2616/dairy-website-template/img/carousel-1.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#6e4327] mb-6">
          🐄Sign Up
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-control mb-4 text-[#6e4327]">
            <label className="label">
              <span className="label-text text-[#6e4327] font-semibold">
                Full Name
              </span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered"
              required
              onChange={(e) =>
                setSignupDetails({ ...signupDetails, name: e.target.value })
              }
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-[#6e4327] font-semibold">
                Email
              </span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="input input-bordered"
              required
              onChange={(e) =>
                setSignupDetails({ ...signupDetails, email: e.target.value })
              }
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-[#6e4327] font-semibold">
                Password
              </span>
            </label>
            <ShowPassword
              value={signupDetails.password}
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-[#6e4327] font-semibold">
                Confirm Password
              </span>
            </label>
            <ShowPassword
              value={signupDetails.confirmPassword}
              onChange={(e) =>
                setSignupDetails({
                  ...signupDetails,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-[#6e4327] font-semibold">
                Role
              </span>
            </label>
            <select
              className="select select-bordered"
              onChange={(e) =>
                setSignupDetails({ ...signupDetails, role: e.target.value })
              }
            >
              <option value={""}>Choose a Role</option>
              <option value="owner">Owner</option>
              <option value={"user"}>User</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn  w-full bg-[#6e4327]"
            disabled={loading}
          >
            {loading ? "Registering" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#6e4327] font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
