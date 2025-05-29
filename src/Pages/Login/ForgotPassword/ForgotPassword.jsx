import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setEmail("");
      toast.success(
        "If the email exists, you will receive a password reset link.",
        {
          onClose: () => navigate("/login"),
        }
      );
    } catch (err) {
      toast.error(err.message);
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
          🐄 Reset Password
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
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-full my-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
