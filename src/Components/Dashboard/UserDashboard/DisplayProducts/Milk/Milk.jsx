// import React from "react";

// export const Milk = () => {
//   return <div>Milk</div>;
// };
import React from "react";

const milkData = [
  {
    name: "Cow Milk",
    quantity: "1 Liter",
    fat: "4.5%",
    shift: "Morning",
    price: "₹45",
    description: "Fresh and organic cow milk collected every morning.",
    image:
      "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-2-1-240x180.jpg",
  },
  {
    name: "Buffalo Milk",
    quantity: "1 Liter",
    fat: "6.5%",
    shift: "Evening",
    price: "₹55",
    description: "Thick and creamy buffalo milk rich in nutrients.",
    image:
      "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-2-2-240x180.jpg",
  },
  {
    name: "Toned Milk",
    quantity: "1 Liter",
    fat: "3.0%",
    shift: "Morning",
    price: "₹35",
    description: "Low fat milk ideal for health-conscious individuals.",
    image:
      "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-2-3-240x180.jpg",
  },
  // Add more cards as needed
];

export const Milk = () => {



  
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-[#6e4327] mb-8">
        Milk Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {milkData.map((milk, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-xl border border-[#f0e6e2] hover:scale-105 transition-transform duration-300"
          >
            <figure>
              <img
                src={milk.image}
                alt={milk.name}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-[#6e4327]">{milk.name}</h2>
              <p className="text-sm text-gray-600">{milk.description}</p>
              <div className="text-sm mt-2">
                <p>
                  <strong>Quantity:</strong> {milk.quantity}
                </p>
                <p>
                  <strong>Fat:</strong> {milk.fat}
                </p>
                <p>
                  <strong>Shift:</strong> {milk.shift}
                </p>
                <p>
                  <strong>Price:</strong> {milk.price}
                </p>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm bg-[#6e4327] text-white hover:bg-[#8b5e3c]">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
