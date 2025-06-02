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
  }, []);

  const handleDeleteItem = async (milkIndex) => {
    console.log(milkIndex);

    let milkItemsAfterDeleted = allMilkItems.filter(
      (filAnimal, index) => index !== milkIndex
    );
    console.log(milkItemsAfterDeleted);
    const docRef = doc(db, "owners", loggedInOwner.user.displayName);
    await updateDoc(docRef, {
      milk: milkItemsAfterDeleted,
    });
    toast.success("Animal Deleted Successfully..");
    setAllMilkItems(milkItemsAfterDeleted);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
        Your Milk Items
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allMilkItems.map((milk, index) => (
          <div
            key={index}
            className="card bg-white shadow-lg rounded-xl overflow-hidden border border-green-300 hover:shadow-2xl transition-shadow duration-300"
          >
            <figure className="h-48 overflow-hidden">
              <img
                src={milk.image}
                alt={milk.type}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="p-6">
              <h2 className="card-title text-xl font-bold text-green-800 mb-2">
                Fresh Milk
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Type:</span> {milk.type}
              </p>

              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Quantity:</span> {milk.quantity}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Price:</span> ₹{milk.price}
              </p>
              <div className="flex justify-between">
                <button className="btn btn-sm btn-info text-white hover:btn-primary transition">
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error text-white hover:btn-secondary transition"
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
