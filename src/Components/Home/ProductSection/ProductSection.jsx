import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    path: "milk",
    title: "Fresh Milk",
    image:
      "https://milatte.like-themes.com/wp-content/uploads/2024/11/cat_01-368x500.jpg",
  },
  {
    path: "cattle",
    title: "Cattles",
    image:
      "https://i.pinimg.com/736x/a6/d2/f3/a6d2f3927a748ba29abb8c370dbaf2e1.jpg",
  },
  {
    path: "products",
    title: "Dairy Products",
    image:
      "https://milatte.like-themes.com/wp-content/uploads/2024/11/cat_03-368x500.jpg",
  },
];

const ProductSection = () => {
  return (
    <div className="text-center px-4 py-10 bg-white">
      <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
        Our Products
      </p>
      <h2 className="text-3xl md:text-4xl font-serif text-[#9e673d] mb-10">
        Dairy Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((item, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[500px] object-cover transform group-hover:scale-105 transition duration-500"
            />

            {/* Overlay with title + button */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-end text-white p-4 transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <Link to={`/${item.path}`}>
                <button className="px-4 py-2 bg-[#9e673d] text-sm rounded-full hover:bg-[#6e4327] transition duration-300">
                  View More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
