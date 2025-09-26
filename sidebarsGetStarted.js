module.exports = {
  getStartedSidebar: [
    
    {
      type: 'doc',
      id: 'index', 
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'quickstart',
      label: 'Quickstart',
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'cartesi-machine',
          label: 'Cartesi Machine',
        },
        {
          type: 'doc',
          id: 'optimistic-rollups',
          label: 'Optimistic Rollups',
        },
        {
          type: 'doc',
          id: 'fraud-proofs',
          label: 'Fraud Proofs',
        },
        {
          type: 'doc',
          id: 'app-chains',
          label: 'Appchains',
        },
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'cli-commands',
          label: 'Cartesi CLI',
        },
        {
          type: 'link',
          label: 'Honeypot Application',
          href: 'https://github.com/cartesi/honeypot',
        },
        {
          type: 'link',
          label: 'Rollup Lab',
          href: 'https://rolluplab.io',
        },
      ],
    }
  ],
};
