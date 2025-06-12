import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";

export const useProfile = () => useContext(AuthContext);
