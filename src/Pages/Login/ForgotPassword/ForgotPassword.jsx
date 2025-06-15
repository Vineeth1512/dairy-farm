import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/images/logo.png";
import CustomButton from "../../../Components/CustomButton/CustomButton";

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
    <>
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
          <div className="w-full md:w-1/2 p-8 sm:p-10 mt-32">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-[#6e4327]">
                🐄 Reset Password
              </h2>
            </div>

            <form>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <CustomButton
                type="submit"
                className="btn bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000] w-full mb-4"
                onClick={handleSubmit}
              >
                Submit
              </CustomButton>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>

      {/* <div
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
      </div> */}
    </>
  );
};

export default ForgotPassword;
