import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../BreadCrumb/BreadCrumb";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";

export const WishList = () => {
  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  useEffect(() => {
    const fetchWishListData = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
        if (!loggedInUser || !loggedInUser.user?.displayName) {
          console.error("No user logged in or display name missing");
          setLoading(false);
          return;
        }

        const ordersRef = doc(db, "users", loggedInUser.user.displayName);
        const getOrdersData = await getDoc(ordersRef);

        if (getOrdersData.exists()) {
          const data = getOrdersData.data();
          setWishList(data.wishList || []);
        } else {
          console.log("No orders found for the user.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishListData();
  }, []);

  console.log(wishList);

  // const cartItems = [
  //   {
  //     id: 1,
  //     image:
  //       "https://codeskdhaka.com/html/dairypress-prev/dairypress/assets/img/product/wishlist/02.png",
  //     title: "Organic Full Cream Milk",
  //     price: 20.0,
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://codeskdhaka.com/html/dairypress-prev/dairypress/assets/img/product/wishlist/01.png",
  //     title: "Organic Fresh Milk",
  //     price: 24.0,
  //   },
  // ];

  return (
    <>
      <BreadCrumb
        title="WishList"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Farm" }]}
      />

      <div className="overflow-x-auto p-6">
        <table className=" m-auto min-w-[90%] border border-gray-300 text-sm">
          <thead className="bg-white text-black border-b">
            <tr className="text-left">
              <th className="py-4 px-6 font-semibold">Images</th>
              <th className="py-4 px-6 font-semibold">Product</th>
              <th className="py-4 px-6 font-semibold">Price</th>
              <th className="py-4 px-6 font-semibold">Add to cart</th>
              <th className="py-4 px-6 font-semibold">Remove</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {wishList.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6">
                  <img
                    src={item.image}
                    alt={item.name || item.breed}
                    className="h-24 w-[50%] rounded-[50%] object-contain"
                  />
                </td>
                <td className="py-4 px-6">{item.name || item.breed}</td>
                <td className="py-4 px-6">{item.price}</td>

                <td className="py-4 px-6">
                  <button
                    className=" bg-[radial-gradient(circle,#f7a974,#9e673d)]
 text-white text-xs font-bold px-6 py-2 rounded-md hover:bg-green-700"
                  >
                    ADD TO CART
                  </button>
                </td>
                <td className="py-4 px-6 text-xl text-black cursor-pointer hover:text-red-600">
                  ×
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
