/* ! Note - there are small changes in the css - different from the marketing site */
/* ! Warning - running https://docusaurus.io/docs/swizzling and selecting the footer comp - will overried this file  */

import React from "react";
import FooterBar from "./footerBar";
import FooterBottom from "./footerBottom";

function Footer() {
  return (
    <>
      <FooterBar />
      <FooterBottom />
    </>
  );
}

export default React.memo(Footer);
