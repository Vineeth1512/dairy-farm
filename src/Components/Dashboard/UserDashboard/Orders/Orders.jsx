import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../../Config/FirebaseConfiguration";

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("userLoggedIn"));
        if (!loggedInUser || !loggedInUser.user?.displayName) {
          console.error("No user logged in or display name missing");
          setLoading(false);
          return;
        }

        const ordersRef = doc(db, "users", loggedInUser.user.displayName);
        const getOrdersData = await getDoc(ordersRef);

        if (getOrdersData.exists()) {
          const data = getOrdersData.data();
          setOrdersData(data.orders || []);
        } else {
          console.log("No orders found for the user.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#6e3847]">
          🧾 Your Orders
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((skeleton) => (
            <div
              key={skeleton}
              className="card bg-base-100 shadow-xl border animate-pulse"
            >
              <div className="card-body">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>

                <div className="divider"></div>

                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 bg-base-200 p-3 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-300 rounded object-cover" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="h-5 bg-gray-300 rounded w-24 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#6e3847]">
        🧾 Your Orders
      </h2>

      {ordersData.length === 0 ? (
        <div className="text-center text-gray-600">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ordersData.map((order, index) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
              0
            );

            return (
              <div key={order.id} className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-2">
                    🧾 Order #{index + 1}
                  </h3>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Order ID:
                      </span>{" "}
                      {order.id}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Address:
                      </span>{" "}
                      {order.address}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Payment:
                      </span>{" "}
                      {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="grid grid-cols-1 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-base-200 p-3 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name || item.breed || "Item"}
                          className="w-16 h-16 rounded object-cover border"
                        />
                        <div>
                          <p className="font-semibold text-base text-[#6e3748]">
                            {item.name || item.breed || item.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="divider"></div>

                  <div className="text-right text-lg font-bold text-[#6e374]">
                    Total: ₹{total.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
