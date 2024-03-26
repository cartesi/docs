// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const replacementPlugin = require("./src/remark/replacement");

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
  presets: [
    [
      "classic",

      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
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
          trackingID: "GTM-MS89D9K",
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: "GTM-MS89D9K",
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
      algolia: {
        appId: "STJID4NVVG",
        apiKey: "a454730829efd0e7fc91ccb52e1185a6",
        indexName: "cartesi",
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
          //       label: "Sunodo",
          //       href: "https://docs.sunodo.io/guide/introduction/what-is-sunodo",
          //     },
          //     {
          //       label: "NoNodo",
          //       href: "https://github.com/gligneul/nonodo/blob/main/README.md",
          //     },
          //     { label: "Cartesi Scan", href: "https://cartesiscan.io/" },
          //   ],
          // },
          {
            type: "dropdown",
            label: "Learn",
            position: "left",
            items: [
              {
                label: "Free Udemy Course",
                href: "https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass",
              },
              // {
              //   label: "Cartesi Machine",
              //   href: "/machine/",
              // },
            ],
          },
          // {
          //   label: "Academy",
          //   to: "#",
          //   position: "left",
          // },
          {
            type: "dropdown",
            label: "Community",
            position: "left",
            items: [
              {
                label: "Twitter",
                href: "https://www.twitter.com/cartesiproject",
              },
              { label: "Discord", href: "https://discord.gg/uxYE5YNv3N" },
              { label: "Reddit", href: "https://www.reddit.com/r/cartesi/" },
              {
                label: "YouTube",
                href: "https://www.youtube.com/c/Cartesiproject/videos",
              },
              { label: "Telegram", href: "https://t.me/cartesiannouncements" },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/cartesi/",
              },
              {
                label: "Instagram",
                href: "https://www.instagram.com/cartesiproject/",
              },
              {
                label: "Rolluplab",
                href: "https://rolluplab.io/",
              },
              {
                label: "Technical Vision Forum",
                href: "https://governance.cartesi.io/c/technical-vision-forum/13",
              },
            ],
          },
          // {
          //   type: "dropdown",
          //   label: "Developers",
          //   position: "left",
          //   items: [
          //     { label: "Code snippets", href: "#" },
          //     { label: "Quick start tutorials", href: "#" },
          //   ],
          // },
          {
            label: "Cartesi Home",
            to: "//cartesi.io",
            position: "left",
          },

          // {
          //   type: "docsVersionDropdown",
          //   position: "right",
          //   docsPluginId: "cartesi-rollups",
          //   label: "Version",
          // },

          {
            type: "search",
            className: "navbar-search-custom",
            position: "right",
          },

          {
            to: "https://discord.gg/uxYE5YNv3N",
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
        content:
          'Cartesi Rollups is Mainnet Ready! Learn more about the launch <a href="https://docs-azure-two.vercel.app/cartesi-rollups/core-concepts/mainnet-considerations/" target="_blank" rel="noopener noreferrer">here</a>.',
      
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
                to: "https://discord.gg/uxYE5YNv3N",
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
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
        sidebarPath: require.resolve("./sidebarsRollups.js"),
        editUrl: "https://github.com/cartesi/docs/tree/main",
        docLayoutComponent: "@theme/DocPage",
        docItemComponent: "@theme/ApiItem",
        includeCurrentVersion: true,
        lastVersion: "current",
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
          current: {
            label: "1.3",
            path: "1.3",
          },
        },
        showLastUpdateTime: true,
      },
    ],
    "docusaurus-plugin-hotjar",
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
        config: {
          backEndApi: {
            // Note: petstore key is treated as the <id> and can be used to specify an API doc instance when using CLI commands
            specPath: "cartesi-rollups/api/rollup.yaml", // Path to designated spec file
            outputDir: "cartesi-rollups/api/rollup", // Output directory for generated .mdx docs
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
          frontEndApi: {
            specPath: "cartesi-rollups/api/inspect.yaml",
            outputDir: "cartesi-rollups/api/inspect",
          },
        },
      },
    ],

    [
      "@graphql-markdown/docusaurus",
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      {
        schema: "cartesi-rollups/api/typeDefs.graphql",
        rootPath: "cartesi-rollups", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "api/graphql",
      },
    ],
  ],
  themes: ["docusaurus-theme-openapi-docs"],
};

module.exports = config;
