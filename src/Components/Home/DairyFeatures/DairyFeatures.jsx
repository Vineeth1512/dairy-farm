import React from "react";

const DairyFeatures = () => {
  return (
    <div
      className="relative py-20 px-4 md:px-8 lg:px-20 text-white bg-cover bg-center"
      style={{
        backgroundImage: `url('https://themewagon.github.io/milky/img/banner.jpg')`,
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Card 1 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src="https://themewagon.github.io/milky/img/banner-1.jpg"
            alt="cow1"
            className="w-full sm:w-52 md:w-56 h-56 sm:h-64 object-cover rounded-xl shadow-lg"
          />
          <div className="text-center sm:text-left px-2 sm:px-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              We Sell Best <br /> Dairy Products
            </h2>
            <p className="text-base md:text-lg mt-3 text-gray-300">
              Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo
              justo magna dolore erat amet
            </p>
            <button className="btn btn-warning mt-5 px-6 text-base rounded-full">
              Read More
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src="https://themewagon.github.io/milky/img/banner-2.jpg"
            alt="cow2"
            className="w-full sm:w-52 md:w-56 h-56 sm:h-64 object-cover rounded-xl shadow-lg"
          />
          <div className="text-center sm:text-left px-2 sm:px-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              We Deliver Fresh <br /> Milk Worldwide
            </h2>
            <p className="text-base md:text-lg mt-3 text-gray-300">
              Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo
              justo magna dolore erat amet
            </p>
            <button className="btn btn-warning mt-5 px-6 text-base rounded-full">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DairyFeatures;
