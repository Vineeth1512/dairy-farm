import React from "react";
import AutoCarousel from "../AutoCarousel/AutoCarousel";
import FeaturesService from "./FeaturesServices/FeaturesServices";
import FarmAbout from "./FarmAbout/FarmAbout";
import MeetFarmers from "./MeetFarmers/MeetFarmers";
import DairyFeatures from "./DairyFeatures/DairyFeatures";
import ServicesSection from "./ServicesSection/ServicesSection";
import ProductSection from "./ProductSection/ProductSection";

const Home = () => {
  return (
    <>
      <AutoCarousel />
      <ProductSection />
      <DairyFeatures />
      <ServicesSection />
      <FeaturesService />

      {/* <FarmAbout /> */}

      <MeetFarmers />
    </>
  );
};

export default Home;
