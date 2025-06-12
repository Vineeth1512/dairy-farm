import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import BreadCrumb from "../../../../BreadCrumb/BreadCrumb";
export const MilkItems = ({ milkItems, setwishListCount }) => {
  const categories = ["All", "Curd", "Paneer", "Butter", "Ghee", "Cream"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const filteredProducts =
    selectedCategory === "All"
      ? milkItems
      : milkItems.filter((p) => p.category === selectedCategory);

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

      // Check if item already exists based on a unique key (e.g., id)
      const alreadyExists = wishList.some(
        (wishItem) => wishItem.id === item.id
      );

      if (alreadyExists) {
        toast.info("This item is already in your wishlist.");
        return; // ✅ Exit early if it's already there
      }

      // If not, add to wishlist
      await updateDoc(userRef, {
        wishList: arrayUnion(item),
      });

      // Re-fetch and update wishlist count
      const updatedDoc = await getDoc(userRef);
      const updatedList = updatedDoc.data().wishList || [];
      setwishListCount(updatedList.length);

      toast.success("Cattle Item Added to the WishList..");
    }
  };
  return (
    <>
      <BreadCrumb
        title="Milk Products"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products" }]}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7E6] to-white p-4 sm:p-6">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border font-medium text-sm transition ${
                selectedCategory === cat
                  ? "bg-[#6e4327] text-white"
                  : "bg-white text-[#6e4327] border-[#794e31] hover:bg-[#fad5bc]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filter */}
          <aside className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-200 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#6e4327] mb-6">
              Filters
            </h2>

            <div className="mb-8">
              <h3 className="text-base font-medium text-[#b08569] mb-3">
                Price Range
              </h3>
              <input
                type="range"
                min={10}
                max={250}
                className="range range-sm custom-range"
              />
              <div className="flex justify-between text-sm text-[#6e4327] mt-2">
                <span>₹10</span>
                <span>₹250</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium text-[#6e4327] mb-3">
                Category
              </h3>
              {categories
                .filter((cat) => cat !== "All")
                .map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center mb-2 text-[#6e4327]"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success mr-3"
                    />
                    {cat}
                  </label>
                ))}
            </div>
          </aside>

          {/* Product Cards */}
          <section className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="relative card  shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 from-blue-100 via-white to-green-100 rounded-2xl"
              >
                {/* Wishlist Icon */}
                <button
                  className="absolute top-6 right-6 z-10 p-1.5 bg-[#fad5bc] rounded-full shadow hover:bg-red-100 transition"
                  onClick={() => addToWishList(product)}
                >
                  <Heart size={18} className="text-[#f66942]" />
                </button>

                {/* Image */}
                <figure className="px-4 pt-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className=" w-[70%] h-[200px] object-left-top rounded-2xl"
                  />
                </figure>

                {/* Card Body */}
                <div className="card-body items-center text-center px-4 py-2">
                  <h2 className="card-title text-base font-semibold text-[#6e4327] truncate">
                    {product.name}
                  </h2>
                </div>

                {/* Footer Row */}
                <div className="text-sm flex justify-between p-2">
                  <span className="text-[#6e4327] font-bold text-xl">
                    Price: ₹{product.price}
                  </span>{" "}
                  <span className="text-[#6e4327] font-bold text-xl">
                    Quantity: {product.quantity}
                  </span>
                </div>
                <div className="flex justify-center items-center px-4 pb-8 w-full">
                  <button
                    className="btn btn-sm bg-[radial-gradient(circle,#f7a974,#4a2f1a)]  text-white font-semibold px-6 py-3 rounded-xl hover:bg-[radial-gradient(circle,#9e673d,#f7a978)] transition duration-200 w-fit border-none"
                    onClick={() => navigate(`/singleProduct/${product.id}`)}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
//export default Milk;
