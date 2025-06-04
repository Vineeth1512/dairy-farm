import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Config/FirebaseConfiguration";

const UserDashboard = () => {
  const categories = ["All", "Milk", "Curd", "Ghee", "Butter"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    console.log("From useEffect");

    const fetchAllData = async () => {
      try {
        const dataDoc = collection(db, "owners");
        const animalData = await getDocs(dataDoc);
        let milkData = [];
        animalData.docs.map((doc) => {
          let singleMilkDoc = doc.data().milk || [];
          singleMilkDoc.map((item) => {
            milkData.push(item);
          });
        });
        console.log(milkData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllData();
  }, []);

  const products = [
    {
      name: "Cow Milk",
      price: 45,
      category: "Milk",
      img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/pro-2-1-240x180.jpg",
    },
    {
      name: "Buffalo Milk",
      price: 50,
      category: "Milk",
      img: "https://source.unsplash.com/featured/200x150/?buffalo,milk",
    },
    {
      name: "Fresh Curd",
      price: 30,
      category: "Curd",
      img: "https://source.unsplash.com/featured/200x150/?curd,dairy",
    },
    {
      name: "Homemade Ghee",
      price: 180,
      category: "Ghee",
      img: "https://source.unsplash.com/featured/200x150/?ghee,jar",
    },
    {
      name: "Butter",
      price: 90,
      category: "Butter",
      img: "https://source.unsplash.com/featured/200x150/?butter",
    },
    {
      name: "Creamy Curd",
      price: 35,
      category: "Curd",
      img: "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2019/01/gourmet-cheese-isolated-R8D44QX-768x672-1-240x180.png",
    },
    {
      name: "A2 Desi Ghee",
      price: 220,
      category: "Ghee",
      img: "https://source.unsplash.com/featured/200x150/?desi,ghee",
    },
    {
      name: "Salted Butter",
      price: 95,
      category: "Butter",
      img: "https://source.unsplash.com/featured/200x150/?butter,bread",
    },
  ];

  // Filter logic
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border font-medium text-sm transition ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border-green-500 hover:bg-green-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 md:col-span-1">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">
            Filters
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Price Range
            </h3>
            <input
              type="range"
              min={10}
              max={250}
              className="range range-success range-sm"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹10</span>
              <span>₹250</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Category</h3>
            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => (
                <label
                  key={cat}
                  className="flex items-center mb-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success mr-3"
                  />
                  {cat}
                </label>
              ))}
          </div>
        </aside>

        {/* Products */}
        <section className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
                <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-900 group-hover:text-green-700">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Fresh & organic dairy product
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xl font-bold text-green-700">
                    ₹{product.price}
                  </span>
                  <button className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
