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

  const handleDeleteAnimal = async (animalIndex) => {
    console.log(animalIndex);

    let animalsAfterDeletedAnimals = allAnimals.filter(
      (filAnimal, index) => index !== animalIndex
    );
    console.log(animalsAfterDeletedAnimals);
    const docRef = doc(db, "owners", loggedInOwner.user.displayName);
    await updateDoc(docRef, {
      animals: animalsAfterDeletedAnimals,
    });
    toast.success("Animal Deleted Successfully..");
    setAllAnimals(animalsAfterDeletedAnimals);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
        Your Animals
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allAnimals.map((animal, index) => (
          <div
            key={index}
            className="card bg-white shadow-lg rounded-xl overflow-hidden border border-green-300 hover:shadow-2xl transition-shadow duration-300"
          >
            <figure className="h-48 overflow-hidden">
              <img
                src={animal.image}
                alt={animal.breed}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="p-6">
              <h2 className="card-title text-xl font-bold text-green-800 mb-2">
                {animal.breed}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Type:</span> {animal.type}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Age:</span> {animal.age}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Color:</span>{" "}
                {animal.color || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Births:</span> {animal.birth}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Milk Capacity:</span>{" "}
                {animal.milkCapacity} L/day
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Price:</span> ₹{animal.price}
              </p>
              <div className="flex justify-between">
                <button className="btn btn-sm btn-info text-white hover:btn-primary transition">
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error text-white hover:btn-secondary transition"
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
