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
      type: "category",
      label: "New to Cartesi",
      link: {
        type: "generated-index",
        slug: "/new-to-cartesi",
      },
      collapsed: true,
      items: [
        "new-to-cartesi/overview",
        "new-to-cartesi/onboarding",
        "new-to-cartesi/scalability",
      ],
    },
  ],

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
    
  cartesicompute: [
      {
          type: "category",
          label: "Cartesi Compute SDK",
          link: {
            type: "generated-index",
            slug: "cartesi-compute",
          },
          collapsed: true,
          items: [
            "compute/overview",
            "compute/how",
            "compute/architecture",
            "compute/wallet",
            "compute/timeline",
            "compute/machine-offchain",
            "compute/machine-onchain",
            "compute/api",
            "compute/instantiate",
            "compute/drives",
            "compute/provider",
            "compute/logger_drive",
            "compute/topologies",
            "compute/supported-networks"
          ]
        },
        {
          type: "category",
          label: "Cartesi Compute Tutorials",
          link: {
            type: "generated-index",
            slug: "/compute/tutorials",
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
                type: "generated-index",
                slug: "/compute/tutorials/helloworld/",
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
                type: "generated-index",
                slug: "/compute/tutorials/calculator/",
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
                type: "generated-index",
                slug: "/compute/tutorials/generic-script/",
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
                type: "generated-index",
                slug: "/compute/tutorials/gpg-verify/",
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
                type: "generated-index",
                slug: "/compute/tutorials/dogecoin-hash/",
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

  rollups: [
    {
      type: "category",
      label: "Cartesi Rollups",
      link: {
        type: "generated-index",
        slug: "/cartesi-rollups",
      },
      collapsed: true,
      items: [
        "cartesi-rollups/overview",
        "cartesi-rollups/components",
        "cartesi-rollups/dapp-architecture",
        "cartesi-rollups/http-api",
        "cartesi-rollups/dapp-life-cycle",
        {
          type: "category",
          label: "Rollups HTTP APIs reference",
          link: {
            type: "generated-index",
            slug: "cartesi-rollups/api",
            description: "APIs available for DApp developers to interact with the Cartesi Rollups framework."
          },
          collapsed: true,
          items: [
            {
              type: "category",
              label: "Front-end APIs",
              link: {
                type: "generated-index",
                slug: "cartesi-rollups/api/front-end",
                description: "APIs used by front-end clients to interact with the Cartesi Rollups framework."
              },
              collapsed: true,
              items: [
                {
                  type: "category",
                  label: "Smart contracts API",
                  link: {
                    type: "generated-index",
                    slug: "cartesi-rollups/api/json-rpc",
                  },
                  collapsed: true,
                  items: ["cartesi-rollups/api/json-rpc/sol-input", "cartesi-rollups/api/json-rpc/sol-output"],
                },
                {
                  type: "category",
                  label: "Rollups state GraphQL API",
                  link: {
                    type: "generated-index",
                    slug: "cartesi-rollups/api/graphql/index",
                  },
                  collapsed: true,
                  items: [
                    "cartesi-rollups/api/graphql/basics",
                    {
                      type: "category",
                      label: "Queries",
                      link: {
                        type: "generated-index",
                        slug: "cartesi-rollups/api/graphql/queries",
                      },
                      collapsed: true,
                      items: [
                        {
                          type: "autogenerated",
                          dirName: "cartesi-rollups/api/graphql/queries",
                        },
                      ],
                    },
                    {
                      type: "category",
                      label: "Objects",
                      link: {
                        type: "generated-index",
                        slug: "cartesi-rollups/api/graphql/objects",
                      },
                      collapsed: true,
                      items: [
                        {
                          type: "autogenerated",
                          dirName: "cartesi-rollups/api/graphql/objects",
                        },
                      ],
                    },
                    {
                      type: "category",
                      label: "Filters",
                      link: {
                        type: "generated-index",
                        slug: "cartesi-rollups/api/graphql/filters",
                      },
                      collapsed: true,
                      items: [
                        {
                          type: "autogenerated",
                          dirName: "cartesi-rollups/api/graphql/inputs",
                        },
                      ],
                    },
                  ],
                },
                "cartesi-rollups/api/inspect/inspect",

              ],
            },
            {
              type: "category",
              label: "Back-end API",
              link: {
                type: "generated-index",
                slug: "cartesi-rollups/api/back-end",
                description: "API used by DApp back-ends (running inside Cartesi Nodes) to interact with the Cartesi Rollups framework.",
              },
              collapsed: true,
              items: [
                "cartesi-rollups/api/rollup/cartesi-rollup-http-api",
                "cartesi-rollups/api/rollup/add-notice",
                "cartesi-rollups/api/rollup/add-report",
                "cartesi-rollups/api/rollup/add-voucher",
                "cartesi-rollups/api/rollup/finish",
                "cartesi-rollups/api/rollup/register-exception",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Build DApps",
      link: {
        type: "generated-index",
        slug: "/build-dapps",
      },
      collapsed: true,
      items: [
        "build-dapps/overview",
        "build-dapps/requirements",
        "build-dapps/run-dapp",
        "build-dapps/create-dapp",
        "build-dapps/dapp-host-mode",
      ],
    },
  ],


  machine: [
    {
      type: "category",
      label: "Cartesi Machine",
      link: {
        type: "generated-index",
        slug: "cartesi-machine",
      },
      collapsed: true,
      items: [
        "machine/intro",
        {
          type: "category",
          label: "Host perspective",
          link: {
            type: "generated-index",
            slug: "/machine/host",
          },
          collapsed: true,
          items: [
            "machine/host/overview",
            "machine/host/cmdline",
            "machine/host/lua",
          ],
        },
        {
          type: "category",
          label: "Target perspective",
          link: {
            type: "generated-index",
            slug: "/machine/target",
          },
          collapsed: true,
          items: [
            "machine/target/overview",
            "machine/target/linux",
            "machine/target/architecture",
          ],
        },
        {
          type: "category",
          label: "Blockchain perspective",
          link: {
            type: "generated-index",
            slug: "/machine/blockchain",
          },
          collapsed: true,
          items: [
            "machine/blockchain/intro",
            "machine/blockchain/hash",
            "machine/blockchain/vg",
          ],
        },
      ],
    },
]


};
module.exports = sidebars;
