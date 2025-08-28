"use client";

import { useState, useEffect } from "react";
import { TbArrowUp } from "react-icons/tb";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 right-6 z-50 
        p-3 rounded-full shadow-lg 
        bg-brand-green hover:bg-brand-darkGreen transition-all duration-300 cursor-pointer text-white 
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <TbArrowUp size={24} />
    </button>
  );
}
