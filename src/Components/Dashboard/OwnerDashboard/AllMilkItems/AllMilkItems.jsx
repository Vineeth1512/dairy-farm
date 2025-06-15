import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";

const AllMilkItems = () => {
  const [allMilkItems, setAllMilkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInOwner = JSON.parse(localStorage.getItem("ownerLoggedIn"));

  useEffect(() => {
    const fetchAllMilkItems = async () => {
      const docRef = doc(db, "owners", loggedInOwner.user.displayName);
      const allMilkItemsData = await getDoc(docRef);
      if (allMilkItemsData.exists()) {
        setAllMilkItems(allMilkItemsData.data().milk || []);
      }
      setLoading(false);
    };
    fetchAllMilkItems();
  }, [loggedInOwner.user.displayName]);

  const handleDeleteItem = async (milkIndex) => {
    const updatedItems = allMilkItems.filter((_, index) => index !== milkIndex);
    const docRef = doc(db, "owners", loggedInOwner.user.displayName);
    await updateDoc(docRef, { milk: updatedItems });
    toast.success("Milk Item Deleted Successfully!");
    setAllMilkItems(updatedItems);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-[#9e673d]"></span>
      </div>
    );
  }

  if (allMilkItems.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg font-semibold">
        No Milk Items found. Please add some!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-[#9e673d] mb-10 text-center">
        Your Milk Items
      </h1>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allMilkItems.map((milk, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-xl border border-[#e0c8b3] hover:shadow-2xl transition duration-300"
          >
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={milk.image}
                alt={milk.name}
                className="w-full h-40  object-center"

                //className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#9e673d] mb-3 text-center">
                {milk.name}
              </h2>

              <div className="text-gray-700 text-base mb-4 space-y-1">
                <p>
                  <strong>Quantity:</strong> {milk.quantity}
                </p>
                <p>
                  <strong>Price:</strong> ₹{milk.price}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#f7a974] to-[#9e673d] hover:brightness-110 transition">
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                  onClick={() => handleDeleteItem(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllMilkItems;
