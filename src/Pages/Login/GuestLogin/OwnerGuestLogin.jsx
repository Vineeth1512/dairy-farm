import React from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OwnerGuestLogin = () => {
  const navigate = useNavigate();
  const handelGuestLogin = async (e) => {
    e.preventDefault();
    try {
      let owner = auth.currentUser;
      if (!owner) {
        const guestOwnerCredential = await signInAnonymously(auth);
        owner = guestOwnerCredential.user;
      }

      const guestOwnerData = {
        name: "Guest Owner",
        email: "guestowner@gmail.com",
        role: "owner",
        createdAt: Date.now(),
      };

      const docRef = doc(db, "owners", owner.uid);
      const docSnop = await getDoc(docRef);

      if (!docSnop.exists()) {
        await setDoc(docRef, guestOwnerData);
      }
      localStorage.setItem("ownerLoggedIn", JSON.stringify(guestOwnerData));
      toast.success("Guest Owner Logged In Successfully...");
      setTimeout(() => {
        navigate("/ownerDashboard");
      }, 1500);
    } catch (err) {
      console.log(err);

      toast.error(err.message);
    }
  };
  return (
    <>
      <button
        type="submit"
        className="btn btn-success w-full my-2"
        onClick={handelGuestLogin}
      >
        Guest Login as Owner
      </button>
      <ToastContainer />
    </>
  );
};

export default OwnerGuestLogin;
