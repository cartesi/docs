import * as React from "react";
import Logo from "/img/logo_dark.svg";

const FooterBottom = () => {
  return (
    <footer className="bg-gray-900 py-8 text-sm  text-yellow-50 lg:py-12 xl:py-16">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row ">
          <div className="flex justify-between gap-12 lg:gap-24">
            <div>
              <div className="mb-6 flex flex-col gap-2">
                <div>
                  <a
                    href={`//cartesi.io/blockchain-os`}
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    Blockchain OS
                  </a>
                </div>
                <div>
                  <a
                    href={`//cartesi.io/ctsi-token`}
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    CTSI Token
                  </a>
                </div>
                <div>
                  <a
                    href={`//cartesi.io/labs`}
                    className="hover:text-yellow-50 text-gray-200"
                  >
                    Labs
                  </a>
                </div>
                <div>
                  <a
                    href={`//cartesi.io/about`}
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    About
                  </a>
                </div>
                <div>
                  <a
                    href={`//cartesi.io/people`}
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    People
                  </a>
                </div>
                <div>
                  <a
                    href={`//docs.cartesi.io`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    Docs
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6 flex flex-col gap-2">
                <div>
                  <a
                    href="//cartesi.io/cartesi_whitepaper.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    Our whitepaper
                  </a>
                </div>
                <div>
                  <a
                    href="//cartesi.io/foundation_notice.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    Foundation Notice
                  </a>
                </div>
              </div>
              <div itemScope itemType="https://schema.org/Organization">
                <p
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  Contacts:
                  <br />
                  <span itemProp="streetAddress">
                    3 Fraser Street, #05-25, Duo Tower
                  </span>
                  , <span itemProp="addressLocality">Singapore</span>,{" "}
                  <span itemProp="postalCode">189352</span>
                  <br />
                  <a
                    href="mailto:hello@cartesi.io"
                    itemProp="email"
                    className="text-yellow-50 hover:text-gray-200 hover:no-underline"
                  >
                    hello@cartesi.io
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6 flex justify-center sm:mb-0">
            <Logo width="213" height="73" />
          </div>
        </div>
        <p className="mt-4 text-[.75rem] text-gray-400">
          All rights reserved © Cartesi Foundation Ltd.
          <br />
          The Cartesi Project is commissioned by the Cartesi Foundation. The
          Blockchain OS is a trademark of the Cartesi Foundation.
        </p>
      </div>
    </footer>
  );
};
export default FooterBottom;
