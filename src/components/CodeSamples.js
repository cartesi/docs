import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { codeSamples } from "../data/code-samples";

const IconGitHub = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current flex-shrink-0"
  >
    <path
      d="M12 2C6.475 2 2 6.475 2 12C1.99768 16.3054 4.7529 20.1284 8.838 21.488C9.338 21.575 9.525 21.275 9.525 21.012C9.525 20.775 9.512 19.988 9.512 19.15C7 19.613 6.35 18.538 6.15 17.975C6.037 17.687 5.55 16.8 5.125 16.562C4.775 16.375 4.275 15.912 5.112 15.9C5.9 15.887 6.462 16.625 6.65 16.925C7.55 18.437 8.988 18.012 9.562 17.75C9.65 17.1 9.912 16.663 10.2 16.413C7.975 16.163 5.65 15.3 5.65 11.475C5.65 10.387 6.037 9.488 6.675 8.787C6.575 8.537 6.225 7.512 6.775 6.137C6.775 6.137 7.612 5.875 9.525 7.163C10.3391 6.93706 11.1802 6.82334 12.025 6.825C12.875 6.825 13.725 6.937 14.525 7.162C16.437 5.862 17.275 6.138 17.275 6.138C17.825 7.513 17.475 8.538 17.375 8.788C18.012 9.488 18.4 10.375 18.4 11.475C18.4 15.313 16.063 16.163 13.838 16.413C14.2 16.725 14.513 17.325 14.513 18.263C14.513 19.6 14.5 20.675 14.5 21.013C14.5 21.275 14.688 21.587 15.188 21.487C19.2582 20.1128 21.9988 16.296 22 12C22 6.475 17.525 2 12 2Z"
      fill="#1E1941"
    />
  </svg>
);

export const CodeSamples = () => {
  return (
    <div
      className="my-auto py-8 sm:py-12 lg:py-24 bg-yellow-500 dark:text-gray-900 scroll-m-20"
      id="code-samples"
    >
      <div className="container">
        <div className="max-w-screen-md mx-auto">
          <div className="mb-8 lg:mb-16">
            <h1 className="font-serif text-4xl lg:text-4xl xl:text-5xl font-normal mb-6 lg:mb-8">
              Code Samples
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {codeSamples.map((category) => (
              <div key={category.title}>
                <h2 className="font-serif text-2xl font-normal mb-4">
                  {category.title}
                </h2>
                <div className="flex gap-3">
                  <div className="flex flex-wrap gap-2">
                    {category.links.map((link, index) => (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={link.label}
                      >
                        {index > 0}
                        <IconGitHub />
                        <Link
                          className="text-current hover:underline hover:text-current"
                          to={useBaseUrl(link.href)}
                        >
                          {link.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
