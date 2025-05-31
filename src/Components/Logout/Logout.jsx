import React from "react";

//import { Link, useNavigate } from "react-router-dom";
//import { auth } from "../../Config/FirebaseConfiguration";
//import { signOut } from "firebase/auth";
//import { toast } from "react-toastify";
const Logout = ({ showModal, onCancel, onConfirm }) => {
  //const [modalOpen, setModalOpen] = useState(false);
  // const navigate = useNavigate();
  const loggedInOwner =
    JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
    JSON.parse(localStorage.getItem("userLoggedIn"));
  console.log(loggedInOwner);

  //const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
  //console.log(loggedInUser);

  //   const handleLogout = async (e) => {
  //     console.log("clicked logout");

  //     e.preventDefault();

  //     try {
  //       await signOut(auth);
  //       localStorage.removeItem("ownerLoggedIn");
  //       //localStorage.removeItem("userLoggedIn");
  //       toast.success("SignedOut Successfully");
  //       navigate("/login");
  //     } catch (err) {
  //       toast.error(err.message);
  //     }
  //   };

  return (
    <>
      {/* <button onClick={() => setModalOpen(true)}>Logout</button> */}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm to Logout</h3>
            <p className="py-4"> Are you sure you want to logout?</p>
            <div className="modal-action">
              <button className="btn" onClick={onConfirm}>
                {" "}
                Yes
              </button>
              <button className="btn btn-ghost ml-2" onClick={onCancel}>
                {" "}
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
