import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { useNavigate } from "react-router-dom";

const AddMilk = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [milkDetails, setMilkDetails] = useState({
    name: "",
    quantity: "",
    fat: "",
    price: "",
    description: "",
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
      setMilkDetails((prev) => ({
        ...prev,
        image: imageURL,
        id: Date.now(),
        quantity: 1,
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMilkFormSubmit = async (e) => {
    e.preventDefault();
    console.log(milkDetails);

    try {
      const animatDocRef = doc(db, "owners", loggedInOwner.user.displayName);
      console.log(milkDetails);

      await updateDoc(animatDocRef, {
        milk: arrayUnion(milkDetails),
      });

      toast.success("Milk Item  added Successfully..");

      setTimeout(() => navigate("/ownerDashboard"), 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-[#f8c8a8] via-white to-[#ea9f65] rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#9e673d]">
        🐄 Add Milk
      </h2>
      <form onSubmit={handleMilkFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Cow Milk or Buffalo Milk"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, name: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Quantity</label>
            <input
              type="text"
              name="quantity"
              placeholder="500ml or 1L.."
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, quantity: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Fat (in %)</label>
            <input
              type="number"
              name="fat"
              placeholder="e.g 4.5% "
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, fat: e.target.value })
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
                setMilkDetails({ ...milkDetails, price: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Description</label>
            <textarea
              type="text"
              name="description"
              placeholder="Enter Description"
              className="input input-bordered border-[#9e673d] w-full bg-white"
              required
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, description: e.target.value })
              }
            ></textarea>
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
            className="btn bg-[radial-gradient(circle,#f7a974,#9e673d)] w-full text-lg tracking-wide"
          >
            ➕ Add Milk
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddMilk;

// export default AddMilk;
