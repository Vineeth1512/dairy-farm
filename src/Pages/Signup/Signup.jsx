import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { auth, db } from "../../Config/FirebaseConfiguration.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import logoImage from "../../assets/images/logo.png";
import ShowPassword from "../../Components/ShowPassword/ShowPassword.jsx";
import CustomButton from "../../Components/CustomButton/CustomButton.jsx";
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
        profile:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
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
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-[#6e4327]">
                Login to your Account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                See what is going on with your business
              </p>
            </div>

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
                    setSignupDetails({
                      ...signupDetails,
                      email: e.target.value,
                    })
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

              {/* <button
            type="submit"
            className="btn  w-full bg-[#6e4327]"
            disabled={loading}
          >
            {loading ? "Registering" : "Register"}
          </button> */}
              <CustomButton
                type="submit"
                className="btn  w-full bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000]"
                disabled={loading}
              >
                {" "}
                {loading ? "Registering" : "Register"}
              </CustomButton>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-[#6e4327] font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>

    // <div
    //   className="min-h-screen flex items-center justify-center bg-cover bg-center"
    //   style={{
    //     backgroundImage:
    //       "url('https://demo.htmlcodex.com/2616/dairy-website-template/img/carousel-1.jpg')",
    //   }}
    // >
    //   <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-lg w-full max-w-md">
    //     <h2 className="text-3xl font-bold text-center text-[#6e4327] mb-6">
    //       🐄Sign Up
    //     </h2>
    //     <form onSubmit={handleFormSubmit}>
    //       <div className="form-control mb-4 text-[#6e4327]">
    //         <label className="label">
    //           <span className="label-text text-[#6e4327] font-semibold">
    //             Full Name
    //           </span>
    //         </label>
    //         <input
    //           type="text"
    //           placeholder="John Doe"
    //           className="input input-bordered"
    //           required
    //           onChange={(e) =>
    //             setSignupDetails({ ...signupDetails, name: e.target.value })
    //           }
    //         />
    //       </div>

    //       <div className="form-control mb-4">
    //         <label className="label">
    //           <span className="label-text text-[#6e4327] font-semibold">
    //             Email
    //           </span>
    //         </label>
    //         <input
    //           type="email"
    //           placeholder="john@example.com"
    //           className="input input-bordered"
    //           required
    //           onChange={(e) =>
    //             setSignupDetails({ ...signupDetails, email: e.target.value })
    //           }
    //         />
    //       </div>

    //       <div className="form-control mb-6">
    //         <label className="label">
    //           <span className="label-text text-[#6e4327] font-semibold">
    //             Password
    //           </span>
    //         </label>
    //         <ShowPassword
    //           value={signupDetails.password}
    //           onChange={(e) =>
    //             setSignupDetails({
    //               ...signupDetails,
    //               password: e.target.value,
    //             })
    //           }
    //         />
    //       </div>
    //       <div className="form-control mb-6">
    //         <label className="label">
    //           <span className="label-text text-[#6e4327] font-semibold">
    //             Confirm Password
    //           </span>
    //         </label>
    //         <ShowPassword
    //           value={signupDetails.confirmPassword}
    //           onChange={(e) =>
    //             setSignupDetails({
    //               ...signupDetails,
    //               confirmPassword: e.target.value,
    //             })
    //           }
    //         />
    //       </div>

    //       <div className="form-control mb-6">
    //         <label className="label">
    //           <span className="label-text text-[#6e4327] font-semibold">
    //             Role
    //           </span>
    //         </label>
    //         <select
    //           className="select select-bordered"
    //           onChange={(e) =>
    //             setSignupDetails({ ...signupDetails, role: e.target.value })
    //           }
    //         >
    //           <option value={""}>Choose a Role</option>
    //           <option value="owner">Owner</option>
    //           <option value={"user"}>User</option>
    //         </select>
    //       </div>

    //       {/* <button
    //         type="submit"
    //         className="btn  w-full bg-[#6e4327]"
    //         disabled={loading}
    //       >
    //         {loading ? "Registering" : "Register"}
    //       </button> */}
    //       <CustomButton
    //         type="submit"
    //         className="btn  w-full bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000]"
    //         disabled={loading}
    //       >
    //         {" "}
    //         {loading ? "Registering" : "Register"}
    //       </CustomButton>
    //     </form>

    //     <p className="mt-4 text-sm text-center text-gray-600">
    //       Already have an account?{" "}
    //       <a
    //         href="/login"
    //         className="text-[#6e4327] font-semibold hover:underline"
    //       >
    //         Login here
    //       </a>
    //     </p>
    //   </div>
    //   <ToastContainer />
    // </div>
  );
};

export default Signup;
