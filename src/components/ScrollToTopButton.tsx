import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Button from "./Button";

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      icon={<FaArrowUp size={28} />}
      className={`${
        visible ? "opacity-1 z-50" : "opacity-0 -z-50"
      } fixed transition-all duration-300 size-14 bottom-6 right-4 border-none shadow-[2px_5px_10px_rgba(0,0,0,0.5)] rounded-full flex items-center justify-center`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    />
  );
};

export default ScrollToTopButton;
