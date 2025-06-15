import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { useNavigate } from "react-router-dom";

const AddAnimal = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [animalFormData, setAnimalFormData] = useState({
    breed: "",
    type: "",
    age: "",
    color: "",
    birth: "",
    milkCapacity: "",
    price: "",
    image: null,
  });

  const loggedInOwner = JSON.parse(localStorage.getItem("ownerLoggedIn"));
  console.log(loggedInOwner);

  async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Unsigned-vineeth");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dlrvxuntz/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("Image upload failed.");
    return data.secure_url;
  }
  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageURL = await uploadImageToCloudinary(file); // upload to cloud
      setImagePreview(imageURL); // show preview
      setAnimalFormData((prev) => ({
        ...prev,
        id: Date.now(),
        quantity: 1,
        image: imageURL, // store file (you can also store imageURL if needed)
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAnimalFormSubmit = async (e) => {
    e.preventDefault();
    console.log(animalFormData);

    try {
      const animatDocRef = doc(db, "owners", loggedInOwner.user.displayName);

      await updateDoc(animatDocRef, {
        animals: arrayUnion(animalFormData),
      });

      toast.success("Animal Data added Successfully..");

      setTimeout(() => navigate("/ownerDashboard"), 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-[#f8c8a8] via-white to-[#ea9f65] rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#9e673d]">
        🐄 Add Animal
      </h2>
      <form onSubmit={handleAnimalFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label font-semibold">Breed</label>
            <input
              type="text"
              name="breed"
              placeholder="e.g., Gir, Jersey"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, breed: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              Type
              <span className="text-sm text-gray-400"></span>
            </label>
            <select
              name="type"
              className="select select-bordered  border-[#9e673d] bg-white"
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, type: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="cow">Cow</option>
              <option value="buffalo">Buffalo</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Age</label>
            <input
              type="text"
              name="age"
              placeholder="e.g., 2 years or 6 months"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, age: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              Color <span className="text-sm text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="color"
              placeholder="e.g., Brown, Black & White"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, color: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              Milk Capacity (Liters/Day)
            </label>
            <input
              type="number"
              name="milkCapacity"
              placeholder="e.g., 10"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setAnimalFormData({
                  ...animalFormData,
                  milkCapacity: e.target.value,
                })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">
              How Many Times to Give Birth{" "}
              <span className="text-sm text-gray-400"></span>
            </label>
            <input
              type="text"
              name="birth"
              placeholder="0 , 1 , 2 "
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, birth: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Price</label>
            <input
              type="number"
              name="price"
              className="input input-bordered border-[#9e673d] bg-white"
              required
              onChange={(e) =>
                setAnimalFormData({ ...animalFormData, price: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered border-[#9e673d] w-full bg-white"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="mt-4">
                <span className="text-sm text-gray-500">Preview:</span>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-40 h-40 object-cover border rounded-xl shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-control mt-8">
          <button
            type="submit"
            className="btn  bg-[radial-gradient(circle,#f7a974,#9e673d)] w-full text-lg tracking-wide"
          >
            ➕ Add Animal
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAnimal;
