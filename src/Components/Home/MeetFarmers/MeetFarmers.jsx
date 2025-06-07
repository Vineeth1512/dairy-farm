import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGoogle,
} from "react-icons/fa";

const farmers = [
  {
    name: "John Michale",
    role: "Field Farmer",
    img: "https://dairy-farm-html.ancorathemes.com/images/team-2-370x370.jpg",
  },
  {
    name: "Mark John",
    role: "A Chief Accountant",
    img: "https://dairy-farm-html.ancorathemes.com/images/team-4-370x370.jpg",
  },
  {
    name: "Merry Desulva",
    role: "A Business Owner",
    img: "https://dairy-farm-html.ancorathemes.com/images/team-3-370x370.jpg",
  },
  {
    name: "Moris Jon",
    role: "A Tractor Driver",
    img: "https://dairy-farm-html.ancorathemes.com/images/team-1-370x370.jpg",
  },
];

export default function MeetFarmers() {
  return (
    <section
      className="text-center py-20 px-4 text-[#533620]"
      style={{
        backgroundImage:
          "url('https://dairy-farm-html.ancorathemes.com/images/big_bg.jpg')",
      }}
    >
      <h1 className="text-4xl font-bold mb-6 text-[#533620]">
        Meet Our Farmers
      </h1>
      <p className="mb-10 text-[#ffff]">
        It’s at the farm, in the store and on your table. Dairy is feeding
        people today for whatever comes tomorrow.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {farmers.map((farmer, index) => (
          <div
            key={index}
            className="relative group flex flex-col items-center text-center"
          >
            <div className="rounded-full overflow-hidden w-40 h-40 relative">
              <img
                src={farmer.img}
                alt={farmer.name}
                className="w-full h-full object-cover"
              />

              {/* Social Media Icons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                <a
                  href="#"
                  className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800"
                >
                  <FaGoogle />
                </a>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-bold text-yellow-500">
              {farmer.name}
            </h3>
            <p className="text-gray-500">{farmer.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
