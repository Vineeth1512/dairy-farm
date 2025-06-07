import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../../../NotFound/NotFound";

const SingleCattle = ({ singleCattle }) => {
  const { id } = useParams();
  const cattle = singleCattle.find((c) => c.id === Number(id));

  if (!cattle) return <NotFound />;

  return (
    <section className="min-h-screen bg-[#f4faff] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-6xl w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Image */}
        <div className="bg-[#fefefe] lg:w-1/2 flex items-center justify-center p-6">
          <img
            src={cattle.image}
            alt={cattle.breed}
            className="object-contain max-h-[400px] w-full rounded-full"
            loading="lazy"
          />
        </div>

        {/* Right Side: Details like Nutritional Info */}
        <div className="bg-white lg:w-1/2 p-10 flex flex-col justify-center space-y-6 text-[#6e4327]">
          <div>
            <h2 className="text-3xl font-bold text-[#6e4327]">
              {cattle.breed}
            </h2>
            <p className="text-base text-gray-500 mt-1">({cattle.type})</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Age</span>
              <span>{cattle.age}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Birth</span>
              <span>{cattle.birth}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Color</span>
              <span className="capitalize">{cattle.color}</span>
            </div>
            <div className="flex justify-between text-[#6e4327] text-base border-b pb-1">
              <span className="font-medium">Milk Capacity</span>
              <span>{cattle.milkCapacity} L/day</span>
            </div>
            <div className="flex justify-between text-yellow-600 text-lg font-semibold pt-3">
              <span>Price</span>
              <span>₹{cattle.price}</span>
            </div>
          </div>

          <button className="group relative overflow-hidden mt-6 font-semibold px-6 py-3 rounded-xl w-fit">
            {/* Default gradient background */}
            <span className="absolute inset-0 bg-[radial-gradient(circle,#f7a974,#4a2f1a)] transition-opacity duration-300 group-hover:opacity-0"></span>

            {/* Hover gradient background */}
            <span className="absolute inset-0 bg-[radial-gradient(circle,#9e673d,#f7a974)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

            {/* Text with color transition */}
            <span className="relative z-10 text-white group-hover:text-[#000000] transition-colors duration-300">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SingleCattle;
