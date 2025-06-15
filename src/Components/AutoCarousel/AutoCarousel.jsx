import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://demo.htmlcodex.com/2616/dairy-website-template/img/carousel-1.jpg",
    quote: "Fresh Milk, Straight from the Farm",
    subtext: "Nourishing lives every single day.",
  },
  {
    image:
      "https://el.commonsupport.com/newwp/hankcok/wp-content/uploads/2020/07/news-7.jpg",
    quote: "Healthy Cows, Pure Milk",
    subtext: "Naturally raised, ethically produced.",
  },
  {
    image:
      "https://thumbs.dreamstime.com/b/stunning-aerial-perspective-thriving-dairy-farm-lush-pastureland-happy-cows-promise-fresh-breathtaking-view-351438340.jpg",
    quote: "Nature’s Goodness in Every Drop",
    subtext: "From green pastures to your glass.",
  },
  {
    image:
      "https://images.squarespace-cdn.com/content/v1/5eb43938f468c330e7d8d665/565985a9-b6cf-460a-90b0-f22fc4cdc5ca/Cows%2Bat%2BStonewall%2BDairy%2Bphoto%2Bcredit%2BAnne%2BReese%2BPhotography.JPG",
    quote: "Tradition of Purity",
    subtext: "Preserving the heritage of dairy farming.",
  },
  {
    image:
      "https://thumbs.dreamstime.com/b/water-buffalo-herd-green-grass-under-trees-yellow-fields-background-herd-water-buffalo-stands-lush-green-grass-358941291.jpg",
    quote: "Buffalo Milk, Bold Taste",
    subtext: "Rich in tradition and nutrients.",
  },
];

export default function AutoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto">
      {/* Carousel Container */}
      <div className="carousel w-full h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item relative w-full h-[80vh] ${
              index === activeIndex ? "" : "hidden"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center px-6">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {slide.quote}
                </h1>
                <p className="mt-4 text-lg md:text-2xl">{slide.subtext}</p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <button
                onClick={() =>
                  setActiveIndex(
                    (activeIndex - 1 + slides.length) % slides.length
                  )
                }
                className="btn btn-circle bg-white text-black hover:bg-gray-300"
              >
                ❮
              </button>
              <button
                onClick={() =>
                  setActiveIndex((activeIndex + 1) % slides.length)
                }
                className="btn btn-circle bg-white text-black hover:bg-gray-300"
              >
                ❯
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots/Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? "bg-[#784b28]" : "bg-[#f9d7c0]"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
