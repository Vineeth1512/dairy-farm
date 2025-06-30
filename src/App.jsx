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
import AllMilkProducts from "./Components/Dashboard/OwnerDashboard/AllMilkProducts/AllMilkProducts";
import { AddMilkProducts } from "./Components/Dashboard/OwnerDashboard/AddMilkProducts/AddMilkProducts";
import { Cattles } from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/Cattles";
import { Milk } from "./Components/Dashboard/UserDashboard/DisplayProducts/Milk/Milk";
import { MilkItems } from "./Components/Dashboard/UserDashboard/DisplayProducts/MilkItems/MilkItems";
import SingleCattle from "./Components/Dashboard/UserDashboard/DisplayProducts/Cattles/SingleCattle";
import Cart from "./Components/Dashboard/UserDashboard/Cart/Cart";
import SingleMilk from "./Components/Dashboard/UserDashboard/DisplayProducts/Milk/SingleMilk";
import SingleProduct from "./Components/Dashboard/UserDashboard/DisplayProducts/MilkItems/SingleProduct";
import Orders from "./Components/Dashboard/UserDashboard/Orders/Orders";
import Footer from "./Components/Footer/Footer";
import { WishList } from "./Components/Dashboard/UserDashboard/WishList/WishList";
import { useOwnerData } from "./hooks/useOwnerData";
import { useUserData } from "./hooks/useUserData";
import ScrollToTopButton from "./Components/ScrollToTopButton/ScrollToTopButton";

const App = () => {
  // const [cattle, setCattle] = useState([]);
  // const [milk, setMilk] = useState([]);
  // const [milkItems, setMilkItems] = useState([]);

  // const [wishListCount, setwishListCount] = useState(0);
  // const [cartCount, setCartCount] = useState([]);

  // const [wishList, setWishList] = useState([]);

  // const fetchWishListCount = async () => {
  //   const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

  //   if (!loggedInUser) {
  //     setwishListCount(0);
  //     setCartCount(0);
  //     return;
  //   }
  //   try {
  //     const userRef = doc(db, "users", loggedInUser.user.displayName);
  //     const userSnap = await getDoc(userRef);
  //     const data = userSnap.data();
  //     setwishListCount(data?.wishList?.length || 0);
  //     setCartCount(data?.cart || []);
  //     setWishList(data?.wishList || []);
  //   } catch (err) {
  //     toast.error(err.message);
  //     console.log(err);

  //     setwishListCount(0);
  //     setCartCount(0);
  //   }
  // };
  // useEffect(() => {
  //   const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

  //   console.log(loggedInUser, "From App jsx");

  //   const fetchAllData = async () => {
  //     try {
  //       const dataDoc = collection(db, "owners");
  //       const animalData = await getDocs(dataDoc);
  //       let milkData = [];
  //       let cattleData = [];
  //       let milkProductData = [];
  //       animalData.docs.map((doc) => {
  //         let singleMilkDoc = doc.data().milk || [];
  //         let singleCattleDoc = doc.data().animals || [];
  //         let singleProductsDoc = doc.data().products || [];
  //         singleMilkDoc.map((item) => {
  //           milkData.push(item);
  //         });
  //         singleCattleDoc.map((cattle) => {
  //           cattleData.push(cattle);
  //         });
  //         singleProductsDoc.map((product) => {
  //           milkProductData.push(product);
  //         });

  //         setCattle(cattleData);
  //         setMilk(milkData);
  //         setMilkItems(milkProductData);
  //       });

  //       console.log(milkData);
  //       fetchWishListCount();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchAllData();
  // }, []);

  const { cattle, milk, milkItems } = useOwnerData(); //Custom Hook
  const {
    wishListCount,
    cartCount,
    wishList,
    setwishListCount,
    setCartCount,
    setWishList,
    fetchUserData,
  } = useUserData();

  return (
    <>
      <Navbar
        wishListCount={wishListCount}
        setwishListCount={setwishListCount}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login fetchWishListCount={fetchUserData} />}
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
            <Cattles cattle={cattle} setwishListCount={setwishListCount} />
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
          element={<Milk milk={milk} setwishListCount={setwishListCount} />}
        />
        <Route
          path="/products"
          element={
            <MilkItems
              milkItems={milkItems}
              setwishListCount={setwishListCount}
            />
          }
        />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/wishList"
          element={
            <WishList
              wishList={wishList}
              setWishList={setWishList}
              setwishListCount={setwishListCount}
              setCartCount={setCartCount}
            />
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
