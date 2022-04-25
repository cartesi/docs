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
        contextualSearch: false,
        },

      navbar: {
        title: 'Cartesi Documentation',
        logo: {
          alt: 'Cartesi Logo',
          src: 'img/logo.png',
          srcDark: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/cartesi/rollups-examples',
            label: 'DApp Examples',
            position: 'left',
          },
          {
            href: 'https://youtu.be/8kEBwJt2YLM',
            label: 'Blockchain Course',
            position: 'left',
          },
          {
            href: 'https://cartesi.io/en/labs',
            label: 'Cartesi Labs',
            position: 'left',
          },
          {
            href: 'https://cartesi.io/en/ctsi-token',
            label: 'CTSI Token',
            position: 'left',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
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
              href: "https://github.com/cartesi/rollups-examples/tree/main/custom-dapps",
            },
            {
              label: "Chat with Developers",
              href: "https://discord.com/invite/SgybPuhX",
            },
            {
              label: "Run a Node",
              href: "https://explorer.cartesi.io/staking",
            },
            {
              label: "CIP Process",
              href: "https://github.com/cartesi/cips",
            },
            {
              label: "Cartesi Bug Bounty",
              href: "https://immunefi.com/bounty/cartesi/",
            },
            {
              label: "Tech Articles",
              href: "https://medium.com/cartesi/tagged/tech",
            }
          ],
        },
        {
          title: "Github",
          items: [
            {
              label: "rollups-examples",
              href: "https://github.com/cartesi/rollups-examples",
            },
            {
              label: "machine-emulator-tools",
              href: "https://github.com/cartesi/machine-emulator-tools",
            },
            {
              label: "nother-node",
              href: "https://github.com/cartesi/noether",
            },
            {
              label: "descartes-tutorials",
              href: "https://github.com/cartesi/descartes-tutorials",
            },
          ],
        },
        {
          title: "Ecosystem",
          items: [
            {
              label: "Blockchain OS",
              href: "https://cartesi.io/en/blockchain-os",
            },
            {
              label: "Our Whitepaper",
              href: "https://cartesi.io/cartesi_whitepaper.pdf",
            },
            {
              label: "Foundation Notice",
              href: "https://cartesi.io/foundation_notice.pdf",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Youtube",
              href: "https://www.youtube.com/c/Cartesiproject/videos",
            },
            {
              label: "Discord",
              href: "https://discord.gg/Pt2NrnS",
            },
            {
              label: "Meduim",
              href: "https://www.medium.com/cartesi",
            },
            {
              label: "Twitter",
              href: "https://www.twitter.com/cartesiproject",
            },
            {
              label: "Telegram",
              href: "https://t.me/cartesiannouncements",
            },
            {
              label: "Reditt",
              href: "https://www.reddit.com/r/cartesi/",
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
