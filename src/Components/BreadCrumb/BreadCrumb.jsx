import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({ title, breadcrumbs }) => {
  return (
    <div
      className="hero h-64 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://dairy-farm.ancorathemes.com/wp-content/uploads/2016/09/title_bg.jpg')`, // Replace with actual image path
      }}
    >
      <div className="hero-overlay bg-black bg-opacity-50"></div>

      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-2 text-4xl font-bold text-white tracking-widest">
            {title}
          </h1>

          <div className="text-sm breadcrumbs text-white">
            <ul className="flex justify-center">
              {breadcrumbs.map((item, index) => (
                <li key={index}>
                  {item.to ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
