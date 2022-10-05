import React, { useState, useEffect } from "react";
import GdrpBar from "./gdrpBar";
import SocialBar from "./socialBar";

const FooterBar = () => {
  const [isGdprBarHidden, setIsGdprBarHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const hideGdprBar = () => {
    sessionStorage.setItem("isGdprBarHidden", true);
    setIsGdprBarHidden(true);
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const isHidden = sessionStorage.getItem("isGdprBarHidden");
    setIsGdprBarHidden(Boolean(isHidden));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isHome = path === "/" || path === "/en/" || path === "";

  return (
    <div className="  bg-blue-500/95 sticky inset-x-0 bottom-0 z-50 flex flex-col py-3  text-white transition-all duration-500 ease-in-out">
      <div className="container">
        {isScrolled || isGdprBarHidden ? (
          <SocialBar />
        ) : isGdprBarHidden ? null : (
          <GdrpBar hideGdprBar={hideGdprBar} />
        )}
      </div>
    </div>
  );
};

export default FooterBar;
