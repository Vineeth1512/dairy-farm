import React, { useEffect, useState } from "react";
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
import AllMilkProducts from "./Components/Dashboard/OwnerDashboard/AllMilkProducts/AllMilkProducts";
import AddMilkProducts from "./Components/Dashboard/OwnerDashboard/AddMilkProducts/AddMilkProducts";
import { Cattles } from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/Cattles";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./Config/FirebaseConfiguration";
import { Milk } from "./Components/Dashboard/UserDashboard/DisplayProducts/Milk/Milk";
import { MilkItems } from "./Components/Dashboard/UserDashboard/DisplayProducts/MilkItems/MilkItems";
import SingleCattle from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/SingleCattle";

const App = () => {
  const [cattle, setCattle] = useState([]);
  const [milk, setMilk] = useState([]);
  const [milkItems, setMilkItems] = useState([]);

  const [wishListCount, SetWishListCount] = useState(0);
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

    console.log(loggedInUser, "From App jsx");

    const fetchAllData = async () => {
      try {
        const dataDoc = collection(db, "owners");
        const animalData = await getDocs(dataDoc);
        let milkData = [];
        let cattleData = [];
        let milkProductData = [];
        animalData.docs.map((doc) => {
          let singleMilkDoc = doc.data().milk || [];
          let singleCattleDoc = doc.data().animals || [];
          let singleProductsDoc = doc.data().products || [];
          singleMilkDoc.map((item) => {
            milkData.push(item);
          });
          singleCattleDoc.map((cattle) => {
            cattleData.push(cattle);
          });
          singleProductsDoc.map((product) => {
            milkProductData.push(product);
          });

          setCattle(cattleData);
          setMilk(milkData);
          setMilkItems(milkProductData);
        });
        const usersData = await getDoc(
          doc(db, "users", loggedInUser.user.displayName)
        );
        console.log(usersData.data(), "Data...........");
        const wishCount = usersData.data().wishList.length;
        SetWishListCount(wishCount);
        console.log(milkData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllData();
  }, []);

  return (
    <>
      <Navbar wishListCount={wishListCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/ownerDashboard" element={<OwnerDashboard />}>
          <Route path="addAnimal" element={<AddAnimal />} />
          <Route path="allAnimals" element={<AllAnimals />} />
          <Route path="addMilk" element={<AddMilk />} />
          <Route path="addMilkProduct" element={<AddMilkProducts />} />
          <Route path="allMilk" element={<AllMilkItems />} />
          <Route path="allMilkProducts" element={<AllMilkProducts />} />
        </Route>
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route
          path="/cattle"
          element={
            <Cattles cattle={cattle} SetWishListCount={SetWishListCount} />
          }
        />
        <Route
          path="/singleCattle/:id"
          element={<SingleCattle singleCattle={cattle} />}
        />
        <Route path="/milk" element={<Milk milk={milk} />} />
        <Route path="/products" element={<MilkItems milkItems={milkItems} />} />
      </Routes>
    </>
  );
};

export default App;
