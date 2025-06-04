// FeaturesSection.jsx
import React from "react";
import { FaCow, FaBoxOpen, FaChartBar, FaHandsWash } from "react-icons/fa";
import { GiMilkCarton } from "react-icons/gi";

const services = [
  {
    title: "Animal Management",
    icon: <FaCow className="text-4xl text-green-600" />,
    desc: "Track and manage cows and buffaloes easily.",
  },
  {
    title: "Milk Collection",
    icon: <GiMilkCarton className="text-4xl text-blue-500" />,
    desc: "Record morning and evening milk collection.",
  },
  {
    title: "Product Sales",
    icon: <FaBoxOpen className="text-4xl text-yellow-500" />,
    desc: "Sell dairy products like ghee, butter, and cheese.",
  },
  {
    title: "Analytics & Reports",
    icon: <FaChartBar className="text-4xl text-purple-500" />,
    desc: "View milk production, sales, and revenue charts.",
  },
  {
    title: "Hygienic Practices",
    icon: <FaHandsWash className="text-4xl text-pink-500" />,
    desc: "Follow clean and healthy animal care routines.",
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-milkwhite text-richbrown">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          🔑 Key Features
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="card bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-200"
            >
              <div className="card-body items-center text-center">
                {item.icon}
                <h3 className="card-title mt-3 text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
