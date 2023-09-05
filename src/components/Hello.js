import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { hello } from "../data/hello";

export const Hello = () => {
  const buttonStyle = {
    padding: "0.75rem 0.75rem",
    textAlign: "center",
    textDecoration: "none",
    backgroundColor: "#1B1A1E",
    color: "#fff",
    borderRadius: "0.25rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    width: "100%",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    marginTop: "1.5rem",
  };

  return (
    <div className="my-auto py-8 sm:py-12 lg:py-24 flex flex-col justify-center xl:min-h-[60vh]">
      <div className="container">
        <div className="mb-8 lg:mb-16">
          <h1 className="text-4xl sm:text-7xl font-semibold text-center mb-6 lg:mb-8 tracking-tight">
            Welcome to Cartesi docs.
          </h1>
          <p className="text-2xl text-center">
            Cartesi: Application-specific rollups with a Linux runtime.
          </p>
          <p className="text-2xl text-center">
            Cartesi provides your DApp with a dedicated CPU and rollup, enhancing computational scalability while preserving decentralization, security, and censorship resistance.
          </p>
          <p className="text-2xl text-center">
            With the Cartesi Virtual Machine, you can use familiar libraries, languages and tooling, moving beyond the EVM.
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
                      Dev docs
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