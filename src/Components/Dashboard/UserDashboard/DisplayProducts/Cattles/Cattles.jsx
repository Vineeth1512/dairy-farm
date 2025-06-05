import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

export const Cattles = ({ cattle }) => {
  console.log(cattle, "Cattel .........");

  const categories = ["All", "cow", "buffalo"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? cattle
      : cattle.filter((p) => p.type === selectedCategory);
  console.log(filteredProducts, "filtered");
  console.log(selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9caaa] to-white p-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border font-medium text-sm transition ${
              selectedCategory === cat
                ? "bg-[#6e4327] text-white"
                : "bg-white text-[#6e4327] border-[#794e31] hover:bg-[#fad5bc]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 md:col-span-1">
          <h2 className="text-2xl font-semibold text-[#6e4327] mb-6">
            Filters
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#b08569] mb-3">
              Price Range
            </h3>
            <input
              type="range"
              min={10}
              max={250}
              className="range range-sm custom-range"
            />
            <div className="flex justify-between text-sm text-[#6e4327] mt-2">
              <span>₹10</span>
              <span>₹250</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#6e4327] mb-3">
              Category
            </h3>
            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => (
                <label
                  key={cat}
                  className="flex items-center mb-2 text-[#6e4327]"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success mr-3"
                  />
                  {cat}
                </label>
              ))}
          </div>
        </aside>

        {/* Products */}
        <section className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-[#ffff] border border-[#6e4327] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
                <span className="absolute top-2 left-2 bg-[#fff] text-[#6e4327] text-xs font-medium px-2 py-1 rounded">
                  {product.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#6e4327] group-hover:text-green-700">
                  {product.name}
                </h3>
                <p className="text-sm text-[#6e4327] mb-2">{product.breed}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xl font-bold text-[#6e4327]">
                    ₹{product.price}
                  </span>
                  <button className="p-2 bg-[#dbaf92] text-[#6e4327] rounded-full hover:bg-green-200">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
