import React from "react";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth, db } from "../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../hooks/useProfile";

const UserGuestLogin = ({ fetchWishListCount, className }) => {
  const { fetchLoginData } = useProfile();

  const navigate = useNavigate();
  const handelGuestLogin = async (e) => {
    e.preventDefault();

    try {
      let user = auth.currentUser;

      const guestOwnerCredential = await signInAnonymously(auth);
      user = guestOwnerCredential.user;

      await updateProfile(user, {
        displayName: "Guest-User",
      });

      const guestUserData = {
        name: "Guest User",
        email: "guestuser@gmail.com",
        role: "user",
        profile: "",
        createdAt: Date.now(),
      };

      const docRef = doc(db, "users", user.displayName);
      const docSnop = await getDoc(docRef);

      if (!docSnop.exists()) {
        await setDoc(docRef, guestUserData);
      }

      localStorage.setItem(
        "userLoggedIn",
        JSON.stringify(guestOwnerCredential)
      );
      toast.success("Guest User Logged In Successfully...");
      await fetchWishListCount();
      await fetchLoginData();
      setTimeout(() => {
        navigate("/userDashboard");
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
        className={`btn bg-[radial-gradient(circle,#f7a974,#9e673d)] text-[#000] w-full my-2 ${className}`}
        onClick={handelGuestLogin}
      >
        Guest Login as User
      </button>
      <ToastContainer />
    </>
  );
};

export default UserGuestLogin;
