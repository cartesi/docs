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

    //   cartesicompute: [
    //       {
    //           type: "category",
    //           label: "Cartesi Compute SDK",
    //           link: {
    //             type: "generated-index",
    //             slug: "cartesi-compute",
    //           },
    //           collapsed: true,
    //           items: [
    //             "compute/overview",
    //             "compute/how",
    //             "compute/architecture",
    //             "compute/wallet",
    //             "compute/timeline",
    //             "compute/machine-offchain",
    //             "compute/machine-onchain",
    //             "compute/api",
    //             "compute/instantiate",
    //             "compute/drives",
    //             "compute/provider",
    //             "compute/logger_drive",
    //             "compute/topologies",
    //             "compute/supported-networks"
    //           ]
    //         },
    //         {
    //           type: "category",
    //           label: "Cartesi Compute Tutorials",
    //           link: {
    //             type: "generated-index",
    //             slug: "/compute/tutorials",
    //           },
    //           collapsed: true,
    //           items: [
    //             "tutorials/introduction",
    //             "tutorials/requirements",
    //             "tutorials/descartes-env",
    //             {
    //               type: "category",
    //               label: "Hello World DApp",
    //               link: {
    //                 type: "generated-index",
    //                 slug: "/compute/tutorials/helloworld/",
    //               },
    //               collapsed: true,
    //               items: [
    //                 "tutorials/helloworld/create-project",
    //                 "tutorials/helloworld/cartesi-machine",
    //                 "tutorials/helloworld/instantiate",
    //                 "tutorials/helloworld/getresult",
    //                 "tutorials/helloworld/deploy-run"
    //               ]
    //             },
    //             {
    //               type: "category",
    //               label: "Calculator DApp",
    //               link: {
    //                 type: "generated-index",
    //                 slug: "/compute/tutorials/calculator/",
    //               },
    //               collapsed: true,
    //               items: [
    //                 "tutorials/calculator/create-project",
    //                 "tutorials/calculator/cartesi-machine",
    //                 "tutorials/calculator/full-dapp"
    //               ]
    //             },
    //             {
    //               type: "category",
    //               label: "Generic Script DApp",
    //               link: {
    //                 type: "generated-index",
    //                 slug: "/compute/tutorials/generic-script/",
    //               },
    //               collapsed: true,
    //               items: [
    //                 "tutorials/generic-script/create-project",
    //                 "tutorials/generic-script/custom-rootfs",
    //                 "tutorials/generic-script/cartesi-machine",
    //                 "tutorials/generic-script/full-dapp"
    //               ]
    //             },
    //             {
    //               type: "category",
    //               label: "GPG Verify DApp",
    //               link: {
    //                 type: "generated-index",
    //                 slug: "/compute/tutorials/gpg-verify/",
    //               },
    //               collapsed: true,
    //               items: [
    //                 "tutorials/gpg-verify/create-project",
    //                 "tutorials/gpg-verify/ext2-gpg",
    //                 "tutorials/gpg-verify/cartesi-machine",
    //                 "tutorials/gpg-verify/full-dapp",
    //                 "tutorials/gpg-verify/larger-files"
    //               ]
    //             },
    //             {
    //               type: "category",
    //               label: "Dogecoin Hash DApp",
    //               link: {
    //                 type: "generated-index",
    //                 slug: "/compute/tutorials/dogecoin-hash/",
    //               },
    //               collapsed: true,
    //               items: [
    //                 "tutorials/dogecoin-hash/create-project",
    //                 "tutorials/dogecoin-hash/scrypt-c",
    //                 "tutorials/dogecoin-hash/cartesi-machine",
    //                 "tutorials/dogecoin-hash/full-dapp"
    //               ]
    //             },
    //           ]
    // },
    // {
    //   type: "category",
    //   label: "References",
    //   link: {
    //     type: "generated-index",
    //     slug: "/compute/references",
    //   },
    //   collapsed: true,
    //   items: [
    //   {
    //     type: "link",
    //     label: "Code samples",
    //     href: "https://github.com/cartesi/compute-tutorials",
    //   },
    //   ],
    // },
    // ],

//   cartesicompute: [
//       {
//           type: "category",
//           label: "Cartesi Compute SDK",
//           link: {
//             type: "generated-index",
//             slug: "cartesi-compute",
//           },
//           collapsed: true,
//           items: [
//             "compute/overview",
//             "compute/how",
//             "compute/architecture",
//             "compute/wallet",
//             "compute/timeline",
//             "compute/machine-offchain",
//             "compute/machine-onchain",
//             "compute/api",
//             "compute/instantiate",
//             "compute/drives",
//             "compute/provider",
//             "compute/logger_drive",
//             "compute/topologies",
//             "compute/supported-networks"
//           ]
//         },
//         {
//           type: "category",
//           label: "Cartesi Compute Tutorials",
//           link: {
//             type: "generated-index",
//             slug: "/compute/tutorials",
//           },
//           collapsed: true,
//           items: [
//             "tutorials/introduction",
//             "tutorials/requirements",
//             "tutorials/compute-env",
//             {
//               type: "category",
//               label: "Hello World DApp",
//               link: {
//                 type: "generated-index",
//                 slug: "/compute/tutorials/helloworld/",
//               },
//               collapsed: true,
//               items: [
//                 "tutorials/helloworld/create-project",
//                 "tutorials/helloworld/cartesi-machine",
//                 "tutorials/helloworld/instantiate",
//                 "tutorials/helloworld/getresult",
//                 "tutorials/helloworld/deploy-run"
//               ]
//             },
//             {
//               type: "category",
//               label: "Calculator DApp",
//               link: {
//                 type: "generated-index",
//                 slug: "/compute/tutorials/calculator/",
//               },
//               collapsed: true,
//               items: [
//                 "tutorials/calculator/create-project",
//                 "tutorials/calculator/cartesi-machine",
//                 "tutorials/calculator/full-dapp"
//               ]
//             },
//             {
//               type: "category",
//               label: "Generic Script DApp",
//               link: {
//                 type: "generated-index",
//                 slug: "/compute/tutorials/generic-script/",
//               },
//               collapsed: true,
//               items: [
//                 "tutorials/generic-script/create-project",
//                 "tutorials/generic-script/custom-rootfs",
//                 "tutorials/generic-script/cartesi-machine",
//                 "tutorials/generic-script/full-dapp"
//               ]
//             },
//             {
//               type: "category",
//               label: "GPG Verify DApp",
//               link: {
//                 type: "generated-index",
//                 slug: "/compute/tutorials/gpg-verify/",
//               },
//               collapsed: true,
//               items: [
//                 "tutorials/gpg-verify/create-project",
//                 "tutorials/gpg-verify/ext2-gpg",
//                 "tutorials/gpg-verify/cartesi-machine",
//                 "tutorials/gpg-verify/full-dapp",
//                 "tutorials/gpg-verify/larger-files"
//               ]
//             },
//             {
//               type: "category",
//               label: "Dogecoin Hash DApp",
//               link: {
//                 type: "generated-index",
//                 slug: "/compute/tutorials/dogecoin-hash/",
//               },
//               collapsed: true,
//               items: [
//                 "tutorials/dogecoin-hash/create-project",
//                 "tutorials/dogecoin-hash/scrypt-c",
//                 "tutorials/dogecoin-hash/cartesi-machine",
//                 "tutorials/dogecoin-hash/full-dapp"
//               ]
//             },

//           ]
// },
// {
//   type: "category",
//   label: "References",
//   link: {
//     type: "generated-index",
//     slug: "/compute/references",
//   },
//   collapsed: true,
//   items: [
//   {
//     type: "link",
//     label: "Code samples",
//     href: "https://github.com/cartesi/descartes-tutorials",
//   },
//   {
//     type: 'link',
//     label: 'Changelog',
//     href: 'https://github.com/cartesi/descartes/blob/master/CHANGELOG.md',
//   },
//   ],
// },
// ],

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
    {
      type: "category",
      label: "References",
      link: {
        type: "generated-index",
        slug: "/machine/references",
      },
      collapsed: true,
      items: [
      {
        type: "link",
        label: "Code samples",
        href: "https://github.com/cartesi/machine-emulator",
      },
      {
        type: "link",
        label: "Changelog",
        href: "https://github.com/cartesi/machine-emulator/blob/master/CHANGELOG.md",
      },
      ],
    },
],

staking: [
    {
      type: 'category',
      label: 'Staking Delegation',
      link: {
      type: 'generated-index',
      slug: "earn-ctsi"
            },
     collapsed: true,
        items: [
          'earn-ctsi/staking',
          'earn-ctsi/run-node',
          'earn-ctsi/public-pool',
          'earn-ctsi/staking-faq',
        ],
    },
  ],


};
module.exports = sidebars;
