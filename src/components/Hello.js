import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { hello } from "../data/hello";

export const Hello = () => {
  const buttonStyle = {
    display: "inline-block",
    padding: "10px 20px",
    textDecoration: "none",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: "5px",
    margin: "5px",
    fontWeight: "bold", 
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px"
  };

  return (
    <div className="my-auto py-8 sm:py-12 lg:py-24 flex flex-col justify-center xl:min-h-[60vh]">
      <div className="container">
        <div className="mb-8 lg:mb-16">
          <h1 className="text-4xl sm:text-7xl font-semibold text-center mb-6 lg:mb-8 tracking-tight">
            Welcome to Cartesi docs.
          </h1>
          <p className="text-2xl text-center">
          Cartesi is an application-specific rollups framework that can execute DApps with the full support of a Linux runtime along with existing Linux toolchains. Cartesi Rollups ecosystem is based on a special RISC-V-based VM - the Cartesi Machine - which is capable of running Linux or other operating systems within a rollups framework. This enables the development of scalable DApps in traditional programming languages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {hello.slice(0, 3).map(({ title, href, description }, idx) => (
            <Link
              to={useBaseUrl(href)}
              activeClassName="active"
              key={idx}
              className="card bg-secondary dark:bg-secondary !text-gray-900 dark:!text-gray-900 no-underline hover:no-underline text-inherit !hover:text-text-gray-900 dark:!hover:text-white"
            >
              <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
                <h2 className="sm:!text-3xl !mb-4 !text-gray-900">{title}</h2>
                <div className="text-gray-900/70">{description}</div>
                {title === "Rollups" && (
                  <div style={buttonContainerStyle}>
                    <Link
                      to={useBaseUrl(href)}
                      activeClassName="active"
                      style={buttonStyle}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Learn more
                    </Link>
                    <Link
                      to={useBaseUrl(href + "/build-dapps")}
                      activeClassName="active"
                      style={buttonStyle}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Start building
                    </Link>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
