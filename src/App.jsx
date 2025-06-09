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
import { AddMilkProducts } from "./Components/Dashboard/OwnerDashboard/AddMilkProducts/AddMilkProducts";
import { Cattles } from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/Cattles";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./Config/FirebaseConfiguration";
import { Milk } from "./Components/Dashboard/UserDashboard/DisplayProducts/Milk/Milk";
import { MilkItems } from "./Components/Dashboard/UserDashboard/DisplayProducts/MilkItems/MilkItems";
import SingleCattle from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/SingleCattle";
import { toast } from "react-toastify";
import Cart from "./Components/Dashboard/UserDashboard/Cart/Cart";
import SingleMilk from "./Components/Dashboard/UserDashboard/DisplayProducts/Milk/SingleMilk";
import SingleProduct from "./Components/Dashboard/UserDashboard/DisplayProducts/MilkItems/SingleProduct";

const App = () => {
  const [cattle, setCattle] = useState([]);
  const [milk, setMilk] = useState([]);
  const [milkItems, setMilkItems] = useState([]);

  const [wishListCount, SetWishListCount] = useState(0);
  const [cartCount, setCartCount] = useState([]);

  const fetchWishListCount = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

    if (!loggedInUser) {
      SetWishListCount(0);
      setCartCount(0);
      return;
    }
    try {
      const userRef = doc(db, "users", loggedInUser.user.displayName);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      SetWishListCount(data?.wishList?.length || 0);
      setCartCount(data?.cart || []);
    } catch (err) {
      toast.error(err.message);
      console.log(err);

      SetWishListCount(0);
      setCartCount(0);
    }
  };
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

        console.log(milkData);
        fetchWishListCount();
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllData();
  }, []);

  return (
    <>
      <Navbar
        wishListCount={wishListCount}
        SetWishListCount={SetWishListCount}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login fetchWishListCount={fetchWishListCount} />}
        />
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
          element={
            <SingleCattle singleCattle={cattle} setCartCount={setCartCount} />
          }
        />
        <Route
          path="/singleMilk/:id"
          element={<SingleMilk singleMilk={milk} setCartCount={setCartCount} />}
        />
        <Route
          path="/singleProduct/:id"
          element={
            <SingleProduct
              singleProduct={milkItems}
              setCartCount={setCartCount}
            />
          }
        />

        <Route
          path="/cart"
          element={<Cart cartItems={cartCount} setCartItems={setCartCount} />}
        />
        <Route
          path="/milk"
          element={<Milk milk={milk} SetWishListCount={SetWishListCount} />}
        />
        <Route
          path="/products"
          element={
            <MilkItems
              milkItems={milkItems}
              SetWishListCount={SetWishListCount}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
