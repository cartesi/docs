module.exports = {
  getStartedSidebar: [
    
    {
      type: 'doc',
      id: 'index', 
      label: 'Overview',
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
          id: 'rollups-coprocessor',
          label: 'Coprocessor',
        },
        
      ],
    },
  ],
};
