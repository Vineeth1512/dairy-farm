import React from "react";
import { ChevronRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Best Animal Selection",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      image: "https://themewagon.github.io/milky/img/service-1.jpg",
    },
    {
      title: "Breeding & Veterinary",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      image: "https://themewagon.github.io/milky/img/service-2.jpg",
    },
    {
      title: "Care & Milking",
      description:
        "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet.",
      image: "https://themewagon.github.io/milky/img/service-3.jpg",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-white text-center">
      {/* Header */}
      <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
        Our Services
      </p>
      <h2 className="text-3xl md:text-4xl font-serif text-[#9e673d] mb-10">
        Services That We Offer
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
        {services.map((service, index) => (
          <div key={index} className="relative group pb-8">
            {/* Circle Image positioned outside the card */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
              <div className="w-24 h-24 rounded-full border-8 border-[#f7a974] shadow-md overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl pt-16 pb-10 px-6 shadow-lg group-hover:shadow-2xl transition duration-500 relative overflow-hidden">
              {/* Background image on hover */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition duration-500"
                style={{ backgroundImage: `url(${service.image})` }}
              ></div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-500 z-0" />

              {/* Text content */}
              <div className="relative z-10 text-center group-hover:text-white transition">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-sm mt-3 text-gray-500 group-hover:text-gray-200">
                  {service.description}
                </p>
                <button className="mt-6 w-9 h-9 rounded-full bg-white group-hover:bg-[radial-gradient(circle,#f7a974,#9e673d)] shadow-md flex items-center justify-center mx-auto transition duration-300">
                  <ChevronRight
                    size={18}
                    className="text-yellow-500 group-hover:text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
