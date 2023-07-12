import React, { useEffect, useState } from "react";

const GdrpBar = () => {
  const [isGdprBarHidden, setIsGdprBarHidden] = useState(false);
  const hideGdprBar = () => {
    sessionStorage.setItem("isGdprBarHidden", true);
    setIsGdprBarHidden(true);
  };

  useEffect(() => {
    const isHidden = sessionStorage.getItem("isGdprBarHidden");
    setIsGdprBarHidden(Boolean(isHidden));
  }, []);

  return isGdprBarHidden ? null : (
    <div className=" fixed inset-x-0 bottom-0 bg-gray-900/80 py-3 backdrop-blur">
      <div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-white">
        <div>
          We use cookies to ensure that we give you the best experience on our
          website. By using the website, you agree to the use of cookies.
        </div>
        <div className="flex items-center justify-center gap-2">
          <a
            href="https://cartesi.io/privacy_policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-transparent border rounded border-secondary  border-1 border-solid text-white px-3 py-1 font-bold leading-normal  hover:text-white hover:no-underline cursor-pointer"
          >
            PRIVACY POLICY
          </a>
          <button
            className="inline-flex items-center justify-center bg-secondary rounded text-gray-900 border-secondary border-1 border-solid px-3 py-1 font-bold leading-normal  hover:text-gray-900 hover:no-underline cursor-pointer"
            onClick={hideGdprBar}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default GdrpBar;
