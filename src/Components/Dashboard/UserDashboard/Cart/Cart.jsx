import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Config/FirebaseConfiguration";

const Cart = ({ cartItems, setCartItems }) => {
  //   const cartItems = [
  //     {
  //       id: 1,
  //       name: "Wild Tulsi Honey",
  //       price: 399,
  //       quantity: 2,
  //       image:
  //         "https://res.cloudinary.com/dlrvxuntz/image/upload/v1749312470/ktuk1u0o5zrrffgcbrcc.jpg",
  //     },
  //     {
  //       id: 2,
  //       name: "Buzz Pack",
  //       price: 999,
  //       quantity: 1,
  //       image:
  //         "https://res.cloudinary.com/dlrvxuntz/image/upload/v1749312357/fjfz1wil4c85t1gewfw5.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "Karanj Honey",
  //       price: 399,
  //       quantity: 1,
  //       image:
  //         "https://res.cloudinary.com/dlrvxuntz/image/upload/v1749312655/blwxlyr3qhseuyqqdcpf.jpg",
  //     },
  //   ];

  const [cartData, setCardData] = useState([]);
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      setCardData(cartItems);
    } else {
      setCardData([]);
    }
  }, [cartItems]);

  console.log(cartData);

  const total = Array.isArray(cartData)
    ? cartData.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const gst = (total * 0.05).toFixed(2);

  const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
  const deleteCartItem = async (deleteItem) => {
    console.log(deleteItem);
    const afterDeleteCartItems = cartData.filter(
      (cart) => cart.id !== deleteItem.id
    );

    if (confirm("Are you sure you want to delete?")) {
      const docRef = doc(db, "users", loggedInUser.user.displayName);
      await updateDoc(docRef, {
        cart: afterDeleteCartItems,
      });
      setCardData(afterDeleteCartItems);
      setCartItems(afterDeleteCartItems);
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 bg-[#fefbf6] min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#5e3200] text-center md:text-left">
          🛒 Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="hidden md:grid grid-cols-12 gap-4 font-medium text-sm border-b pb-3 text-gray-700">
              <div className="col-span-4">Product</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Subtotal</div>
              <div className="col-span-1"></div>
            </div>

            {cartData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b hover:bg-white rounded-lg transition"
              >
                <div className="md:col-span-4 flex gap-4 items-center">
                  <figure className="w-36 h-28 rounded-xl overflow-hidden border shrink-0 ">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name || item.breed}
                    </p>
                    <p className="text-sm text-yellow-700 font-medium">
                      ₹ {item.price}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex md:justify-start justify-between md:mt-0 mt-4">
                  <div className="flex items-center border rounded px-2 py-1 shadow-sm bg-white">
                    <button className="p-1 hover:text-red-600 transition">
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 font-semibold text-gray-800">
                      {item.quantity || 1}
                    </span>
                    <button className="p-1 hover:text-green-600 transition">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-green-700 font-semibold md:mt-0 mt-2">
                  ₹ {item.price}
                </div>

                <div className="md:col-span-1 md:mt-0 mt-2">
                  <button
                    className="text-gray-400 hover:text-red-600 transition"
                    onClick={() => deleteCartItem(item)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Totals */}
          <div className="lg:col-span-4 p-6 border rounded-xl shadow-lg bg-white h-fit sticky top-20">
            <h2 className="text-xl font-bold text-[#5e3200] mb-4 text-center lg:text-left">
              🧾 Cart Summary
            </h2>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span>₹ {total}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-[#3c2e12] border-t pt-2 mt-2">
              <span>Total</span>
              <span>
                ₹ {total}
                <span className="text-xs font-normal text-gray-500 ml-1 block lg:inline">
                  (incl. ₹{gst} GST)
                </span>
              </span>
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-white py-2 rounded-xl hover:shadow-md transition font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
