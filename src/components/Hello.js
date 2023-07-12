import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { hello } from "../data/hello";

export const Hello = () => {
  return (
    <div className="my-auto py-8 sm:py-12 lg:py-24 flex flex-col justify-center xl:min-h-[60vh]">
      <div className="container">
        <div className="mb-8 lg:mb-16">
          <h1 className="text-4xl sm:text-7xl font-semibold text-center mb-6 lg:mb-8 tracking-tight">
            Welcome to Cartesi docs.
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {hello.slice(0, 3).map(({ title, href, description }, idx) => (
            <Link
              to={useBaseUrl(href)}
              activeClassName="active"
              key={idx}
              className="card no-underline hover:no-underline text-inherit !hover:text-text-gray-900 dark:!hover:text-white"
            >
              <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
                <h2 className="sm:!text-3xl !mb-4 !text-gray-900 dark:!text-secondary">
                  {title}
                </h2>
                <div className="text-gray-900/70 dark:text-white">
                  {description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
