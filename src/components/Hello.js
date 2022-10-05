import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { hello } from "../data/hello";

export const Hello = () => {
  return (
    <div className="my-auto py-8 sm:py-12 lg:py-24 flex flex-col justify-center xl:min-h-[60vh] dark:text-yellow-50">
      <div className="container">
        <div className="mb-8 lg:mb-16">
          <h1 className="font-serif text-4xl sm:text-7xl xl:text-8xl text-center font-normal mb-6 lg:mb-8">
            Hello, developer.
          </h1>
          <p className="font-serif text-lg md:text-2xl lg:text-3xl text-center mx-auto max-w-5xl">
          The home for Blockchain OS documentation and learning for all kinds of developers, blockchain technology professionals, and researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {hello.map(({ title, href, description, bgColor, color }, idx) => (
            <Link
              to={useBaseUrl(href)}
              activeClassName="active"
              key={idx}
              className="no-underline hover:no-underline lg:hover:scale-105 transition-transform"
            >
              <div
                className="flex flex-col h-full p-4 sm:p-6 lg:p-8"
                style={{
                  backgroundColor: bgColor,
                  color: color ? color : "var(--ifm-color-gray-900)",
                }}
              >
                <h2>{title}</h2>
                <div className="leading-tight">{description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
