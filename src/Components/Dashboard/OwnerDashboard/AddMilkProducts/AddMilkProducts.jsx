import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { useNavigate } from "react-router-dom";

export const AddMilkProducts = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [milkProductDetails, setMilkProductDetails] = useState({
    name: "",
    quantity: "",
    category: "",
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
      setMilkProductDetails((prev) => ({
        ...prev,
        image: imageURL,
        id: Date.now(),
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMilkProducts = async (e) => {
    e.preventDefault();
    console.log(milkProductDetails);

    try {
      const animatDocRef = doc(db, "owners", loggedInOwner.user.displayName);

      await updateDoc(animatDocRef, {
        products: arrayUnion(milkProductDetails),
      });

      toast.success("Milk Product  added Successfully..");

      setTimeout(() => navigate("/ownerDashboard"), 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-green-100 rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        🐄 Add Milk Products
      </h2>
      <form onSubmit={handleMilkProducts}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Cow Milk or Buffalo Milk"
              className="input input-bordered border-green-400 w-full bg-white"
              required
              onChange={(e) =>
                setMilkProductDetails({
                  ...milkProductDetails,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Quantity</label>
            <input
              type="text"
              name="quantity"
              placeholder="500ml or 1L.."
              className="input input-bordered border-green-400 w-full bg-white"
              required
              onChange={(e) =>
                setMilkProductDetails({
                  ...milkProductDetails,
                  quantity: e.target.value,
                })
              }
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              Category
              <span className="text-sm text-gray-400"></span>
            </label>
            <select
              name="shift"
              className="select select-bordered  border-green-400 bg-white"
              onChange={(e) =>
                setMilkProductDetails({
                  ...milkProductDetails,
                  category: e.target.value,
                })
              }
            >
              <option value="">-- Select Category --</option>
              <option value="Curd">Curd</option>
              <option value="Paneer">Paneer</option>
              <option value="Butter">Butter</option>
              <option value="Ghee">Ghee</option>
              <option value="Cream">Cream</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label font-semibold">Price</label>
            <input
              type="number"
              name="price"
              className="input input-bordered border-green-400 bg-white"
              required
              onChange={(e) =>
                setMilkProductDetails({
                  ...milkProductDetails,
                  price: e.target.value,
                })
              }
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Description</label>
            <textarea
              type="text"
              name="description"
              placeholder="Enter Description"
              className="input input-bordered border-green-400 w-full bg-white"
              required
              onChange={(e) =>
                setMilkProductDetails({
                  ...milkProductDetails,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered file-input-success w-full bg-white"
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
            className="btn btn-success w-full text-lg tracking-wide"
          >
            ➕ Add Milk Product
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

//export default AddMilkProducts;

// export default AddMilk;
