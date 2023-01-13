import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Details from "@theme/Details";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { learn } from "../data/learn";

export const Learn = () => {
  const category = (category) => {
    const links = learn.filter((item) => item.category === category);
    return links.map((item) => (
      <Details
        className="details"
        summary={
          <summary className="text-lg sm:text-xl font-serif">
            {item.title}
          </summary>
        }
        key={item.title}
      >
        <div>
          <ul className="pl-4 marker:text-gray-500 m-0">
            {item.links.map((link) => (
              <li key={link.label}>
                <Link to={useBaseUrl(link.href)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Details>
    ));
  };

  return (
    <div
      className="my-auto py-8 sm:py-12 lg:py-24 bg-blue-50 text-gray-900 dark:text-gray-900 scroll-m-20"
      id="learn"
    >
      <div className="container">
        <div className="max-w-screen-md mx-auto">
          <div className="mb-0 sm:mb-8 flex flex-col sm:flex-row justify-between">
            <h1 className="font-serif text-4xl lg:text-4xl xl:text-5xl font-normal ">
              Learn
            </h1>
            <Tabs
              groupId="learn"
              defaultValue="by-goal"
              className="tabs--tabs-only"
              values={[
                { label: "by goal", value: "by-goal" },
                { label: "by role", value: "by-role" },
              ]}
            >
              {/* fix not to use a custom comp only for here */}
              <TabItem value="by-goal"></TabItem>
            </Tabs>
          </div>

          <Tabs
            groupId="learn"
            defaultValue="by-goal"
            className="tabs--content-only"
            values={[
              { label: "by-goal", value: "by-goal" },
              { label: "by-role", value: "by-role" },
              { label: "by product", value: "by-product" },
            ]}
          >
            <TabItem value="by-goal">{category("by-goal")}</TabItem>
            <TabItem value="by-role">{category("by-role")}</TabItem>
            <TabItem value="by-product">{category("by-product")}</TabItem>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
