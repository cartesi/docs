/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: "Cartesi",
  tagline: "Bringing real world computations to the blockchain",
  url: "https://cartesi.io",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "cartesi", // Usually your GitHub org/user name.
  projectName: "cartesi", // Usually your repo name.
  themeConfig: {
    defaultDarkMode: false,
    disableDarkMode: true,
    navbar: {
      logo: {
        alt: "Cartesi Logo",
        src: "img/logo-black.svg",
        srcDark: "img/logo.svg",
      },
      links: [
      ],
    },
    prism: {
      additionalLanguages: ["lua"],
    },
    footer: {
      style: "dark",
      links: [
      ],
      logo: {
        alt: "Cartesi Logo",
        src: "https://cartesi.io/images/cartesi-logo.svg",
      },
      copyright: `Copyright © ${new Date().getFullYear()} Cartesi Ltd. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: '/',
          homePageId: 'intro',
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
