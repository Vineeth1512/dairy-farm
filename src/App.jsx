import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Components/Home/Home";
import Signup from "./Pages/Signup/Signup";
import OwnerDashboard from "./Components/Dashboard/OwnerDashboard/OwnerDashboard";
import UserDashboard from "./Components/Dashboard/UserDashboard/UserDashboard";
import ForgotPassword from "./Pages/Login/ForgotPassword/ForgotPassword";
import AddAnimal from "./Components/Dashboard/OwnerDashboard/AddAnimal/AddAnimal";
import AllAnimals from "./Components/Dashboard/OwnerDashboard/AllAnimals/AllAnimals";
import AddMilk from "./Components/Dashboard/OwnerDashboard/AddMilk/AddMilk";
import AllMilkItems from "./Components/Dashboard/OwnerDashboard/AllMilkItems/AllMilkItems";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/ownerDashboard" element={<OwnerDashboard />}>
          <Route path="addAnimal" element={<AddAnimal />} />
          <Route path="allAnimals" element={<AllAnimals />} />
          <Route path="allMilk" element={<AllMilkItems />} />
        </Route>
        <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

export default App;
