/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'New to Cartesi',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'new-to-cartesi/overview',
        'new-to-cartesi/scalability',
      ],
    },
    {
      type: 'category',
      label: 'Cartesi Machine',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'machine/overview',
        {
          type: "category",
          label: "Host perspective",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            "machine/host/overview",
            "machine/host/cmdline",
            "machine/host/lua"
          ]
        },
        {
          type: "category",
          label: "Target perspective",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
              "machine/target/overview",
              "machine/target/linux",
              "machine/target/architecture"
          ]
        },
        {
          type: "category",
          label: "Blockchain perspective",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
              "machine/blockchain/intro",
              "machine/blockchain/hash",
              "machine/blockchain/vg"
          ]
        }
      ]
    },

    {
      type: 'category',
      label: 'Cartesi Rollups',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'cartesi-rollups/overview',
        'cartesi-rollups/components',
        'cartesi-rollups/dapp-architecture',
        'cartesi-rollups/http-api',
        'cartesi-rollups/dapp-life-cycle',
      ],
    },
    {
      type: 'category',
      label: 'Build DApps',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'build-dapps/overview',
        'build-dapps/requirements',
        'build-dapps/run-dapp',
        'build-dapps/create-dapp'

      ],
    },
    // {
    //   type: 'category',
    //   label: 'Earn CTSI',
    //   link: {
    //     type: 'generated-index',
    //   },
    //   collapsed: true,
    //   items: [
    //     'earn-ctsi/staking',
    //   ],
    // },

    {
          type: "category",
          label: "Descartes SDK",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            "descartes/overview",
            "descartes/how",
            "descartes/architecture",
            "descartes/wallet",
            "descartes/timeline",
            "descartes/machine-offchain",
            "descartes/machine-onchain",
            "descartes/api",
            "descartes/instantiate",
            "descartes/drives",
            "descartes/provider",
            "descartes/logger_drive",
            //"descartes/off-chain-api",
            //"descartes/workflow",
            "descartes/topologies",
            //"descartes/services",
            "descartes/supported-networks"
          ]
        },
        {
          type: "category",
          label: "Descartes Tutorials",
          link: {
            type: 'generated-index',
          },
          collapsed: true,
          items: [
            "tutorials/introduction",
            "tutorials/requirements",
            "tutorials/descartes-env",
            {
              type: "category",
              label: "Hello World DApp",
              link: {
                type: 'generated-index',
              },
              collapsed: true,
              items: [
                "tutorials/helloworld/create-project",
                "tutorials/helloworld/cartesi-machine",
                "tutorials/helloworld/instantiate",
                "tutorials/helloworld/getresult",
                "tutorials/helloworld/deploy-run"
              ]
            },
            {
              type: "category",
              label: "Calculator DApp",
              link: {
                type: 'generated-index',
              },
              collapsed: true,
              items: [
                "tutorials/calculator/create-project",
                "tutorials/calculator/cartesi-machine",
                "tutorials/calculator/full-dapp"
              ]
            },
            {
              type: "category",
              label: "Generic Script DApp",
              link: {
                type: 'generated-index',
              },
              collapsed: true,
              items: [
                "tutorials/generic-script/create-project",
                "tutorials/generic-script/custom-rootfs",
                "tutorials/generic-script/cartesi-machine",
                "tutorials/generic-script/full-dapp"
              ]
            },
            {
              type: "category",
              label: "GPG Verify DApp",
              link: {
                type: 'generated-index',
              },
              collapsed: true,
              items: [
                "tutorials/gpg-verify/create-project",
                "tutorials/gpg-verify/ext2-gpg",
                "tutorials/gpg-verify/cartesi-machine",
                "tutorials/gpg-verify/full-dapp",
                "tutorials/gpg-verify/larger-files"
              ]
            },
            {
              type: "category",
              label: "Dogecoin Hash DApp",
              link: {
                type: 'generated-index',
              },
              collapsed: true,
              items: [
                "tutorials/dogecoin-hash/create-project",
                "tutorials/dogecoin-hash/scrypt-c",
                "tutorials/dogecoin-hash/cartesi-machine",
                "tutorials/dogecoin-hash/full-dapp"
              ]
            },
          ]
},
  ],
};

module.exports = sidebars;
