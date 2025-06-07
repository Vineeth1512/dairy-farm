import React from "react";

const products = [
  {
    name: "Uht milk",
    desc: "Long Life Shelf Stable | Vitamin d | refrigerated | UHT Ultra pasteurized ...",
    price: "$55.00",
    oldPrice: "$65.00",
    img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-1-1.jpg",
  },
  {
    name: "Fresh yogurt",
    desc: "Smoothy and creamy yogurt snack pouches: Hankcok yogurt pouches are packed with ...",
    price: "$19.00",
    oldPrice: "$29.00",
    img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-3-1.jpg",
  },
  {
    name: "Evaporated milk",
    desc: "Lactose-Free Milk Substitute for Sweet and Savory Recipes, Rich and Delicious Evaporated.",
    price: "$19.00",
    oldPrice: "$29.00",
    img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-4-1.jpg",
  },
  {
    name: "Farm sour cream",
    desc: "Hankcok Sour Cream Powder, Hormone Free, Gluten Free, Made in USA, 1kg ...",
    price: "$45.00",
    oldPrice: null,
    img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-2-1.jpg",
  },
];

export const MilkItems = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {products.map((product, index) => (
        <div
          key={index}
          className="card bg-base-100 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <figure className="px-4 pt-4">
            <img
              src={product.img}
              alt={product.name}
              className="h-[150px] object-contain"
            />
          </figure>
          <div className="card-body items-center text-center px-4 py-2">
            <h2 className="card-title text-base font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500">{product.desc}</p>
          </div>
          <div className="flex justify-between items-center px-4 pb-4">
            <button className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white border-none">
              Buy Now
            </button>
            <div className="text-right text-sm">
              {product.oldPrice && (
                <span className="line-through text-gray-400 mr-1">
                  ₹{product.oldPrice}
                </span>
              )}
              <span className="text-red-600 font-bold">₹{product.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

//export default MilkItems;
