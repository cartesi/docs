// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const replacementPlugin = require("./src/remark/replacement").default;

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Cartesi Documentation",
  tagline: "Application-specific rollups with a Linux runtime.",
  url: "https://docs.cartesi.io",
  baseUrl: "/",
  trailingSlash: true,
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "cartesi", // Usually your GitHub org/user name.
  projectName: "cartesi", // Usually your repo name.
  scripts: ["/js/index.js"],
  // markdown: { format: "md" }, // NOTE: Use this to disable MDX and use MD instead
  presets: [
    [
      "classic",

      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          docItemComponent: "@theme/ApiItem",
          // Please change this to your repo.
          editUrl: "https://github.com/cartesi/docs/tree/develop",

          remarkPlugins: [replacementPlugin],
          admonitions: {
            keywords: [
              "note",
              "tip",
              "danger",
              "info",
              "caution",
              "goal",
              "troubleshoot",
            ],
          },
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "GTM-NGX36B79",
          anonymizeIP: true,
        },

        googleTagManager: {
          containerId: "GTM-NGX36B79",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      typesense: {
        typesenseCollectionName: "cartesi_1724150916",

        typesenseServerConfig: {
          nodes: [
            {
              host: "rjh5fcveu4z3l7oqp-1.a1.typesense.net",
              port: 443,
              protocol: "https",
            },
          ],
          apiKey: "FMbnaJ3rp6NHGCzzi6obgDTDy2lGoAiv",
        },

        // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
        typesenseSearchParameters: {},

        // Optional
        contextualSearch: true,
      },
      hotjar: {
        applicationId: "3103959",
      },
      image: "img/socialLogo2023.png",
      navbar: {
        logo: {
          alt: "Cartesi Logo",
          src: "img/logo.svg",
          srcDark: "img/logo_dark.svg",
          height: "52px",
        },
        items: [
          // {
          //   type: "dropdown",
          //   label: "Tools",
          //   position: "left",
          //   items: [
          //     {
          //       label: "NoNodo",
          //       href: "https://github.com/gligneul/nonodo/blob/main/README.md",
          //     },
          //     { label: "Cartesi Scan", href: "https://cartesiscan.io/" },
          //   ],
          // },
          // {
          //   type: "dropdown",
          //   label: "Learn",
          //   position: "left",
          //   items: [
          //     {
          //       label: "Free Udemy Course",
          //       href: "https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass",
          //     },
          //     // {
          //     //   label: "Cartesi Machine",
          //     //   href: "/machine/",
          //     // },
          //   ],
          // },
          {
            label: "Get Started",
            to: "/get-started",
            activeBaseRegex: "^/get-started",
            position: "left",
          },
          {
            label: "Rollups",
            to: "/cartesi-rollups/1.5",
            activeBaseRegex: "^/cartesi-rollups",
            position: "left",
          },
          {
            label: "Fraud Proofs",
            to: "/fraud-proofs",
            activeBaseRegex: "^/fraud-proofs",
            position: "left",
          },
          {
            type: "search",
            className: "navbar-search-custom",
            position: "right",
          },
          {
            to: "https://discord.gg/cWGbyFkQ2W",
            position: "right",
            className: "header-discord-link",
            "aria-label": "Discord",
          },
          {
            to: "https://github.com/cartesi/docs/",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      announcementBar: {
        id: "mainnet",
        // content:
        //   'Cartesi Rollups is Mainnet Ready! {{balance}} in {{symbol}} is up for grabs... if you can <a href="https://honeypot.cartesi.io/" target="_blank" rel="noopener noreferrer">hack Cartesi Rollups</a>.',
        content:
          'Build your most ambitious dApp yet with Cartesi - grant applications open! <a href="https://bit.ly/49EE31V" target="_blank" rel="noopener noreferrer">APPLY NOW</a>',
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        textColor: "#FFFFFF",
        isCloseable: true,
      },
      footer: {
        links: [
          {
            title: "Ecosystem",
            items: [
              {
                label: "Cartesi",
                to: "https://cartesi.io/",
              },
              {
                label: "Our Whitepaper",
                to: "https://cartesi.io/cartesi_whitepaper.pdf",
              },
              {
                label: "Foundation Notice",
                to: "https://cartesi.io/foundation_notice.pdf",
              },
            ],
          },
          {
            title: "Developers",
            items: [
              {
                label: "Template dApp",
                to: "https://github.com/cartesi/rollups-examples/tree/main/custom-dapps",
              },
              {
                label: "Tech Articles",
                to: "https://medium.com/cartesi/tagged/tech",
              },
              {
                label: "Bug Bounty",
                to: "https://immunefi.com/bounty/cartesi/",
              },
              {
                label: "Run a Node",
                to: "https://explorer.cartesi.io/staking",
              },
              {
                label: "CIP Process",
                to: "https://github.com/cartesi/cips",
              },
            ],
          },
          {
            title: "Github",
            items: [
              {
                label: "Rollups Examples",
                to: "https://github.com/cartesi/rollups-examples",
              },
              {
                label: "Machine Emulator",
                to: "https://github.com/cartesi/machine-emulator-tools",
              },
              {
                label: "Noether Node",
                to: "https://github.com/cartesi/noether",
              },
              {
                label: "Cartesi Compute Tutorials",
                to: "https://github.com/cartesi/compute-tutorials",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Youtube",
                to: "https://www.youtube.com/c/Cartesiproject/videos",
              },
              {
                label: "Discord",
                to: "https://discord.gg/cWGbyFkQ2W",
              },
              {
                label: "Medium",
                to: "https://www.medium.com/cartesi",
              },
              {
                label: "Twitter",
                to: "https://www.twitter.com/cartesiproject",
              },
              {
                label: "Telegram",
                to: "https://t.me/cartesiannouncements",
              },
              {
                label: "Reddit",
                to: "https://www.reddit.com/r/cartesi/",
              },
            ],
          },
        ],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 2,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["lua"],
      },
    }),
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "cartesi-rollups",
        path: "cartesi-rollups",
        routeBasePath: "cartesi-rollups",
        // sidebarPath: require.resolve("./sidebarsRollups.js"),
        editUrl: "https://github.com/cartesi/docs/tree/main",
        // docLayoutComponent: "@theme/DocRoot",
        // docRootComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        includeCurrentVersion: false,
        lastVersion: "1.5",
        admonitions: {
          keywords: [
            "note",
            "tip",
            "danger",
            "info",
            "caution",
            "goal",
            "troubleshoot",
          ],
        },
        versions: {
          "1.5": {
            label: "1.5",
            path: "1.5",
          },
          "2.0": {
            label: "2.0",
            path: "2.0",
          }
        },
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/cartesi-rollups',      // the old/base route
            to:   '/cartesi-rollups/1.5/', // the new route to redirect to
          },
          {
            to: "/cartesi-rollups/2.0/getting-started/quickstart/",
            from: "/cartesi-rollups/2.0/quickstart/",
          },
          {
            to: "/cartesi-rollups/2.0/api-reference/architecture/",
            from: "/cartesi-rollups/2.0/core-concepts/optimistic-rollups/",
          },
          {
            to: "/cartesi-rollups/2.0/api-reference/architecture/",
            from: "/cartesi-rollups/2.0/core-concepts/architecture/",
          },
          {
            to: "/cartesi-rollups/2.0/resources/mainnet-considerations/",
            from: "/cartesi-rollups/2.0/core-concepts/mainnet-considerations/",
          },
          {
            to: "/cartesi-rollups/2.0/development/building-a-dapp/",
            from: "/cartesi-rollups/2.0/development/creating-application/",
          },
          {
            to: "/cartesi-rollups/2.0/development/building-a-dapp/",
            from: "/cartesi-rollups/2.0/development/building-the-application/",
          },
          {
            to: "/cartesi-rollups/2.0/development/building-a-dapp/",
            from: "/cartesi-rollups/2.0/development/running-the-application/",
          },
          {
            to: "/cartesi-rollups/2.0/development/send-inputs/",
            from: "/cartesi-rollups/2.0/development/send-requests/",
          },
          {
            to: "/cartesi-rollups/2.0/development/query-outputs/",
            from: "/cartesi-rollups/2.0/development/retrieve-outputs/",
          },
          {
            to: "/cartesi-rollups/2.0/resources/migration-guide/",
            from: "/cartesi-rollups/2.0/development/migration/",
          },
          {
            to: "/cartesi-rollups/2.0/resources/community-tools/",
            from: "/cartesi-rollups/2.0/development/community-tools/",
          }
        ],
      },
    ],
    async function AddTailwindCss(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "apiDocs",
        docsPluginId: "cartesi-rollups",
        config: openApiDocsConfig,
      },
    ],

    [
      "@graphql-markdown/docusaurus",
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      {
        schema: "cartesi-rollups/rollups-apis/typeDefs.graphql",
        rootPath: "cartesi-rollups", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "api/graphql",
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'get-started',
        path: 'get-started',
        routeBasePath: 'get-started', 
        sidebarPath: require.resolve('./sidebarsGetStarted.js'),
        editUrl: 'https://github.com/cartesi/docs/tree/develop',
        showLastUpdateTime: true,
        docItemComponent: "@theme/ApiItem",
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'fraud-proofs',
        path: 'fraud-proofs',
        routeBasePath: 'fraud-proofs', 
        sidebarPath: require.resolve('./sidebarsFraudProofs.js'),
        editUrl: 'https://github.com/cartesi/docs/tree/develop',
        showLastUpdateTime: true,
        docItemComponent: "@theme/ApiItem",
      },
    ],
  ],
  themes: [
    "docusaurus-theme-openapi-docs",
    "docusaurus-theme-search-typesense",
  ],
};

module.exports = config;
