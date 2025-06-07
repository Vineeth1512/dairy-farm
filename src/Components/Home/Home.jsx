import React from "react";
import AutoCarousel from "../AutoCarousel/AutoCarousel";
import FeaturesService from "./FeaturesServices/FeaturesServices";
import FarmAbout from "./FarmAbout/FarmAbout";
import MeetFarmers from "./MeetFarmers/MeetFarmers";

const Home = () => {
  return (
    <>
      <AutoCarousel />
      <FeaturesService />
      {/* <FarmAbout /> */}

      <MeetFarmers />
    </>
  );
};

export default Home;
