import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react"; // optional: for icon

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="btn bg-[radial-gradient(circle,#f7a974,#9e673d)] fixed bottom-6 right-6 shadow-lg rounded-full p-3 z-[999]"
      >
        <ArrowUpIcon size={20} />
      </button>
    )
  );
};

export default ScrollToTopButton;
