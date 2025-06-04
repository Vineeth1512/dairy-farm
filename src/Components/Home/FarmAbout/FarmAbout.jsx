import React from "react";
import cowImage from "../../../assets/images/cow-side.png"; // Replace with your local cow image

const features = [
  { icon: "🥛", label: "Modern Dairy" },
  { icon: "🌿", label: "Natural & Organic" },
  { icon: "🍷", label: "Best Products" },
  { icon: "🏅", label: "Awarded Farm" },
];

const FarmAbout = () => {
  return (
    <section className="bg-[#fff3d3] text-[#3c2a1e] py-12 px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-12 transition-all duration-700 ease-in-out">
      {/* Left */}
      <div className="flex-1 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
          Know About Our Farm <br className="hidden md:block" /> And History
        </h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          We have been working in this industry for more than 30 years with
          trust and honesty. All hands must be on deck if we are to achieve our
          goal of improving global nutrition. Thankfully, our Hankook team
          employs 24,877 people and has offices in 58 countries. And our
          products are exported to over 100 countries.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <span className="text-yellow-500 text-4xl">{item.icon}</span>
              <p className="mt-2 text-center text-sm font-semibold text-gray-800">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex justify-center animate-fade-in-up">
        <img
          src={cowImage}
          alt="Cow"
          className="w-full max-w-xs md:max-w-sm hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>
    </section>
  );
};

export default FarmAbout;
