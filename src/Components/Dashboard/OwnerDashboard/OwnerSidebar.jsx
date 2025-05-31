import React from "react";
import { Link } from "react-router-dom";
const OwnerSidebar = () => {
  return (
    <div className="container w-48 h-full bg-green-200 p-4 ">
      <Link to={"addAnimal"}>
        <button className="btn bg-green-400 my-2  text-left p-2 w-full border-collapse font-bold hover:bg-green-600">
          Post Animal
        </button>
      </Link>
      <Link to={"allAnimals"}>
        <button className="btn bg-green-400 my-2  text-left p-2 w-full border-collapse font-bold hover:bg-green-600">
          All Animals
        </button>
      </Link>
    </div>
  );
};

export default OwnerSidebar;
