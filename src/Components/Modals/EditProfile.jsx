import React, { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { doc, setDoc  } from "firebase/firestore";
import { auth, db } from "../../Config/FirebaseConfiguration";
import { toast, ToastContainer } from "react-toastify";
import { useProfile } from "../hooks/useProfile";
import { updateProfile } from "firebase/auth";

const EditProfile = ({ userLoggedIn, editProfileModal, onCancel }) => {
  const { loginData, fetchLoginData } = useProfile();

  console.log(userLoggedIn, "userrLogginn");

  console.log(loginData, "logindata");

  const [name, setName] = useState("");

  useEffect(() => {
    if (userLoggedIn?.user?.displayName) {
      setName(userLoggedIn.user.displayName);
    }
  }, [userLoggedIn]);

  const [profile, setProfile] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(
        db,
        `${loginData?.role}s`,
        userLoggedIn.user.displayName
      );
      const updatePayload = { name };
      console.log(profile, "profile..................profile");

      if (profile) updatePayload.profile = profile;

      await setDoc(docRef, updatePayload, { merge: true });

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profile || auth.currentUser.photoURL,
      });
      await fetchLoginData();
      alert("Profile updated successufully");
      toast.success("Profile updated successfully");
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageURL = await uploadImageToCloudinary(file);
      setProfile(imageURL);
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed");
    }
  };

  return (
    <>
      {editProfileModal && (
        <dialog
          id="user_modal"
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-xl text-center mb-4">
              User Information
            </h3>

            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full"
                  value={userLoggedIn.user.email || loginData?.email}
                  readOnly
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Update Profile</span>
                </label>
                <input
                  type="file"
                  name="profile"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="modal-action justify-center">
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </dialog>
      )}
    </>
  );
};

export default EditProfile;
