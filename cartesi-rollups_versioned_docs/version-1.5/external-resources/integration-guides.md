---
id: integration-guides
title: Integrations guide
---

Guides for integrating external protocols into your Cartesi application. Each integration offers a unique functionality to your application.

## Avail Integration

Avail is a Web3 infrastructure layer that allows modular execution layers to scale and interoperate in a trust minimized way. It stands out as one of the few data availability layers that combines validity proofs with data availability sampling. This guide will walk you through setting up a Cartesi dApp using Avail on your local machine. You will learn how to send transactions either directly (through Cartesi Rollups Smart Contracts deployed on an L1) or through Avail DA using EIP-712 signed messages. Also, how to inspect the dApp state and outputs through the APIs provided by the Cartesi Rollups Framework.

- **Resources**:
  - Integration Guide: [Mugen Docs](https://docs.mugen.builders/cartesi-avail-tutorial/introduction)

---

## Espresso Integration

Espresso is the protocol for coordinated block building: enabling & incentivizing chains to work together as one unified system. It offers low-cost data availability and also decentralized sequencing. This guide covers the Cartesi+Espresso integration and how to upgrade Cartesi application such that inputs can be submitted via Espresso instead of the regular base layer.

- **Resources**:
  - Integration Guide: [Docs](https://docs.google.com/document/d/1jKtuEPLPK7FUgAhkX7tMRjkIsNgAJ3OYrKtppjUYUrk/edit?tab=t.0#heading=h.fih7t9k0olyg)

---

## Push Integration

Push protocol is a web3 native communication network, enabling cross-chain notifications, messaging, and more for apps, wallets, and services. This integration is an application level integration that requires developers to run a specialized server for picking up and routing messages and notifications to the push network.

- **Resources**:
  - Integration Guide: [Github](https://github.com/Mugen-Builders/push-cartesi)
  - Demo Video: [Youtube](https://www.youtube.com/watch?v=SO-xhHT85Bk)

---

## Chronicle Integration

Chronicle is an oracle solution, making tremendous strides in redefining access to cost-efficient and verifiable data. Integrating Cartesi and Chronicle offers Cartesi applications access to onchain and offcahin data like, price feed without developers having to set up additional systems or intermediaries.

- **Resources**:
  - Integration Guide: [Github](https://github.com/Mugen-Builders/cartesi-chronicle-integration/tree/main)
  - Demo Video: [x](https://x.com/MichaelAsiedu_/status/1826200037786878012)

---

## Prevado ID

Prevado ID is a set of tools that enable secure identity verification they also facilitate trusted and secured relationship between apps and users. Integrating Cartesi and Prevado provides developers with the ability to verify users identity onchain using zero knowledge proofs, without having to concern themselves with the underlining architecture and setups.

- **Resources**:
  - Article Guide: [Medium](https://medium.com/@jathinjagannath/building-secure-scalable-and-private-dapps-with-decentralized-identity-management-f755991f012b)

---

## XMTP

XMTP is an open protocol, network, and standards for secure, private web3 messaging. Integrating Cartesi and XMTP will allow Cartesi applications to access this network for decentralized and private messaging, thereby allowing Cartesi applications communicate and also send messages/ notifications to users. At the moment this is an application level integration and would require the developer to set up and run a server dedicated to this integration.

- **Resources**:
  - Integration Guide: [Github](https://github.com/Mugen-Builders/xmtp-cartesi)
  - Demo Video: [x](https://x.com/shanemac/status/1828174660133101661?s=46)
  - Article Guide: [Medium](https://medium.com/@idogwuchi/integrating-cartesi-dapps-with-xmtp-bridging-decentralised-computation-and-secured-communication-360fa7bdb1d1)
