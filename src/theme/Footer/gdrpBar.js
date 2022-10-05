import React from "react";

const GdrpBar = ({ hideGdprBar }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white">
      <div>
        We use cookies to ensure that we give you the best experience on our
        website. By using the website, you agree to the use of cookies.
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          className="inline-flex items-center justify-center bg-blue-300/50 text-white border-0 px-3 py-1 font-bold leading-normal  hover:text-white hover:no-underline cursor-pointer"
          onClick={hideGdprBar}
        >
          OK
        </button>
        <a
          href="https://cartesi.io/privacy_policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-blue-300/50 text-white border-0 px-3 py-1 font-bold leading-normal  hover:text-white hover:no-underline cursor-pointer"
        >
          PRIVACY POLICY
        </a>
      </div>
    </div>
  );
};

export default GdrpBar;
