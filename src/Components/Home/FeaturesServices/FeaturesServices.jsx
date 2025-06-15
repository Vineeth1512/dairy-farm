import React from "react";
import { FaBoxOpen, FaChartBar, FaHandsWash } from "react-icons/fa";
import { GiCow, GiMilkCarton } from "react-icons/gi";

const services = [
  {
    title: "Animal Management",
    icon: (
      <GiCow className="text-5xl text-green-600 group-hover:scale-110 transition-transform" />
    ),
    desc: "Track and manage cows and buffaloes easily.",
    color: "bg-green-50",
  },
  {
    title: "Milk Collection",
    icon: (
      <GiMilkCarton className="text-5xl text-blue-500 group-hover:scale-110 transition-transform" />
    ),
    desc: "Record morning and evening milk collection.",
    color: "bg-blue-50",
  },
  {
    title: "Product Sales",
    icon: (
      <FaBoxOpen className="text-5xl text-yellow-500 group-hover:scale-110 transition-transform" />
    ),
    desc: "Sell dairy products like ghee, butter, and cheese.",
    color: "bg-yellow-50",
  },
  {
    title: "Analytics & Reports",
    icon: (
      <FaChartBar className="text-5xl text-purple-500 group-hover:scale-110 transition-transform" />
    ),
    desc: "View milk production, sales, and revenue charts.",
    color: "bg-purple-50",
  },
  {
    title: "Hygienic Practices",
    icon: (
      <FaHandsWash className="text-5xl text-pink-500 group-hover:scale-110 transition-transform" />
    ),
    desc: "Follow clean and healthy animal care routines.",
    color: "bg-pink-50",
  },
  {
    title: "Cow Collection",
    icon: (
      <GiMilkCarton className="text-5xl text-orange-300 group-hover:scale-110 transition-transform" />
    ),
    desc: "Record morning and evening milk collection.",
    color: "bg-orange-50",
  },
];

const FeaturesService = () => {
  return (
    <section className="py-16 bg-[#FAF7E6] text-[#3c2a1e]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-14">
          🔑 Our Key Features
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {services.map((item, idx) => (
            <div
              key={idx}
              className={`group card ${item.color} border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 ease-in-out`}
            >
              <div className="card-body items-center text-center p-6">
                <div className="mb-4">{item.icon}</div>
                <h3 className="card-title text-2xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesService;
