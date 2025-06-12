// import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import QRCode from "react-qr-code";
// import { db } from "../../Config/FirebaseConfiguration";
// import { toast } from "react-toastify";

// const CheckoutModal = ({
//   setCartItems,
//   loggedInUser,
//   isOpen,
//   onClose,
//   cartItems,
//   userAddress,
//   total,
//   gst,
// }) => {
//   const [address, setAddress] = useState(userAddress || "");
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);

//   const navigate = useNavigate();

//   if (!isOpen) return null;

//   const handleConfirmOrder = async () => {
//     if (!address) {
//       alert("Please enter your delivery address.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const docRef = doc(db, "users", loggedInUser.user.displayName);
//       const getUserData = await getDoc(docRef);
//       const userData = getUserData.data();
//       const firestoreCartItems = userData?.cart || [];

//       if (firestoreCartItems.length === 0) {
//         toast.warn("Cart is already empty.");
//         setIsProcessing(false);
//         return;
//       }

//       const newOrder = {
//         items: firestoreCartItems,
//         id: Date.now(),
//         address: address,
//         timestamp: new Date().toISOString(),
//         paymentMethod,
//       };

//       await updateDoc(docRef, {
//         orders: arrayUnion(newOrder),
//         cart: [],
//       });

//       setCartItems([]);
//       setOrderPlaced(true);
//       alert("Order placed successfully!");
//       onClose(); // close modal
//       navigate("/"); // navigate home
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast.error("Something went wrong while placing the order.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2 sm:px-4">
//       <div className="bg-white w-full max-w-md sm:max-w-2xl md:max-w-3xl rounded-2xl shadow-2xl p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto relative border border-gray-200">
//         <h2 className="text-xl sm:text-2xl font-bold text-[#5e3200] text-center">
//           🧾 Order Summary
//         </h2>

//         {/* Cart Summary */}
//         <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex justify-between text-sm font-medium flex-wrap"
//             >
//               <span className="text-gray-800">{item.name || item.breed}</span>
//               <span className="text-gray-600">
//                 ₹{item.price} x {item.quantity}
//               </span>
//             </div>
//           ))}
//           <div className="flex justify-between font-semibold text-[#3c2e12] border-t pt-2 mt-2">
//             <span>Total</span>
//             <span>
//               ₹{total} (incl. ₹{gst} GST)
//             </span>
//           </div>
//         </div>

//         {/* Address Section */}
//         <div>
//           <h3 className="text-base sm:text-lg font-semibold text-[#3c2e12] mb-2">
//             📍 Delivery Address
//           </h3>
//           {address ? (
//             <div className="bg-gray-100 border text-gray-700 p-3 rounded-md">
//               {address}
//             </div>
//           ) : (
//             <textarea
//               className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Enter your full delivery address"
//               rows="3"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           )}
//         </div>

//         {/* Payment Options */}
//         <div>
//           <h3 className="text-base sm:text-lg font-semibold text-[#3c2e12] mb-2">
//             💳 Payment Method
//           </h3>
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="cod"
//                 checked={paymentMethod === "cod"}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="accent-yellow-600"
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 Cash on Delivery
//               </span>
//             </label>

//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="upi"
//                 checked={paymentMethod === "upi"}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="accent-yellow-600"
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 UPI Payment
//               </span>
//             </label>
//           </div>

//           {paymentMethod === "upi" && (
//             <div className="mt-4 text-center">
//               <p className="mb-2 text-sm font-medium text-gray-700">
//                 Scan this QR code to pay:
//               </p>
//               <div className="inline-block p-2 bg-white rounded shadow border">
//                 <QRCode
//                   value={`upi://pay?pa=vineethkumarmudham@ybl&pn=Vineeth Dairy&am=${total}&cu=INR&tn=Milk Order`}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
//           <button
//             onClick={onClose}
//             disabled={isProcessing}
//             className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition w-full sm:w-auto"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirmOrder}
//             disabled={isProcessing}
//             className={`px-6 py-2 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
//               isProcessing
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-yellow-600 hover:bg-yellow-700"
//             }`}
//           >
//             {isProcessing
//               ? "Processing..."
//               : orderPlaced
//               ? "✅ Order Placed"
//               : "Confirm Order"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutModal;

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { db } from "../../Config/FirebaseConfiguration";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutModal = ({
  setCartItems,
  loggedInUser,
  isOpen,
  onClose,
  cartItems,
  userAddress,
  total,
  gst,
}) => {
  const [address, setAddress] = useState(userAddress || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    if (!address) {
      alert("Please enter your delivery address.");
      return;
    }

    setIsProcessing(true);

    try {
      const docRef = doc(db, "users", loggedInUser.user.displayName);
      const getUserData = await getDoc(docRef);
      const userData = getUserData.data();
      const firestoreCartItems = userData?.cart || [];

      if (firestoreCartItems.length === 0) {
        toast.warn("Cart is already empty.");
        setIsProcessing(false);
        return;
      }

      const newOrder = {
        items: firestoreCartItems,
        id: Date.now(),
        address: address,
        timestamp: new Date().toISOString(),
        paymentMethod,
      };

      await updateDoc(docRef, {
        orders: arrayUnion(newOrder),
        cart: [],
      });

      setCartItems([]);
      setOrderPlaced(true);
      alert("Order placed successfully!");
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing the order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md sm:max-w-2xl md:max-w-3xl rounded-2xl shadow-2xl p-4 sm:p-6 space-y-6 max-h-[90vh] overflow-y-auto relative border border-gray-200"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#5e3200] text-center">
              🧾 Order Summary
            </h2>

            {/* Cart Summary */}
            <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm font-medium flex-wrap"
                >
                  <span className="text-gray-800">
                    {item.name || item.breed}
                  </span>
                  <span className="text-gray-600">
                    ₹{item.price} x {item.quantity}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-[#3c2e12] border-t pt-2 mt-2">
                <span>Total</span>
                <span>
                  ₹{total} (incl. ₹{gst} GST)
                </span>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#3c2e12] mb-2">
                📍 Delivery Address
              </h3>
              {address ? (
                <div className="bg-gray-100 border text-gray-700 p-3 rounded-md">
                  {address}
                </div>
              ) : (
                <textarea
                  className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your full delivery address"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              )}
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#3c2e12] mb-2">
                💳 Payment Method
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-yellow-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-yellow-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    UPI Payment
                  </span>
                </label>
              </div>

              {paymentMethod === "upi" && (
                <div className="mt-4 text-center">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Scan this QR code to pay:
                  </p>
                  <div className="inline-block p-2 bg-white rounded shadow border">
                    <QRCode
                      value={`upi://pay?pa=vineethkumarmudham@ybl&pn=Vineeth Dairy&am=${total}&cu=INR&tn=Milk Order`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition w-full sm:w-auto ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : orderPlaced
                  ? "✅ Order Placed"
                  : "Confirm Order"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
