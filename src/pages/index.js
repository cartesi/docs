import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./index.module.css";
import { features } from "../data/features";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Homepage" description="Cartesi">
      <div className="my-auto py-8 sm:py-12">
        <div className="container">
          <h1 class="font-serif text-4xl lg:text-6xl xl:text-7xl text-center font-normal mb-6 sm:mb-8 lg:mb-16">
            Hello, developer.
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {features &&
              features.map(({ title, description, linkUrl, bgColor }, idx) => (
                <Link
                  to={useBaseUrl(linkUrl)}
                  activeClassName="active"
                  key={idx}
                  className="text-gray-900 no-underline hover:no-underline hover:text-gray-900 lg:hover:scale-105 transition-transform"
                >
                  <div
                    className="flex h-full p-4 sm:p-6 lg:p-10"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="details col-10">
                      <h2 className="title">{title}</h2>
                      <div className="description">{description}</div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
