import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../../../NotFound/NotFound";
import { toast, ToastContainer } from "react-toastify";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../Config/FirebaseConfiguration";

const SingleCattle = ({ singleCattle, setCartCount }) => {
  const { id } = useParams();
  const cattle = singleCattle.find((c) => c.id === Number(id));
  const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));

  const handleAddToCart = async (item) => {
    console.log(item);
    if (!loggedInUser) {
      toast.error("Please log in to add to wishlist.");
      return;
    }

    const userRef = doc(db, "users", loggedInUser.user.displayName);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const cart = userDoc.data().cart || [];

      // Check if item already exists based on a unique key (e.g., id)
      const alreadyExists = cart.some((cartItem) => cartItem.id === item.id);

      if (alreadyExists) {
        toast.info("This item is already in your cart.");
        return; // ✅ Exit early if it's already there
      }

      // If not, add to cart
      await updateDoc(userRef, {
        cart: arrayUnion(item),
      });

      // Re-fetch and update cart count
      const updatedDoc = await getDoc(userRef);
      const updatedList = updatedDoc.data().cart || [];
      setCartCount(updatedList);

      toast.success("Item Added to the Cart..");
    }
  };

  if (!cattle) return <NotFound />;

  return (
    <section className="min-h-screen bg-[#f4faff] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Image */}
        <div className="bg-[#fefefe] lg:w-1/2 flex items-center justify-center p-6">
          <img
            src={cattle.image}
            alt={cattle.breed}
            className="object-contain max-h-[400px] w-full rounded-full"
            loading="lazy"
          />
        </div>

        {/* Right Side: Details like Nutritional Info */}
        <div className="bg-white lg:w-1/2 p-10 flex flex-col justify-center space-y-6 text-[#6e4327]">
          <div>
            <h2 className="text-3xl font-bold text-[#6e4327]">
              {cattle.breed}
            </h2>
            <p className="text-base text-gray-500 mt-1">({cattle.type})</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Age</span>
              <span>{cattle.age}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Birth</span>
              <span>{cattle.birth}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Color</span>
              <span className="capitalize">{cattle.color}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Quantity</span>
              <span className="capitalize">{cattle.quantity}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Milk Capacity</span>
              <span>{cattle.milkCapacity} L/day</span>
            </div>
            <div className="flex justify-between text-yellow-600 text-lg font-semibold pt-3">
              <span>Price</span>
              <span>₹{cattle.price}</span>
            </div>
          </div>

          <button
            className="group relative overflow-hidden mt-6 font-semibold px-6 py-3 rounded-xl w-fit"
            onClick={() => handleAddToCart(cattle)}
          >
            {/* Default gradient background */}
            <span className="absolute inset-0 bg-[radial-gradient(circle,#f7a974,#4a2f1a)] transition-opacity duration-300 group-hover:opacity-0"></span>

            {/* Hover gradient background */}
            <span className="absolute inset-0 bg-[radial-gradient(circle,#9e673d,#f7a974)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

            {/* Text with color transition */}
            <span className="relative z-10 text-white group-hover:text-[#000000] transition-colors duration-300">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SingleCattle;
