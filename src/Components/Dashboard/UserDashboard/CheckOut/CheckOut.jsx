import React from "react";

const CheckOut = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-12 gap-10">
      {/* Address + Payment Form */}
      <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-[#3c2e12]">
          🏡 Delivery Address
        </h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 rounded-md w-full"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="border p-2 rounded-md w-full"
            />
          </div>
          <textarea
            rows="3"
            placeholder="Full Address (village, district, state)"
            className="border p-2 rounded-md w-full"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Pincode"
              className="border p-2 rounded-md w-full"
            />
          </div>

          <div className="pt-4">
            <h3 className="font-semibold text-lg mb-2">💳 Payment Method</h3>
            <select className="border p-2 rounded-md w-full">
              <option>Cash on Delivery</option>
              <option>UPI (Coming Soon)</option>
              <option>Credit/Debit Card (Coming Soon)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-2xl font-bold text-[#3c2e12] mb-4">
          🧾 Order Summary
        </h2>
        <div className="space-y-4">
          {/* Dummy Item */}
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Fresh Cow Milk x 2</p>
            <p className="font-semibold text-green-700">₹ 100</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Paneer x 1</p>
            <p className="font-semibold text-green-700">₹ 200</p>
          </div>
          <div className="flex justify-between items-center border-t pt-2 mt-2 font-semibold text-[#3c2e12]">
            <span>Total</span>
            <span>₹ 300</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition">
          ✅ Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
