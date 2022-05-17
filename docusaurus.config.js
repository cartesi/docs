// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cartesi Docs',
  tagline: 'Blockchain OS',
  url: 'https://cartesi.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'cartesi', // Usually your GitHub org/user name.
  projectName: 'cartesi', // Usually your repo name.
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/cartesi-corp/docs/tree/develop',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Algolia Search
      algolia: {
        appId: "6QH8YVQX",
        apiKey: "6033c09f3af6454c8c25efce0460",
        indexName: "cartesi",
        contextualSearch: true,
      },

      navbar: {
        logo: {
          alt: 'Cartesi Logo',
          src: 'img/logo.png',
          srcDark: 'img/logo.png',
        },
        items: [
          {
            to: 'https://youtu.be/8kEBwJt2YLM',
            label: 'Blockchain Course',
            position: 'right',
          },
          {
            to: 'https://cartesi.io/en/labs',
            label: 'Cartesi Labs',
            position: 'right',
          },
          {
            to: 'https://github.com/cartesi/rollups-examples',
            label: 'DApp Examples',
            position: 'right',
          },
          {
            to: 'https://github.com/cartesi-corp/docs/tree/develop',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
      links: [
        {
          title: "Developers",
          items: [
            {
              label: "Template DApp",
              to: "https://github.com/cartesi/rollups-examples/tree/main/custom-dapps",
            },
            {
              label: "Chat with Developers",
              to: "https://discord.com/invite/SgybPuhX",
            },
            {
              label: "Run a Node",
              to: "https://explorer.cartesi.io/staking",
            },
            {
              label: "CIP Process",
              to: "https://github.com/cartesi/cips",
            },
            {
              label: "Cartesi Bug Bounty",
              to: "https://immunefi.com/bounty/cartesi/",
            },
            {
              label: "Tech Articles",
              to: "https://medium.com/cartesi/tagged/tech",
            }
          ],
        },
        {
          title: "Github",
          items: [
            {
              label: "rollups-examples",
              to: "https://github.com/cartesi/rollups-examples",
            },
            {
              label: "machine-emulator-tools",
              to: "https://github.com/cartesi/machine-emulator-tools",
            },
            {
              label: "nother-node",
              to: "https://github.com/cartesi/noether",
            },
            {
              label: "descartes-tutorials",
              to: "https://github.com/cartesi/descartes-tutorials",
            },
          ],
        },
        {
          title: "Ecosystem",
          items: [
            {
              label: "Blockchain OS",
              to: "https://cartesi.io/en/blockchain-os",
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
          title: "Community",
          items: [
            {
              label: "Youtube",
              to: "https://www.youtube.com/c/Cartesiproject/videos",
            },
            {
              label: "Discord",
              to: "https://discord.gg/Pt2NrnS",
            },
            {
              label: "Meduim",
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
              label: "Reditt",
              to: "https://www.reddit.com/r/cartesi/",
            },
          ],
        },
      ],
    },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["lua"],
      },
    }),
};

module.exports = config;
