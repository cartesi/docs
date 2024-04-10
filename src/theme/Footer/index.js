/* ! Note - there are small changes in the css - different from the marketing site */
/* ! Warning - running https://docusaurus.io/docs/swizzling and selecting the footer comp - will overried this file  */

import React from "react";
import Logo from "/img/logo_dark.svg";
import GdrpBar from "./gdrpBar";
import FooterNav from "./FooterNav";

function Footer() {
  function getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }
  
  return (
    <div className="bg-gray-900 py-8 sm:py-16 text-sm">
      <div className="container">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-32">
            <div className="flex flex-col gap-8">
              <Logo />
            </div>
            <FooterNav />
          </div>
          <div className="flex items-center justify-between gap-4 text-xs text-white">
            <p>© {getCurrentYear()} Cartesi Foundation Ltd. All rights reserved.</p>
            <p>
              The Cartesi Project is commissioned by the Cartesi Foundation.
            </p>
          </div>
        </div>
      </div>

      <GdrpBar />
    </div>
  );
}

export default React.memo(Footer);
