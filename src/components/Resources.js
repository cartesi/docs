import React from "react";
import Link from "@docusaurus/Link";
import IconExternalLink from "@theme/Icon/ExternalLink";
import isInternalUrl from "@docusaurus/isInternalUrl";
export default function Resources({ resources }) {
  return (
    <div className="flex gap-3 mt-6">
      <span className="shrink-0 -mt-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current w-4 h-4 text-primary"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.81818 0C2.79442 0 2 0.811439 2 1.85714V11.1429C2 12.1886 2.79442 13 3.81818 13H4.27273H11.5455C11.7965 13 12 12.7921 12 12.5357V3.25C12 2.99358 11.7965 2.78571 11.5455 2.78571L4.27273 2.78571L3.81818 2.78571C3.29649 2.78571 2.90909 2.39001 2.90909 1.85714C2.90909 1.32428 3.29649 0.928571 3.81818 0.928571H11.5455C11.7965 0.928571 12 0.720704 12 0.464286C12 0.207868 11.7965 0 11.5455 0H3.81818ZM3.81818 3.71429C3.4842 3.71429 3.17463 3.62793 2.90909 3.47526V11.1429C2.90909 11.6757 3.29649 12.0714 3.81818 12.0714V3.71429ZM4.72727 12.0714V3.71429H11.0909V12.0714H4.72727ZM3.36364 1.85714C3.36364 1.60072 3.56714 1.39286 3.81818 1.39286H11.5455C11.7965 1.39286 12 1.60072 12 1.85714C12 2.11356 11.7965 2.32143 11.5455 2.32143H3.81818C3.56714 2.32143 3.36364 2.11356 3.36364 1.85714Z"
            fill="#008DA5"
          />
        </svg>
      </span>

      <div>
        <h3 className="text-[0.8rem] mb-2 text-primary">
          Useful resources to learn more
        </h3>
        <ul className="p-0 m-0 list-none text-[0.8rem] flex flex-col gap-2 text-gray-700 dark:text-gray-300">
          {resources.map((resource, i) => (
            <li key={i}>
              <Link href={resource.url} className={"text-current"}>
                {resource.title}
                {!isInternalUrl(resource.href) && <IconExternalLink />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
