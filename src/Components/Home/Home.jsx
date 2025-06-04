import React from "react";
import AutoCarousel from "../AutoCarousel/AutoCarousel";
import FeaturesService from "./FeaturesServices/FeaturesServices";
import FarmAbout from "./FarmAbout/FarmAbout";

const Home = () => {
  return (
    <>
      <AutoCarousel />
      <FeaturesService />
      {/* <FarmAbout /> */}
    </>
  );
};

export default Home;
