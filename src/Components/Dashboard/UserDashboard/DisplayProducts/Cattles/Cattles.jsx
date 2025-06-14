import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import BreadCrumb from "../../../../BreadCrumb/BreadCrumb";

export const Cattles = ({ cattle, setwishListCount }) => {
  const categories = ["All", "cow", "buffalo"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredProducts =
    selectedCategory === "All"
      ? cattle
      : cattle.filter((p) => p.type === selectedCategory);

  const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

  const addToWishList = async (item) => {
    if (!loggedInUser) {
      toast.error("Please log in to add to wishlist.");
      return;
    }

    const userRef = doc(db, "users", loggedInUser.user.displayName);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const wishList = userDoc.data().wishList || [];

      const alreadyExists = wishList.some(
        (wishItem) => wishItem.id === item.id
      );

      if (alreadyExists) {
        toast.info("This item is already in your wishlist.");
        return;
      }

      await updateDoc(userRef, {
        wishList: arrayUnion(item),
      });

      const updatedDoc = await getDoc(userRef);
      const updatedList = updatedDoc.data().wishList || [];
      setwishListCount(updatedList.length);

      toast.success("Cattle Item Added to the WishList.");
    }
  };

  return (
    <>
      <BreadCrumb
        title="Cattles"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Farm" }]}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF7E6] to-white px-4 sm:px-6 py-6">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border font-medium text-sm transition duration-200 ${
                selectedCategory === cat
                  ? "bg-[#6e4327] text-white"
                  : "bg-white text-[#6e4327] border-[#794e31] hover:bg-[#fad5bc]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition duration-300 border border-gray-100"
            >
              {/* Wishlist Icon */}
              <span
                onClick={() => addToWishList(product)}
                className="absolute top-4 right-4 bg-white shadow-md p-2 rounded-full z-10 hover:bg-red-50 transition"
              >
                <Heart size={20} className="text-red-500" />
              </span>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-52 object-cover object-top rounded-t-2xl"
              />

              {/* Product Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-[#5a3a24] truncate mb-1">
                  {product.breed}
                </h3>
                <p className="text-sm text-gray-500 truncate">{product.type}</p>
              </div>

              {/* Price & Action */}
              <div className="flex justify-between items-center px-4 pb-4">
                <button
                  onClick={() => navigate(`/singleCattle/${product.id}`)}
                  className="bg-gradient-to-r from-[#a05b36] to-[#f4ad76] text-white text-sm px-4 py-2 rounded-lg font-medium shadow hover:opacity-90 transition"
                >
                  View More
                </button>

                <div className="text-right text-sm">
                  {product.oldPrice && (
                    <span className="line-through text-gray-400 mr-1">
                      ₹{product.oldPrice}
                    </span>
                  )}
                  <span className="text-[#6e4327] font-bold text-lg">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ToastContainer />
      </div>
    </>
  );
};
