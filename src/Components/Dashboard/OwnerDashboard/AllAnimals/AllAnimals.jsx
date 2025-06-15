import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";

const AllAnimals = () => {
  const [allAnimals, setAllAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInOwner = JSON.parse(localStorage.getItem("ownerLoggedIn"));

  useEffect(() => {
    const fetchAllAnimals = async () => {
      const docRef = doc(db, "owners", loggedInOwner.user.displayName);
      const allAnimalsData = await getDoc(docRef);

      if (allAnimalsData.exists()) {
        setAllAnimals(allAnimalsData.data().animals || []);
      }
      setLoading(false);
    };
    fetchAllAnimals();
  }, []);

  const handleDeleteAnimal = async (index) => {
    const updated = allAnimals.filter((_, i) => i !== index);
    const docRef = doc(db, "owners", loggedInOwner.user.displayName);
    await updateDoc(docRef, { animals: updated });
    toast.success("Animal Deleted Successfully.");
    setAllAnimals(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (allAnimals.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg font-semibold">
        No animals found. Please add some!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#9e673d] mb-6 text-center">
        Your Animals
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allAnimals.map((animal, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
          >
            <img
              src={animal.image}
              alt={animal.breed}
              className="w-full h-40  object-center"
            />

            <div className="p-4 text-sm text-gray-700 space-y-1">
              <h2 className="text-lg font-bold text-[#9e673d]">
                {animal.breed}
              </h2>
              <p>
                <span className="font-semibold">Type:</span> {animal.type}
              </p>
              <p>
                <span className="font-semibold">Milk:</span>{" "}
                {animal.milkCapacity} L/day
              </p>
              <p>
                <span className="font-semibold">Price:</span> ₹{animal.price}
              </p>

              <div className="flex justify-between mt-3">
                <button className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#f7a974] to-[#9e673d] hover:brightness-110 transition">
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                  onClick={() => handleDeleteAnimal(index)}
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

export default AllAnimals;
