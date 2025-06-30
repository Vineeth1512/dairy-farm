import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/FirebaseConfiguration";

export const useUserData = () => {
  const [wishListCount, setwishListCount] = useState(0);
  const [cartCount, setCartCount] = useState([]);
  const [wishList, setWishList] = useState([]);

  const fetchUserData = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    if (!loggedInUser) {
      setwishListCount(0);
      setCartCount(0);
      return;
    }

    try {
      const userRef = doc(db, "users", loggedInUser.user.displayName);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      setwishListCount(data?.wishList?.length || 0);
      setCartCount(data?.cart || []);
      setWishList(data?.wishList || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  return {
    wishListCount,
    cartCount,
    wishList,
    setwishListCount,
    setCartCount,
    setWishList,
    fetchUserData,
  };
};
