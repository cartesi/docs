module.exports = {
  rollups: [
    {
      type: "doc",
      id: "overview",
      label: "Overview",
    },
    {
      type: "doc",
      id: "quickstart",
      label: "Quickstart",
    },
    {
      type: "category",
      label: "Core Concepts",
      collapsed: true,
      items: [
        "core-concepts/optimistic-rollups",
        "core-concepts/cartesi-machine",
        "core-concepts/architecture",
        "core-concepts/mainnet-considerations",
      ],
    },
    {
      type: "category",
      label: "Rollups APIs",
      collapsed: true,

      items: [
        "rollups-apis/http-api",
        {
          type: "category",
          label: "Backend APIs",

          collapsed: true,
          items: [
            "rollups-apis/backend/introduction",
            "rollups-apis/backend/notices",
            "rollups-apis/backend/vouchers",
            "rollups-apis/backend/reports",
          ],
        },
        {
          type: "category",
          label: "Frontend APIs",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "Smart contracts API",

              collapsed: true,
              items: [
                "rollups-apis/json-rpc/overview",
                "rollups-apis/json-rpc/input-box",
                "rollups-apis/json-rpc/application",
                "rollups-apis/json-rpc/application-factory",

                {
                  type: "category",
                  label: "Portals",
                  collapsed: true,
                  items: [
                    "rollups-apis/json-rpc/portals/ERC20Portal",
                    "rollups-apis/json-rpc/portals/ERC721Portal",
                    "rollups-apis/json-rpc/portals/ERC1155SinglePortal",
                    "rollups-apis/json-rpc/portals/ERC1155BatchPortal",
                    "rollups-apis/json-rpc/portals/EtherPortal",
                  ],
                },
                {
                  type: "category",
                  label: "Relayer",
                  collapsed: true,
                  items: ["rollups-apis/json-rpc/relays/relays"],
                },
              ],
            },
            {
              type: "category",
              label: "GraphQL API",

              collapsed: true,
              items: [
                "rollups-apis/graphql/overview",
                {
                  type: "category",
                  label: "Queries",
                  collapsed: true,
                  items: [
                    {
                      type: "autogenerated",
                      dirName: "rollups-apis/graphql/queries",
                    },
                  ],
                },
                {
                  type: "category",
                  label: "Objects",
                  collapsed: true,
                  items: [
                    {
                      type: "autogenerated",
                      dirName: "rollups-apis/graphql/objects",
                    },
                  ],
                },
                {
                  type: "category",
                  label: "Filters",
                  collapsed: true,
                  items: [
                    {
                      type: "autogenerated",
                      dirName: "rollups-apis/graphql/inputs",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Development",
      collapsed: true,
      items: [
        "development/installation",
        "development/creating-application",
        "development/building-the-application",
        "development/running-the-application",
        "development/node-configuration",
        "development/send-requests",
        "development/retrieve-outputs",

        "development/asset-handling",
      ],
    },
    {
      type: "category",
      label: "Deployment",
      collapsed: true,
      items: ["deployment/introduction", "deployment/self-hosted"],
    },
    {
      type: "category",
      label: "Tutorials",
      collapsed: true,
      items: [
        "tutorials/calculator",
        "tutorials/machine-learning",
        "tutorials/javascript-wallet",
        "tutorials/python-wallet"
      ],
    },

    {
      type: "category",
      label: "References",
      collapsed: true,
      items: [
        {
          type: "category",
          label: "Releases",
          items: [
            {
              type: "link",
              label: "Rollups Node",
              href: "https://github.com/cartesi/rollups-node/releases",
            },
            {
              type: "link",
              label: "Rollups Contracts",
              href: "https://github.com/cartesi/rollups-contracts/releases",
            },
          ],
        },
        {
          type: "category",
          label: "Changelog",
          items: [
            {
              type: "link",
              label: "Rollups Node",
              href: "https://github.com/cartesi/rollups-node/blob/main/CHANGELOG.md",
            },
            {
              type: "link",
              label: "Rollups Contracts",
              href: "https://github.com/cartesi/rollups-contracts/blob/main/CHANGELOG.md",
            },
          ],
        },
      ],
    },
    // {
    //   type: "category",
    //   label: "Future Developments",
    //   link: {
    //     type: "doc",
    //     id: "challenges/overview",
    //   },
    //   collapsed: true,
    //   items: ["challenges/overview"],
    // },
  ],
};
