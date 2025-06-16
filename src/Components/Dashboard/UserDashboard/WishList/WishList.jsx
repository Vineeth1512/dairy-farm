import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../BreadCrumb/BreadCrumb";
import { MdDelete } from "react-icons/md";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";

export const WishList = ({ wishList, setWishList, setwishListCount }) => {
  //const [loading, setLoading] = useState(true);
  const [wishListData, setWishListData] = useState([]);
  useEffect(() => {
    if (Array.isArray(wishList)) {
      setWishListData(wishList);
    } else {
      setWishListData([]);
    }
  }, [wishList]);

  console.log(wishListData);
  const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

  const handleDelete = async (deleteItem) => {
    if (confirm("Are you sure you want to delete?")) {
      const afterDeleteWidhList = wishList.filter(
        (item) => item.id !== deleteItem.id
      );
      const docRef = doc(db, "users", loggedInUser.user.displayName);
      await updateDoc(docRef, {
        wishList: afterDeleteWidhList,
      });
      setWishList(afterDeleteWidhList);
      setwishListCount(afterDeleteWidhList.length);
    }
  };
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
            {wishListData.map((item) => (
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
                <td className="py-4 px-6 text-xl text-center cursor-pointer hover:text-red-600">
                  <MdDelete onClick={() => handleDelete(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
