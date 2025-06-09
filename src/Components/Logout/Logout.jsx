import React from "react";

const Logout = ({ showModal, onCancel, onConfirm }) => {
  // const loggedInOwner =
  //   JSON.parse(localStorage.getItem("ownerLoggedIn")) ||
  //   JSON.parse(localStorage.getItem("userLoggedIn"));
  // console.log(loggedInOwner);

  return (
    <>
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
