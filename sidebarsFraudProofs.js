module.exports = {
  daveSidebar: [
    {
      type: 'doc',
      id: 'index', 
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Fundamental Concepts',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'fraud-proof-basics/introduction',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'fraud-proof-basics/state-transition-function',
          label: 'State Transition Function',
        },
        {
          type: 'doc',
          id: 'fraud-proof-basics/epochs',
          label: 'Epoch Lifecycle',
        },
        {
          type: 'doc',
          id: 'fraud-proof-basics/bonds',
          label: 'Bonds',
        },
      ],
    },
    {
      type: 'category',
      label: 'Permissionless Refereed Tournament (PRT)',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'prt/prt-introduction',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'prt/prt-algorithm',
          label: 'Algorithm',
        },
        {
          type: 'doc',
          id: 'prt/prt-architecture',
          label: 'Architecture',
        },
      ],
    },
    {
      type: 'category',
      label: 'Honeypot Application',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'honeypot/introduction',
          label: 'Introduction',
        },
        {
          type: 'doc',
          id: 'honeypot/application-logic',
          label: 'Application logic',
        },
        {
          type: 'doc',
          id: 'honeypot/prt-integration',
          label: 'PRT Integration',
        }
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'references/daveconsensus',
          label: 'PRT-Rollups Consensus Contracts',
        },
        {
          type: 'doc',
          id: 'references/tournament',
          label: 'Tournament Contracts',
        },
        {
          type: 'doc',
          id: 'references/deployments',
          label: 'Mainnet Deployments',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/cartesi/dave',
        },
      ],
    },
  ],
}; 