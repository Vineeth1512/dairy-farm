// // src/Context/AuthProvider.jsx
// import React, { createContext, useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../Config/FirebaseConfiguration";

import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../Config/FirebaseConfiguration";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [loginData, setLoginData] = useState(null);

//   const fetchLoginData = async () => {
//     const loggedInOwner =
//       JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
//       JSON.parse(localStorage.getItem("userLoggedIn"));

//     if (!loggedInOwner?.user?.displayName) {
//       setLoginData(null);
//       return;
//     }

//     try {
//       const docRef = doc(db, "users", loggedInOwner.user.displayName);
//       const userDoc = await getDoc(docRef);
//       setLoginData(userDoc.data());
//     } catch (error) {
//       console.error("Error fetching login data:", error);
//       setLoginData(null);
//     }
//   };

//   useEffect(() => {
//     fetchLoginData(); // Initial fetch
//     // Listen to localStorage changes
//     window.addEventListener("storage", fetchLoginData);
//     return () => window.removeEventListener("storage", fetchLoginData);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ loginData, fetchLoginData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(null);

  const fetchLoginData = async () => {
    const loggedInOwner =
      JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
      JSON.parse(localStorage.getItem("userLoggedIn"));

    console.log(loggedInOwner, "from Auth Provider");

    if (!loggedInOwner?.user?.displayName) {
      setLoginData(null);
      return;
    }

    try {
      const role = localStorage.getItem("ownerLoggedIn") ? "owners" : "users";
      const docRef = doc(db, role, loggedInOwner.user.displayName);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        setLoginData(userDoc.data());
      } else {
        setLoginData(null);
      }
    } catch (error) {
      console.error("Error fetching login data:", error);
      setLoginData(null);
    }
  };

  useEffect(() => {
    fetchLoginData();
    window.addEventListener("storage", fetchLoginData);
    return () => window.removeEventListener("storage", fetchLoginData);
  }, []);

  return (
    <AuthContext.Provider value={{ loginData, fetchLoginData }}>
      {children}
    </AuthContext.Provider>
  );
};
