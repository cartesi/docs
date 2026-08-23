module.exports = {
  appSequencerSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Overview',
        description:
          'Start here: what the App Sequencer is, and whether your application needs it.',
        slug: '/',
      },
      items: [
        { type: 'doc', id: 'overview/app-specific-sequencing', label: 'App-specific sequencing' },
        { type: 'doc', id: 'overview/when-to-use', label: 'When to use it' },
      ],
    },
    {
      type: 'category',
      label: 'Foundations',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Foundations',
        description:
          'The mental model: how the sequencer is put together, what it can and cannot do, and the vocabulary used throughout.',
        slug: '/foundations',
      },
      items: [
        { type: 'doc', id: 'foundations/architecture', label: 'Architecture at a glance' },
        { type: 'doc', id: 'foundations/trust-model', label: 'Trust model and guarantees' },
        { type: 'doc', id: 'foundations/glossary', label: 'App Sequencer glossary' },
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Core Concepts',
        description:
          'The mechanisms in detail: how operations become batches, reach L1, and stay in one agreed order.',
        slug: '/concepts',
      },
      items: [
        { type: 'doc', id: 'concepts/soft-confirmations', label: 'Soft confirmations' },
        { type: 'doc', id: 'concepts/batches-frames-safe-block', label: 'Batches, frames, and the safe block' },
        { type: 'doc', id: 'concepts/batch-tree', label: 'The batch tree' },
        { type: 'doc', id: 'concepts/direct-vs-sequenced', label: 'Direct inputs vs sequenced transactions' },
        { type: 'doc', id: 'concepts/staleness', label: 'Staleness and the danger zone' },
        { type: 'doc', id: 'concepts/fees', label: 'Fees and data availability' },
        { type: 'doc', id: 'concepts/execution-order', label: 'Deterministic execution order' },
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'API Reference',
        description:
          'The interfaces a client talks to: the HTTP and WebSocket API, the typed-data domain used to sign transactions, and the fixed values and codes around them.',
        slug: '/api-reference',
      },
      items: [
        { type: 'doc', id: 'api-reference/api', label: 'HTTP and WebSocket API' },
        { type: 'doc', id: 'api-reference/eip712', label: 'EIP-712 domain' },
        { type: 'doc', id: 'api-reference/constants-and-exit-codes', label: 'Constants and exit codes' },
      ],
    },
    {
      type: 'category',
      label: 'Usage Guide',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Usage Guide',
        description:
          'Build against the sequencer: meet the requirements an application has to satisfy, stand one up, submit transactions, and read the ordered feed.',
        slug: '/usage',
      },
      items: [
        { type: 'doc', id: 'usage/quickstart', label: 'Quickstart' },
        { type: 'doc', id: 'usage/application-requirements', label: 'Application requirements' },
        { type: 'doc', id: 'usage/integration', label: 'Application integration' },
        { type: 'doc', id: 'usage/submitting-operations', label: 'Submitting operations' },
        { type: 'doc', id: 'usage/reading-the-feed', label: 'Reading the sequenced feed' },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Tutorials',
        description:
          'Build complete examples with the App Sequencer, from a local development environment to signed operations and feed consumption.',
        slug: '/tutorials',
      },
      items: [
        { type: 'doc', id: 'tutorials/build-wallet-sequencer', label: 'Build a sequenced wallet' },
      ],
    },
    {
      type: 'category',
      label: 'Deployment & Operations',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Deployment & Operations',
        description:
          'Run a sequencer in production: set it up, configure it, secure it, and monitor it.',
        slug: '/operations',
      },
      items: [
        { type: 'doc', id: 'operations/setup-and-running', label: 'Configure and run' },
        { type: 'doc', id: 'operations/orchestration', label: 'Supervision and recovery' },
        { type: 'doc', id: 'operations/data-and-state', label: 'Data and backups' },
        { type: 'doc', id: 'operations/monitoring', label: 'Monitoring and watchdog' },
        { type: 'doc', id: 'operations/security', label: 'Production security' },
      ],
    },
    {
      type: 'category',
      label: 'Recovery and Resilience',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Recovery and Resilience',
        description:
          'How the sequencer survives failures: what can go wrong, the two repair paths, and the checkpoints a rebuild depends on.',
        slug: '/recovery',
      },
      items: [
        { type: 'doc', id: 'recovery/failure-modes', label: 'Failure modes' },
        { type: 'doc', id: 'recovery/preemptive', label: 'Preemptive recovery' },
        { type: 'doc', id: 'recovery/cockroach', label: 'Cockroach recovery' },
        { type: 'doc', id: 'recovery/snapshots', label: 'Snapshots and checkpoints' },
      ],
    },
    {
      type: 'category',
      label: 'Protocol and Internals',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Protocol and Internals',
        description:
          'The deep design: the rules the sequencer mirrors on-chain, its invariants, and its formal guarantees.',
        slug: '/advanced',
      },
      items: [
        { type: 'doc', id: 'advanced/scheduler-semantics', label: 'Scheduler semantics' },
        { type: 'doc', id: 'advanced/divergence', label: 'Divergence detection' },
        { type: 'doc', id: 'advanced/invariants', label: 'Invariants' },
        { type: 'doc', id: 'advanced/threat-model', label: 'Threat model' },
        { type: 'doc', id: 'advanced/formal-verification', label: 'Formal verification' },
      ],
    },
    {
      type: 'doc',
      id: 'troubleshooting',
      label: 'Troubleshooting',
    },
    {
      type: 'link',
      label: 'GitHub',
      href: 'https://github.com/cartesi/sequencer',
    },
  ],
};
