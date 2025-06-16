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
          label: 'Execution Environment',
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
          label: 'App-Chains',
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
          label: 'CLI Commands',
        },
        {
          type: 'link',
          label: 'Honeypot Application',
          href: 'https://github.com/cartesi/honeypot',
        },
      ],
    }
  ],
};
