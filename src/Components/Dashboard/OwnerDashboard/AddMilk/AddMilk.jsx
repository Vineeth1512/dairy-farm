// import React, { useState } from "react";

// export const AddMilk = ({ showMilkModal, onClose }) => {
//   const [milkDetails, setMilkDetails] = useState({
//     type: "",
//     quantity: "",
//     fat: "",
//     shift: "",
//   });

//   if (!showMilkModal) return null;

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
//           {/* Close Button */}
//           <button
//             className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
//             onClick={onClose}
//           >
//             &times;
//           </button>

//           {/* Modal Title */}
//           <h3 className=" text-center text-2xl font-bold text-gray-800 mb-4">
//             Add Milk Details
//           </h3>

//           {/* Form Inputs */}
//           <form className="space-y-4">
//             <div className="form-control">
//               <label className="label font-semibold">
//                 Type
//                 <span className="text-sm text-gray-400"></span>
//               </label>
//               <select
//                 name="type"
//                 className="select select-bordered  border-gray-400 bg-white"
//               >
//                 <option value="">Select</option>
//                 <option value="cow">Cow</option>
//                 <option value="buffalo">Buffalo</option>
//               </select>
//             </div>
//             <div className="form-control">
//               <label className="label font-semibold">Quantity</label>
//               <input
//                 type="text"
//                 name="quantity"
//                 placeholder="500ml or 1L.."
//                 className="input input-bordered border-green-400 w-full bg-white"
//                 required
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-semibold">Fat (in %)</label>
//               <input
//                 type="text"
//                 name="fat"
//                 placeholder="e.g 4.5% "
//                 className="input input-bordered border-green-400 w-full bg-white"
//                 required
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-semibold">
//                 Shift
//                 <span className="text-sm text-gray-400"></span>
//               </label>
//               <select
//                 name="type"
//                 className="select select-bordered  border-gray-400 bg-white"
//               >
//                 <option value="">Select</option>
//                 <option value="morning">Morning</option>
//                 <option value="evening">Evening</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label font-semibold">Description</label>
//               <textarea
//                 type="text"
//                 name="quantity"
//                 placeholder="500ml or 1L.."
//                 className="input input-bordered border-green-400 w-full bg-white"
//                 required
//               ></textarea>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";
import { useNavigate } from "react-router-dom";

const AddMilk = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [milkDetails, setMilkDetails] = useState({
    type: "",
    quantity: "",
    fat: "",
    shift: "",
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
        image: file, // store file (you can also store imageURL if needed)
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMilkFormSubmit = async (e) => {
    e.preventDefault();
    console.log(milkDetails);

    try {
      const imageURL = await uploadImageToCloudinary(milkDetails.image);

      const animalDataWithURL = {
        ...milkDetails,
        image: imageURL,
      };
      const animatDocRef = doc(db, "owners", loggedInOwner.user.displayName);

      await updateDoc(animatDocRef, {
        milk: arrayUnion(animalDataWithURL),
        addedMilkDate: Date.now(),
      });

      toast.success("Milk Item  added Successfully..");

      // setMilkDetails({
      //   breed: "",
      //   age: "",
      //   type: "",
      //   color: "",
      //   birth: "",
      //   milkCapacity: "",
      //   price: "",
      //   image: null,
      // });

      setTimeout(() => navigate("/ownerDashboard"), 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-green-100 rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        🐄 Add Milk
      </h2>
      <form onSubmit={handleMilkFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label font-semibold">
              Type
              <span className="text-sm text-gray-400"></span>
            </label>
            <select
              name="type"
              className="select select-bordered  border-green-400 bg-white"
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, type: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="cow">Cow</option>
              <option value="buffalo">Buffalo</option>
            </select>
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
                setMilkDetails({ ...milkDetails, quantity: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Fat (in %)</label>
            <input
              type="text"
              name="fat"
              placeholder="e.g 4.5% "
              className="input input-bordered border-green-400 w-full bg-white"
              required
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, fat: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">
              Shift
              <span className="text-sm text-gray-400"></span>
            </label>
            <select
              name="shift"
              className="select select-bordered  border-green-400 bg-white"
              onChange={(e) =>
                setMilkDetails({ ...milkDetails, shift: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
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
              className="input input-bordered border-green-400 w-full bg-white"
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
